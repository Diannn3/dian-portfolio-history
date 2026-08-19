import { expect, test } from '@playwright/test';

/**
 * The production hero is intentionally allowed to use WebGL and live pointer
 * choreography. Pixel tests use the authored SVG fallback plus reduced motion
 * so the contract measures layout, type, copy, and the fallback composition,
 * not GPU timing.
 */
async function prepareDeterministicHero(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function getContext(
      contextId: string,
      ...rest: unknown[]
    ) {
      if (contextId === 'webgl' || contextId === 'webgl2') return null;
      return originalGetContext.call(this, contextId as never, ...(rest as never[]));
    };
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
}

const viewports = [
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 900 },
  { name: '1280', width: 1280, height: 900 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1440-short', width: 1440, height: 700 },
] as const;

for (const viewport of viewports) {
  test(`hero fallback contract / ${viewport.name}`, async ({ page }) => {
    await prepareDeterministicHero(page);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    await page.evaluate(() => document.fonts?.ready);
    await expect(page.locator('[data-hero] h1')).toContainText('BUILDS SYSTEMS');
    await expect(page.locator('[data-hero] h1')).toContainText('BETWEEN EQUATIONS');
    await expect(page.locator('[data-hero] h1')).toContainText('AND INTERFACES.');
    await expect(page.locator('[data-hero] > .sticky')).toHaveScreenshot(
      `hero-fallback-${viewport.name}.png`,
      {
        animations: 'disabled',
        caret: 'hide',
        maxDiffPixelRatio: 0.001,
      },
    );
  });
}

test('hero fallback keeps the protected identity values visible', async ({ page }) => {
  await prepareDeterministicHero(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('[data-hero]')).toContainText('VECTOR ATLAS / 2026');
  await expect(page.locator('[data-hero]')).toContainText('N 14.16° / E 121.24°');
  await expect(page.locator('[data-hero]')).toContainText('SCROLL / FIELD → DIAGRAM');
  await expect(page.locator('[data-hero] svg')).toBeVisible();
});

test('Work stage boundary remains static at 1279 and eligible at 1280', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, get: () => 8 });
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, get: () => 8 });
  });
  await page.setViewportSize({ width: 1279, height: 900 });
  await page.goto('/');
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-work-stage-shell]')).toHaveCount(0);
  await expect(page.locator('[data-work-preview="inline"]')).toHaveCount(4);

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.reload();
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-work-stage-shell]')).toHaveCount(1);
  await expect(page.locator('[data-work-preview="inline"]')).toHaveCount(0);
});
