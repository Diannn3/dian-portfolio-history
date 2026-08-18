import { test, expect } from '@playwright/test';

test('project pages load', async ({ page }) => {
  await page.goto('/work/uppetite');
  await expect(page.locator('h1')).toContainText('UPPETITE');
});