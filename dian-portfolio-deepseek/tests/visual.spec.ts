import { test, expect } from '@playwright/test';
test('homepage visual baseline', async ({page})=>{ await page.goto('/'); await page.emulateMedia({reducedMotion:'reduce'}); await expect(page).toHaveScreenshot('homepage.png',{fullPage:true,animations:'disabled'}); });
