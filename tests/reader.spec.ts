import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const titles = JSON.parse(readFileSync(new URL('../src/data/chapterTitles.json', import.meta.url), 'utf8'));
import { BIBLE_BOOKS } from '../src/data/bibleMeta';

test('every chapter has a study title', () => {
  expect(Object.keys(titles)).toHaveLength(66);
  let count = 0;
  for (const book of BIBLE_BOOKS) {
    const entries = (titles as Record<string, string[]>)[book.name];
    expect(entries, book.name).toHaveLength(book.chaptersCount);
    expect(entries.every((entry) => entry.trim().length > 0)).toBe(true);
    count += entries.length;
  }
  expect(count).toBe(1189);
});

test('next chapter starts at the top and can cross a book boundary', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.chapter-title')).toHaveText('The Creation');
  await page.getByRole('button', { name: 'Next Chapter', exact: true }).last().click();
  await expect(page.locator('article h2')).toHaveText('Chapter 2');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
  await page.locator('.chapter-strip button').last().click();
  await expect(page.locator('article h2')).toHaveText('Chapter 50');
  await expect(page.locator('[data-current-chapter="true"]')).toBeInViewport();
  await page.getByRole('button', { name: 'Next Chapter', exact: true }).last().click();
  await expect(page.locator('article h1')).toHaveText('Exodus');
  await expect(page.locator('article h2')).toHaveText('Chapter 1');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
});

test('individual verse versions are temporary and independent from the chapter', async ({ page }) => {
  await page.goto('./');
  const first = page.locator('.verse-row').first();
  const second = page.locator('.verse-row').nth(1);
  const originalSecond = await second.locator('[data-verse-text]').innerText();
  await expect(page.getByRole('button', { name: /^Select verse/ })).toHaveCount(0);
  await first.getByRole('button', { name: 'Change version for verse 1', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'NIV', exact: true }).click();
  await expect(first.locator('[data-verse-text]')).toHaveText('In the beginning God created the heavens and the earth.');
  await expect(first).toContainText('NIV · temporary');
  await expect(second.locator('[data-verse-text]')).toHaveText(originalSecond);
  await expect(page.getByRole('combobox', { name: 'Bible version', exact: true })).toHaveValue('KJV');
  await first.getByRole('button', { name: 'Change version for verse 1', exact: true }).click();
  await page.getByRole('menuitemradio', { name: '日本語 · 口語訳', exact: true }).click();
  await expect(first.locator('[data-verse-text]')).toHaveText('はじめに神は天と地とを創造された。');
  await expect(first.locator('[data-verse-text]')).toHaveAttribute('lang', 'ja');
  await page.reload();
  await expect(page.locator('[data-verse-text]').first()).toHaveText('In the beginning God created the heaven and the earth.');
  await expect(page.locator('.temporary-version')).toHaveCount(0);
});

test('failed local translation file can retry without silently substituting KJV', async ({ page }) => {
  let attempts = 0;
  await page.route('**/bible/NKJV/Genesis.json', async (route) => {
    attempts++;
    if (attempts === 1) await route.fulfill({ status: 503 });
    else await route.continue();
  });
  await page.goto('./');
  await page.getByRole('combobox', { name: 'Bible version', exact: true }).selectOption('NKJV');
  await expect(page.getByText('Could not load NKJV.', { exact: false })).toBeVisible();
  await expect(page.locator('.verse-row')).toHaveCount(0);
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.locator('[data-verse-text]').first()).toHaveText('In the beginning God created the heavens and the earth.');
});

test('responsive layout, drawer, verse actions and theme contrast', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.verse-row')).toHaveCount(31);
  for (const width of [320, 375, 768, 1024, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: 'Select Book', exact: true }).click();
  await expect(page.getByRole('complementary', { name: 'Bible books' })).toBeInViewport();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await page.keyboard.press('Escape');
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.locator('.verse-actions').first()).toHaveCSS('opacity', '1');
  await page.getByTitle('Switch to light theme', { exact: true }).click();
  await expect(page.locator('[data-verse-text]').first()).toHaveCSS('color', 'rgb(48, 50, 54)');
  await expect(page.locator('.app-header')).toHaveCSS('color', 'rgb(32, 33, 36)');
  await page.screenshot({ path: 'test-results/reader-mobile-light.png', fullPage: false });
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.getByTitle('Switch to dark theme', { exact: true }).click();
  await expect(page.locator('#root > div')).toHaveCSS('background-color', 'rgb(11, 12, 14)');
  await expect(page.locator('.main-nav [aria-current="page"]')).toHaveCSS('color', 'rgb(11, 12, 14)');
  await page.screenshot({ path: 'test-results/reader-desktop-dark.png', fullPage: false });
});

test('all bundled translations work with external network requests blocked', async ({ page }) => {
  const scriptureRequests: string[] = [];
  page.on('request', (request) => { if (request.url().includes('/bible/')) scriptureRequests.push(request.url()); });
  await page.route('**/*', (route) => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await page.goto('./');
  for (const version of ['NKJV', 'JPKJV', 'NIV']) {
    await page.getByRole('button', { name: 'Change version for verse 1', exact: true }).click();
    await page.getByRole('menuitemradio', { name: version === 'JPKJV' ? '日本語 · 口語訳' : version, exact: true }).click();
    await expect(page.locator('[data-verse-text]').first()).toHaveText(version === 'JPKJV' ? 'はじめに神は天と地とを創造された。' : 'In the beginning God created the heavens and the earth.');
    expect(scriptureRequests).toContain(new URL('bible/' + version + '/Genesis.json', page.url()).href);
  }
  await page.getByRole('combobox', { name: 'Bible version', exact: true }).selectOption('NIV');
  await expect(page.locator('.temporary-version')).toHaveCount(0);
  await page.getByRole('button', { name: 'Next Chapter', exact: true }).first().click();
  await expect(page.locator('article h2')).toHaveText('Chapter 2');
  await expect(page.locator('[data-verse-text]').first()).toHaveText('Thus the heavens and the earth were completed in all their vast array.');
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Bible version', exact: true })).toHaveValue('NIV');
  expect(scriptureRequests.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
});

test('all bundled editions use the KJV JSON schema and cover every chapter', () => {
  for (const version of ['NKJV', 'JPKJV', 'NIV']) {
    let verseCount = 0;
    for (const meta of BIBLE_BOOKS) {
      const book = JSON.parse(readFileSync(new URL(`../public/bible/${version}/${encodeURIComponent(meta.name)}.json`, import.meta.url), 'utf8'));
      expect(Object.keys(book).sort()).toEqual(['book', 'chapters']);
      expect(book.book).toBe(meta.name);
      expect(book.chapters).toHaveLength(meta.chaptersCount);
      for (const [index, chapter] of book.chapters.entries()) {
        expect(Object.keys(chapter).sort()).toEqual(['chapter', 'verses']);
        expect(chapter.chapter).toBe(String(index + 1));
        expect(chapter.verses.length).toBeGreaterThan(0);
        let previous = 0;
        for (const verse of chapter.verses) {
          assert.deepEqual(Object.keys(verse).sort(), ['text', 'verse']);
          assert.equal(typeof verse.verse, 'string');
          assert(Number(verse.verse) > previous, `${version} ${meta.name} ${chapter.chapter}:${verse.verse} must be unique and ordered`);
          assert.equal(typeof verse.text, 'string');
          assert(verse.text.trim().length > 0);
          assert(!/<\/?(?:sup|i|rt|ruby|script)\b/.test(verse.text));
          previous = Number(verse.verse);
          verseCount++;
        }
      }
    }
    const source = JSON.parse(readFileSync(new URL(`../public/bible/${version}/source.json`, import.meta.url), 'utf8'));
    expect(verseCount).toBe(source.verses);
    expect(source.chapters).toBe(1189);
  }
});

test('NIV preserves combined-line boundaries and omitted verse numbers', () => {
  const read = (book: string) => JSON.parse(readFileSync(new URL(`../public/bible/NIV/${encodeURIComponent(book)}.json`, import.meta.url), 'utf8'));
  const verse = (book: string, chapter: number, number: number) => read(book).chapters[chapter - 1].verses.find((item: { verse: string }) => item.verse === String(number))?.text;
  expect(verse('Exodus', 30, 24)).toBe('500 shekels of cassia-all according to the sanctuary shekel-and a hin of olive oil.');
  expect(verse('Numbers', 31, 33)).toBe('72,000 cattle,');
  expect(verse('Numbers', 31, 34)).toBe('61,000 donkeys');
  expect(verse('Numbers', 31, 38)).toContain('36,000 cattle');
  expect(verse('Numbers', 31, 39)).toContain('30,500 donkeys');
  expect(verse('Numbers', 31, 40)).toContain('16,000 people');
  expect(verse('Numbers', 31, 44)).toBe('36,000 cattle,');
  expect(verse('Numbers', 31, 45)).toBe('30,500 donkeys');
  expect(verse('Ezra', 2, 67)).toBe('435 camels and 6,720 donkeys.');
  expect(verse('Ezra', 8, 27)).toContain('20 bowls of gold');
  expect(verse('Nehemiah', 7, 69)).toBe('435 camels and 6,720 donkeys.');
  const source = JSON.parse(readFileSync(new URL('../public/bible/NIV/source.json', import.meta.url), 'utf8'));
  for (const [book, references] of Object.entries(source.omittedReferences)) {
    for (const ref of references as string[]) {
      const [chapter, number] = ref.split(':').map(Number);
      expect(verse(book, chapter, number)).toBeUndefined();
      expect(verse(book, chapter, number + 1)).toBeTruthy();
    }
  }
  expect(verse('Matthew', 17, 22)).toContain('Galilee');
  expect(verse('Acts', 8, 38)).toContain('chariot');
  const psalms = read('Psalms');
  expect(psalms.chapters).toHaveLength(150);
  expect(psalms.chapters.reduce((sum: number, chapter: { verses: unknown[] }) => sum + chapter.verses.length, 0)).toBe(2461);
  expect(verse('Revelation', 22, 21)).toBe("The grace of the Lord Jesus be with God's people. Amen.");
  expect(source.verses).toBe(31086);
});
