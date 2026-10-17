import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

async function selectText(element: Locator, text: string) {
  await element.evaluate((node, value) => {
    const start = node.textContent!.indexOf(value);
    if (start < 0) throw new Error(`Selection text not found: ${value}`);
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let offset = 0, begun = false;
    while (walker.nextNode()) {
      const current = walker.currentNode;
      const length = current.textContent!.length;
      if (!begun && start < offset + length) { range.setStart(current, start - offset); begun = true; }
      if (begun && start + value.length <= offset + length) { range.setEnd(current, start + value.length - offset); break; }
      offset += length;
    }
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  }, text);
}

test('Bible words and phrases open meanings without an external dictionary', async ({ page }) => {
  await page.route('**/api.dictionaryapi.dev/**', (route) => route.abort());
  await page.goto('./');
  await expect(page.locator('[data-verse-text]').first()).toBeVisible();
  await selectText(page.locator('[data-verse-text]').first(), 'God');
  const card = page.getByRole('dialog', { name: 'Word and phrase meaning' });
  await expect(card).toContainText('creator and sustainer');
  await expect(card).toContainText('Genesis 1:1');
  await expect(card).toContainText('Modern wording · NIV');
  await page.keyboard.press('Escape');
  await expect(card).toHaveCount(0);
  await page.getByRole('combobox', { name: 'Bible version', exact: true }).selectOption('NIV');
  await page.getByPlaceholder('Search 66 books...').fill('Exodus');
  await page.getByRole('complementary', { name: 'Bible books' }).getByRole('button', { name: /Exodus/ }).click();
  await page.locator('.chapter-strip button').nth(12).click();
  await expect(page.locator('article h2')).toHaveText('Chapter 13');
  const abib = page.locator('[data-verse="4"] [data-verse-text]');
  await selectText(abib, 'Abib');
  await expect(card).toContainText('March–April');
  await expect(card).toContainText('Exodus 13:4');
  await selectText(page.locator('[data-verse="5"] [data-verse-text]'), 'land flowing with milk and honey');
  await expect(card).toContainText('fertile land');
  await expect(card).toContainText('Exodus 13:5');
  await page.screenshot({ path: 'test-results/phrase-meaning-desktop.png' });
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(card).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/phrase-meaning-mobile.png' });
});

test('English dictionary definitions load and network errors have a retry', async ({ page }) => {
  let failed = true;
  await page.route('**/dictionary/english.json', (route) => route.fulfill({ status: 503 }));
  await page.route('**/api.dictionaryapi.dev/**', (route) => failed
    ? route.fulfill({ status: 503 })
    : route.fulfill({ json: [{ word: 'created', meanings: [{ partOfSpeech: 'verb', definitions: [{ definition: 'Brought something into existence.' }] }], sourceUrls: ['https://en.wiktionary.org/wiki/create'] }] }));
  await page.goto('./');
  await selectText(page.locator('[data-verse-text]').first(), 'created');
  const card = page.getByRole('dialog', { name: 'Word and phrase meaning' });
  await expect(card).toContainText('dictionary could not be reached');
  await expect(card).toContainText('Modern wording');
  failed = false;
  await card.getByRole('button', { name: 'Try lookup again' }).click();
  await expect(card).toContainText('Brought something into existence.');
  await expect(card.getByRole('link')).toHaveAttribute('href', 'https://en.wiktionary.org/wiki/create');
});

test('verse menu handles keyboard, missing verses, and original text labels', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./');
  const first = page.locator('.verse-row').first();
  await first.getByRole('button', { name: 'Change version for verse 1', exact: true }).click();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(first).toContainText('NKJV · temporary');
  await first.getByTitle('Copy verse', { exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('(NKJV)');
  await first.getByRole('button', { name: 'Reset to KJV' }).click();
  await expect(first.locator('[data-verse-text]')).toHaveText('In the beginning God created the heaven and the earth.');
  await page.getByPlaceholder('Search 66 books...').fill('Matthew');
  await page.getByRole('complementary', { name: 'Bible books' }).getByRole('button', { name: /Matthew/ }).click();
  await page.locator('.chapter-strip button').nth(16).click();
  await expect(page.locator('article h2')).toHaveText('Chapter 17');
  const omitted = page.locator('[data-verse="21"]');
  const original = await omitted.locator('[data-verse-text]').innerText();
  await omitted.getByRole('button', { name: 'Change version for verse 21', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'NIV', exact: true }).click();
  await expect(omitted.getByRole('alert')).toContainText('not separately numbered');
  await expect(omitted.locator('[data-verse-text]')).toHaveText(original);
  await expect(omitted.locator('[data-verse-text]')).toHaveAttribute('data-version', 'KJV');
});

test('custom site tab icon is served', async ({ page }) => {
  await page.goto('./');
  const icon = page.locator('link[rel="icon"]');
  await expect(icon).toHaveAttribute('href', /canon-chronos\.svg$/);
  const response = await page.request.get((await icon.getAttribute('href'))!);
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain('Canon and Chronos');
});

test('general English meanings use the bundled dictionary with external requests blocked', async ({ page }) => {
  await page.route('**/*', (route) => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await page.goto('./');
  await expect(page.locator('[data-verse-text]').first()).toBeVisible();
  await selectText(page.locator('[data-verse-text]').first(), 'created');
  const card = page.getByRole('dialog', { name: 'Word and phrase meaning' });
  await expect(card).toContainText('WordNet (bundled)');
  await expect(card.getByRole('link').first()).toHaveAttribute('href', 'https://wordnet.princeton.edu/');
  await selectText(page.locator('[data-verse-text]').first(), 'earth');
  await expect(card.locator('h3')).toContainText('earth');
  await expect(card).toContainText('WordNet (bundled)');
  await expect(card).not.toContainText('dictionary could not be reached');
  await card.getByRole('button', { name: 'Close meaning' }).click();
  await page.locator('article h1').click();
  await expect(card).toHaveCount(0);
});
