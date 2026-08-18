import { test, expect } from '@playwright/test';

const viewports = [
  { width: 375, height: 812 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

test('homepage renders core structure', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'DIAN' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Projects that turn systems/i })).toBeVisible();
});

test('mobile menu is usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/#about/);
});

for (const viewport of viewports) {
  test(`no horizontal overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const fits = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
    expect(fits).toBe(true);
  });
}

test('reduced motion stays readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByText(/Builds systems between equations/i)).toBeVisible();
  await expect(page.locator('[data-spline-artifact]')).toBeVisible();
});

test('@visual hero desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('#hero')).toHaveScreenshot('hero-desktop.png', { animations: 'disabled' });
});

test('@visual hero mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('#hero')).toHaveScreenshot('hero-mobile.png', { animations: 'disabled' });
});
