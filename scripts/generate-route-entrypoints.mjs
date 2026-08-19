import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.resolve(root, process.env.DIST_DIR || 'dist');
const catalogPath = path.join(root, 'src/data/projectCatalog.json');
const indexPath = path.join(dist, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error(`ROUTES FAIL: ${indexPath} does not exist. Run this after the Vite build.`);
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const baseHtml = fs.readFileSync(indexPath, 'utf8');
const siteUrl = (process.env.SITE_URL || '').replace(/\/$/, '');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function setTitle(html, title) {
  const tag = `<title>${escapeHtml(title)}</title>`;
  return /<title>.*?<\/title>/s.test(html)
    ? html.replace(/<title>.*?<\/title>/s, tag)
    : html.replace('</head>', `  ${tag}\n  </head>`);
}

function setNamedMeta(html, name, content) {
  const escaped = escapeHtml(content);
  const re = new RegExp(`<meta\\s+name=["']${name}["'][^>]*>`, 'i');
  const tag = `<meta name="${name}" content="${escaped}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n  </head>`);
}

function setPropertyMeta(html, property, content) {
  const escaped = escapeHtml(content);
  const re = new RegExp(`<meta\\s+property=["']${property}["'][^>]*>`, 'i');
  const tag = `<meta property="${property}" content="${escaped}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n  </head>`);
}

function setCanonical(html, pathname) {
  if (!siteUrl) return html;
  const href = `${siteUrl}${pathname}`;
  const tag = `<link rel="canonical" href="${escapeHtml(href)}" />`;
  const re = /<link\s+rel=["']canonical["'][^>]*>/i;
  html = re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n  </head>`);
  return setPropertyMeta(html, 'og:url', href);
}

const homeMeta = {
  title: 'Dian — systems between equations and interfaces',
  description: 'Applied Mathematics student building software, AI, maps, spatial systems and experimental interfaces.',
  pathname: '/',
};

function routeHtml({ title, description, pathname, noIndex = false, socialImage }) {
  let html = baseHtml;
  html = setTitle(html, title);
  html = setNamedMeta(html, 'description', description);
  html = setNamedMeta(html, 'robots', noIndex ? 'noindex,follow' : 'index,follow');
  const hasSocialImage = Boolean(siteUrl && socialImage);
  html = setNamedMeta(html, 'twitter:card', hasSocialImage ? 'summary_large_image' : 'summary');
  html = setPropertyMeta(html, 'og:title', title);
  html = setPropertyMeta(html, 'og:description', description);
  html = setPropertyMeta(html, 'og:type', 'website');
  if (hasSocialImage) {
    const imageHref = `${siteUrl}${socialImage}`;
    html = setPropertyMeta(html, 'og:image', imageHref);
    html = setNamedMeta(html, 'twitter:image', imageHref);
  }
  if (!noIndex) html = setCanonical(html, pathname);
  return html;
}

fs.writeFileSync(indexPath, routeHtml(homeMeta));

for (const project of catalog) {
  const pathname = `/work/${project.slug}`;
  const outDir = path.join(dist, 'work', project.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'index.html'),
    routeHtml({
      title: `${project.title} — ${project.category} / Dian`,
      description: project.summary,
      pathname,
      socialImage: project.socialImage,
    }),
  );
}

fs.writeFileSync(
  path.join(dist, '404.html'),
  routeHtml({
    title: '404 — Outside Defined Field / Dian',
    description: 'The requested coordinate does not belong to this atlas.',
    pathname: '/404',
    noIndex: true,
  }),
);

const robots = ['User-agent: *', 'Allow: /', ...(siteUrl ? [`Sitemap: ${siteUrl}/sitemap.xml`] : []), ''].join('\n');
fs.writeFileSync(path.join(dist, 'robots.txt'), robots);

if (siteUrl) {
  const urls = ['/', ...catalog.map((project) => `/work/${project.slug}`)];
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((pathname) => `  <url><loc>${escapeHtml(`${siteUrl}${pathname}`)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml);
}

console.log(`ROUTES OK: generated ${catalog.length} project entrypoints + 404.html + robots.txt${siteUrl ? ' + sitemap.xml' : ''}.`);
