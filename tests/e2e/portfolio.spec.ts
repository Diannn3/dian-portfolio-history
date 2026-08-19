import { expect, test } from '@playwright/test';
import catalog from '../../src/data/projectCatalog.json' with { type: 'json' };

const expectedTitle = (project: (typeof catalog)[number]) =>
  `${project.title} — ${project.category} / Dian`;

test('home exposes the Atlas shell and primary portfolio landmarks', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#main')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Selected Work' })).toBeVisible();
  await expect(page.locator('header[data-rail-mode]')).toBeVisible();
  await expect(page.getByRole('button', { name: /INDEX/i })).toBeVisible();
});

test('Atlas index traps focus, closes with Escape, and restores focus', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === 'mobile-chromium',
    'Focus restoration coverage runs in desktop Chromium; touch emulation has no keyboard focus model.',
  );
  await page.goto('/');
  const trigger = page.getByRole('button', { name: /INDEX/i });
  await trigger.focus();
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: /PROJECTS/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: /UPPETITE/i })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('contact finale restores the full-width streamline composition and verified CTA', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const contact = page.locator('#contact');
  await contact.scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: /Have a weird problem.*Let's build something useful\./i })).toBeVisible();
  await expect(contact.locator('[data-contact-field]')).toHaveCount(1);
  const primary = contact.getByRole('link', { name: /VIEW GITHUB/i });
  await expect(primary).toHaveAttribute('href', 'https://github.com/Diannn3');
  await expect(contact.getByText('PROJECTS / CODE / EXPERIMENTS')).toBeVisible();
  await expect(contact.getByText('FIG / BEARING')).toHaveCount(0);
});

test('desktop section anchor navigation reaches Work with Lenis-compatible hashes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const workLink = page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'WORK' });
  await workLink.click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator('#work')).toBeInViewport({ ratio: 0.2 });
});

test('tablet Work ledger keeps inline previews instead of a dead stage gap', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/');
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-work-preview="inline"]')).toHaveCount(catalog.length);
  await expect(page.locator('[data-work-stage-shell]')).toHaveCount(0);
});

test('wide low-capability desktop keeps the SVG fallback instead of forcing WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, get: () => 2 });
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, get: () => 2 });
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-work-stage-shell]')).toHaveCount(0);
  await expect(page.locator('[data-work-preview="inline"]')).toHaveCount(catalog.length);
});

test('wide capable desktop Work ledger progressively enhances to one shared stage shell', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === 'mobile-chromium',
    'The stage requires a fine pointer; the mobile project validates the static Work fallback instead.',
  );
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, get: () => 8 });
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, get: () => 8 });
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-work-stage-shell]')).toHaveCount(1);
  await expect(page.locator('[data-work-preview="inline"]')).toHaveCount(0);
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
    await expect(page.locator('header[data-rail-mode="project"]')).toBeVisible();
  });
}

test('direct lazy case-study hash deep link reaches its chapter', async ({ page }) => {
  await page.goto('/work/uppetite/#case-01-context');
  await expect(page.locator('#case-01-context')).toBeInViewport({ ratio: 0.1 });
});

test('post-hero orientation and Selected Work hierarchy are evidence-led', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const orientation = page.locator('[data-orientation]');
  await expect(orientation).toBeVisible();
  await expect(orientation.locator('[data-orientation-copy]')).toContainText(
    'A small atlas of product systems, studio practice, and system studies.',
  );
  await expect(orientation.getByRole('link', { name: /VIEW SELECTED WORK/i })).toHaveAttribute('href', '#work');

  const work = page.locator('#work');
  await expect(work.getByRole('heading', { name: 'Product Systems' })).toBeVisible();
  await expect(work.getByRole('heading', { name: 'Studio Practice' })).toBeVisible();
  await expect(work.getByRole('heading', { name: 'System Studies' })).toBeVisible();
  await expect(work.locator('[data-work-evidence]')).toHaveCount(2);
  await expect(work.getByRole('link', { name: /VISIT AESCENT/i })).toHaveAttribute(
    'href',
    'https://aescentwebstudios.com/',
  );
  await expect(work.getByText('PUBLIC REPOSITORY', { exact: true })).toHaveCount(0);
  await expect(work.locator('[data-study-entry]')).toHaveCount(2);
  await expect(work.locator('[data-study-entry]').first()).toContainText('CONCEPT STUDY');
});

test('About carries one concise Aescent trajectory marker without changing Contact', async ({ page }) => {
  await page.goto('/');
  const about = page.locator('#about');
  await expect(about.locator('[data-trajectory-marker]')).toHaveCount(1);
  await expect(about.locator('[data-trajectory-marker]')).toContainText(
    'Founder of Aescent Web Studio and a UPLB student here in Laguna.',
  );
  await expect(page.locator('#contact')).not.toContainText('Aescent', { timeout: 1000 });
  await expect(page.locator('#contact').getByRole('link', { name: /VIEW GITHUB/i })).toHaveCount(1);
  await expect(page.locator('[data-contact-actions]')).toHaveCount(0);
});

for (const product of catalog.slice(0, 2)) {
  test(`${product.slug} opening exposes proof state, role and media provenance`, async ({ page }) => {
    await page.goto(`/work/${product.slug}/`);
    const main = page.locator('#main');
    const lead = main.locator('[data-case-lead-evidence]');
    await expect(lead).toHaveCount(1);
    await expect(lead.locator('img')).toBeVisible();
    await expect(lead.getByText('PROVES', { exact: true })).toBeVisible();
    await expect(lead.getByText('DATA STATE', { exact: true })).toBeVisible();
    await expect(lead.getByText('SOURCE', { exact: true })).toBeVisible();
    await expect(lead).toContainText(/audit derivative/i);
    await expect(main).toHaveAttribute(
      'data-project-evidence',
      product.slug === 'uppetite' ? 'IMPLEMENTATION' : 'PROTOTYPE',
    );
    await expect(main.getByText('ROLE', { exact: true })).toBeVisible();
  });
}

test('case index uses real hash navigation and updates project reading context', async ({ page }) => {
  await page.goto('/work/uppetite/');
  const caseIndex = page.getByRole('navigation', { name: 'Case study sections' });
  const first = caseIndex.getByRole('link').first();
  const href = await first.getAttribute('href');
  expect(href).toMatch(/^#case-/);
  await first.click();
  await expect(page).toHaveURL(new RegExp(`${href!.replace('#', '#')}$`));
  await expect(page.locator(href!)).toBeInViewport({ ratio: 0.1 });
});

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
