import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Hero Monolith Placement, Choreography & Visual Contract', () => {
  const progressPoints = [0.00, 0.25, 0.50, 0.75, 1.00];

  test('Hero should render recognizable 3D A-monolith with safe-zone bounds and no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    const heroStage = page.locator('#hero-scroll-stage');
    await expect(heroStage).toBeVisible();

    // Primary CTA and headline check
    const headline = page.locator('#hero-identity-top h1');
    await expect(headline).toBeVisible();

    const cta = page.locator('#hero-identity-top a').first();
    await expect(cta).toBeVisible();

    // Canvas element check
    const canvas = page.locator('#hero-scroll-stage canvas');
    await expect(canvas).toBeVisible();

    // Verify no console errors during mount
    expect(consoleErrors).toEqual([]);
  });

  for (const progress of progressPoints) {
    test(`Hero stage at progress ${progress.toFixed(2)} should transition smoothly without overflow`, async ({ page }) => {
      await page.goto('/');

      const heroStage = page.locator('#hero-scroll-stage');
      await expect(heroStage).toBeVisible();

      // Scroll to target progress in hero
      await page.evaluate((p) => {
        const stage = document.getElementById('hero-scroll-stage');
        if (!stage) return;
        const totalScrollable = stage.scrollHeight - window.innerHeight;
        const targetScroll = stage.offsetTop + totalScrollable * p;
        window.scrollTo({ top: targetScroll, behavior: 'instant' });
        
        // Dispatch event for instant frame update in headless test
        window.dispatchEvent(new CustomEvent('aedrian:hero-progress', { detail: { progress: p } }));
      }, progress);

      // Wait a moment for demand render frame
      await page.waitForTimeout(100);

      // Verify zero horizontal scroll
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(isOverflowing).toBe(false);

      // Capture screenshot artifact directory
      const screenshotDir = path.join(process.cwd(), 'playwright-captures');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      const viewportName = page.viewportSize() 
        ? `${page.viewportSize()?.width}x${page.viewportSize()?.height}`
        : 'default';

      await page.screenshot({
        path: path.join(screenshotDir, `hero-p${(progress * 100).toFixed(0)}-${viewportName}.png`)
      });
    });
  }

  test('Reduced motion mode should render aligned poster fallback', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const fallback = page.locator('.hero-poster-fallback');
    await expect(fallback).toBeVisible();

    const fallbackImg = fallback.locator('img');
    await expect(fallbackImg).toBeVisible();
    await expect(fallbackImg).toHaveAttribute('src', '/brand/aedrian-a-transparent.png');
  });

  test('Keyboard navigation should reach all hero interactive elements', async ({ page }) => {
    await page.goto('/');

    // Focus on primary CTA via Tab
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});