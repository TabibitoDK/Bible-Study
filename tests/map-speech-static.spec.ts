import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function mockSpeech(page: Page) {
  await page.addInitScript(() => {
    const voices = [
      { name: 'Basic English', lang: 'en-US', voiceURI: 'basic', default: true },
      { name: 'Natural English', lang: 'en-US', voiceURI: 'natural', default: false },
      { name: 'Natural Japanese', lang: 'ja-JP', voiceURI: 'japanese', default: false },
    ];
    const log: { text: string; rate: number; lang: string; voice: string }[] = [];
    let current: { text: string; rate: number; lang: string; voice?: { voiceURI: string }; onend?: () => void; onerror?: (event: { error: string }) => void } | null = null;
    const engine = { speak: (value: NonNullable<typeof current>) => { current = value; log.push({ text: value.text, rate: value.rate, lang: value.lang, voice: value.voice?.voiceURI || '' }); },
      cancel: () => { current = null; }, pause: () => {}, resume: () => {}, getVoices: () => voices, addEventListener: () => {}, removeEventListener: () => {} };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: engine });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class { text: string; constructor(text: string) { this.text = text; } } });
    Object.assign(window, { speechLog: log, finishSpeech: () => current?.onend?.(), failSpeech: () => current?.onerror?.({ error: 'network' }) });
  });
}
async function finish(page: Page) {
  await page.evaluate(() => (window as unknown as { finishSpeech: () => void }).finishSpeech());
  await page.waitForTimeout(65);
}

test('map places and details stay above Leaflet on desktop and mobile', async ({ page }) => {
  await page.route('**/*.tile.openstreetmap.org/**', (route) => route.abort());
  await page.goto('./');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('button', { name: 'Atlas', exact: true }).click();
  const places = page.getByRole('complementary', { name: 'Biblical places' });
  await expect(places).toBeVisible();
  await places.getByRole('button', { name: /Jerusalem/ }).click();
  const details = page.getByRole('complementary', { name: 'Location details' });
  await expect(details.getByRole('heading', { name: /Jerusalem/, level: 2 })).toBeVisible();
  const above = await details.evaluate((element) => { const box = element.getBoundingClientRect(); return element.contains(document.elementFromPoint(box.x + 20, box.y + 20)); });
  expect(above).toBe(true);
  await page.screenshot({ path: 'test-results/map-desktop.png' });
  await details.getByRole('button', { name: 'Close location details' }).click();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByPlaceholder('Search biblical place...').fill('Bethlehem');
  await places.getByRole('button', { name: /Bethlehem/ }).click();
  await expect(details.getByRole('heading', { name: /Bethlehem/, level: 2 })).toBeVisible();
  await expect(details.getByRole('button', { name: 'Close location details' })).toBeInViewport();
  await page.screenshot({ path: 'test-results/map-mobile.png' });
  await details.getByRole('button', { name: 'Close location details' }).click();
  await page.getByRole('button', { name: 'Show places', exact: true }).click();
  await expect(places).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('map scripture links and keyboard search navigate on the static site', async ({ page }) => {
  await page.route('**/*.tile.openstreetmap.org/**', (route) => route.abort());
  await page.goto('./');
  await page.getByRole('navigation').getByRole('button', { name: 'Atlas', exact: true }).click();
  await page.getByRole('complementary', { name: 'Biblical places' }).getByRole('button', { name: /Jerusalem/ }).click();
  await page.getByRole('complementary', { name: 'Location details' }).getByRole('button', { name: 'Genesis 14:18-20', exact: true }).click();
  await expect(page.locator('article h2')).toHaveText('Chapter 14');
  await expect(page.locator('[data-verse="18"]')).toHaveClass(/border-l-2/);
  await page.keyboard.press('Control+k');
  await page.getByPlaceholder(/Search scripture/).fill('Song of Solomon 2:1');
  await page.getByRole('button', { name: /Song of Solomon 2:1/ }).click();
  await expect(page.locator('article h1')).toHaveText('Song of Solomon');
  await expect(page.locator('article h2')).toHaveText('Chapter 2');
});

test('speech uses natural voices, omits numbers, supports rate/pause, and continues chapters', async ({ page }) => {
  await mockSpeech(page);
  await page.goto('./');
  await page.getByRole('combobox', { name: 'Reading speed' }).selectOption('1.5');
  await page.getByRole('button', { name: 'Listen to chapter' }).click();
  await expect(page.getByRole('button', { name: 'Pause reading' })).toBeVisible();
  let log = await page.evaluate(() => (window as unknown as { speechLog: { text: string; rate: number; voice: string }[] }).speechLog);
  expect(log[0].text).toBe('In the beginning God created the heaven and the earth.');
  expect(log[0].rate).toBe(1.5); expect(log[0].voice).toBe('natural');
  await page.getByRole('button', { name: 'Pause reading' }).click();
  await expect(page.getByRole('button', { name: 'Resume reading' })).toBeVisible();
  await page.getByRole('button', { name: 'Resume reading' }).click();
  await page.getByRole('combobox', { name: 'Reading speed' }).selectOption('0.75');
  log = await page.evaluate(() => (window as unknown as { speechLog: { text: string; rate: number; voice: string }[] }).speechLog);
  expect(log.at(-1)?.rate).toBe(.75);
  for (let index = 0; index < 150; index++) {
    if (await page.locator('article h2').textContent() === 'Chapter 2') break;
    await finish(page);
  }
  await expect(page.locator('article h2')).toHaveText('Chapter 2');
  await expect(page.getByRole('button', { name: 'Pause reading' })).toBeVisible();
  await page.getByRole('button', { name: 'Stop reading' }).click();
  await finish(page);
  await expect(page.getByRole('button', { name: 'Listen to chapter' })).toBeVisible();
  await page.getByRole('combobox', { name: 'Bible version', exact: true }).selectOption('JPKJV');
  await page.getByRole('button', { name: 'Listen to chapter' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { speechLog: { voice: string }[] }).speechLog.at(-1)?.voice)).toBe('japanese');
});

test('speech crosses book boundaries, stops for navigation and handles errors', async ({ page }) => {
  await mockSpeech(page); await page.goto('./');
  await page.locator('.chapter-strip button').last().click();
  await expect(page.locator('article h2')).toHaveText('Chapter 50');
  await page.getByRole('button', { name: 'Listen to chapter' }).click();
  for (let index = 0; index < 100; index++) {
    if (await page.locator('article h1').textContent() === 'Exodus') break;
    await finish(page);
  }
  await expect(page.locator('article h1')).toHaveText('Exodus');
  await expect(page.locator('article h2')).toHaveText('Chapter 1');
  await page.getByRole('button', { name: 'Next Chapter', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Listen to chapter' })).toBeVisible();
  await page.getByRole('button', { name: 'Listen to chapter' }).click();
  await expect(page.getByRole('button', { name: 'Pause reading' })).toBeVisible();
  await page.evaluate(() => (window as unknown as { failSpeech: () => void }).failSpeech());
  await expect(page.getByRole('alert')).toContainText('Reading stopped');
});

test('static app has no personal study features and tolerates blocked storage', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
  });
  await page.goto('./');
  await expect(page.locator('.verse-row')).toHaveCount(31);
  await expect(page.getByRole('button', { name: /bookmark|highlight verse|study note|^Notes$/i })).toHaveCount(0);
  await page.getByRole('combobox', { name: 'Bible version', exact: true }).selectOption('NIV');
  await expect(page.locator('[data-verse-text]').first()).toHaveText('In the beginning God created the heavens and the earth.');
  await page.getByTitle('Switch to light theme', { exact: true }).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});
