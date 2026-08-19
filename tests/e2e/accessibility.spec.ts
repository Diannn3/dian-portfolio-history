import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/work/uppetite/', '/work/campus-navigation/'];

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

test('reduced-motion preference preserves readable content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#main')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'SELECTED WORK' })).toBeVisible();
});
