import { test, expect } from '@playwright/test';

test.describe('Responsive Layout & Navigation Audits', () => {
  const routes = [
    '/',
    '/work/',
    '/work/uppetite/',
    '/work/aedriain/',
    '/work/ims-academic-hub/',
    '/work/aescent-web-studio/',
    '/about/'
  ];

  for (const route of routes) {
    test(`Route "${route}" should load with 200 OK and no horizontal scroll`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);

      // Verify zero horizontal scroll
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(isOverflowing).toBe(false);
    });
  }

  test('Homepage should render 3D Hero stage, atmospheric layers, and primary CTA', async ({ page }) => {
    await page.goto('/');

    const cta = page.getByRole('link', { name: /Let’s build a system together/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', 'https://www.linkedin.com/in/aedrian-ponce-a602b0398/');

    const heroStage = page.locator('#hero-scroll-stage');
    await expect(heroStage).toBeVisible();

    const atmospheric = page.locator('.atmospheric-wrapper');
    await expect(atmospheric).toBeVisible();
  });

  test('Homepage Systems Explorer should interactively switch tabs and display telemetry', async ({ page }) => {
    await page.goto('/');

    const explorer = page.locator('#explorer');
    await explorer.scrollIntoViewIfNeeded();

    const mathTab = page.getByRole('button', { name: /Discrete Graph & Isochrone/i });
    await expect(mathTab).toBeVisible();
    await mathTab.click();

    await expect(page.getByText('A* Heuristic')).toBeVisible();
    await expect(page.getByText('O(E + V log V)')).toBeVisible();
  });

  test('Work index should display all 4 case study cards with evidence badges', async ({ page }) => {
    await page.goto('/work/');

    await expect(page.getByRole('heading', { name: 'UPPETITE' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'AedriAIn — Prototype 01' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'IMS Academic Hub' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aescent Web Studio' })).toBeVisible();

    const badges = page.locator('text=Conceptual System Study');
    expect(await badges.count()).toBeGreaterThanOrEqual(4);
  });

  test('Case study page should render 12-section structure and system study visual', async ({ page }) => {
    await page.goto('/work/uppetite/');

    await expect(page.getByRole('heading', { name: /UPPETITE/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /1\. Artifact & Honest Evidence State/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /5\. Architecture/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /12\. Repository & Links/i })).toBeVisible();
  });

  test('404 route should render clean error stage and recovery navigation', async ({ page }) => {
    const response = await page.goto('/404/');
    expect(response?.status()).toBe(200);
    await expect(page.getByText('Coordinate Not Found')).toBeVisible();
    await expect(page.getByRole('link', { name: /Return to Index/i })).toBeVisible();
  });
});
