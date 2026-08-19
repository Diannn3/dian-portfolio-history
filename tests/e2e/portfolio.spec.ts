import { expect, test } from '@playwright/test';
import catalog from '../../src/data/projectCatalog.json';

const expectedTitle = (project: (typeof catalog)[number]) =>
  `${project.title} — ${project.category} / Dian`;

test('home exposes the primary portfolio landmarks', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#main')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'SELECTED WORK' })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
});

for (const project of catalog) {
  test(`${project.slug} has a direct static entry and renders its case study`, async ({ page, request }) => {
    const response = await request.get(`/work/${project.slug}/`);
    expect(response.ok()).toBeTruthy();
    const initialHtml = await response.text();
    expect(initialHtml).toContain(`<title>${expectedTitle(project)}</title>`);
    expect(initialHtml).toContain(project.summary);

    await page.goto(`/work/${project.slug}/`);
    await expect(page.getByRole('heading', { name: project.title })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Case study sections' })).toBeVisible();
  });
}

test('unknown client route renders the atlas 404 and marks it noindex', async ({ page }) => {
  await page.goto('/this-coordinate-does-not-exist');
  await expect(page.getByRole('heading', { name: 'Outside defined field.' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');
});

test('generated 404 entry is noindex before JavaScript runs', async ({ request }) => {
  const response = await request.get('/404.html');
  expect(response.ok()).toBeTruthy();
  const html = await response.text();
  expect(html).toContain('noindex,follow');
  expect(html).toContain('404 — Outside Defined Field / Dian');
});
