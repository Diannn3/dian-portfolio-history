import { expect, test } from '@playwright/test';

const matrix = [360, 390, 430, 768, 1024, 1279, 1280, 1440, 1920];

for (const width of matrix) {
  test(`responsive matrix / ${width}px has no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('#main')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('200% zoom keeps the document readable and horizontally contained', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.style.zoom = '2';
  });
  await expect(page.locator('#main')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole('heading', { name: 'Selected Work' })).toBeVisible();
});

test('forced colors keeps the primary landmarks and keyboard entry points', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Selected Work' })).toBeVisible();
  const index = page.getByRole('button', { name: /INDEX/i });
  await index.focus();
  await expect(index).toBeFocused();
  await index.press('Enter');
  await expect(page.getByRole('dialog', { name: /PROJECTS/i })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: /PROJECTS/i })).toBeHidden();
});
