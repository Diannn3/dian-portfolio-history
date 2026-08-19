import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/work/uppetite/', '/work/campus-navigation/', '/work/pasada/', '/work/disaster-response/'];

for (const route of routes) {
  test(`${route} has no serious or critical automated accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const result = await new AxeBuilder({ page }).analyze();
    const severe = result.violations.filter((violation) =>
      violation.impact === 'serious' || violation.impact === 'critical',
    );
    expect(severe).toEqual([]);
  });
}

test('skip link reaches main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page.locator('#main')).toBeInViewport({ ratio: 0.1 });
});

test('keyboard users can enter the case index and diagram text alternative', async ({ page }) => {
  await page.goto('/work/uppetite/');
  const caseIndex = page.getByRole('navigation', { name: 'Case study sections' });
  await expect(caseIndex).toBeVisible();
  await caseIndex.getByRole('link').first().focus();
  await expect(caseIndex.getByRole('link').first()).toBeFocused();

  const textAlternative = page.getByText('View system as text +').first();
  await textAlternative.scrollIntoViewIfNeeded();
  await textAlternative.focus();
  await expect(textAlternative).toBeFocused();
});

test('Discipline Graph exposes real keyboard controls and a text equivalent', async ({ page }) => {
  await page.goto('/');
  await page.locator('#about').scrollIntoViewIfNeeded();
  const button = page.locator('#about button').first();
  await button.focus();
  await expect(button).toBeFocused();
  await expect(page.locator('#about dl').first()).toBeVisible();
});

test('reduced-motion preference preserves content and disables the route mask', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#main')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Selected Work' })).toBeVisible();
  await expect(page.locator('[data-route-mask]')).toHaveCount(0);
  await expect(page.locator('[data-work-stage-shell]')).toHaveCount(0);
});
