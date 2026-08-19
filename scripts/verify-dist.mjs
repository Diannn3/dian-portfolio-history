import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.resolve(root, process.env.DIST_DIR || 'dist');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/data/projectCatalog.json'), 'utf8'));
const siteUrl = (process.env.SITE_URL || '').replace(/\/$/, '');

function fail(message) {
  console.error(`DIST FAIL: ${message}`);
  process.exitCode = 1;
}

function read(relativePath) {
  const file = path.join(dist, relativePath);
  if (!fs.existsSync(file)) {
    fail(`missing ${relativePath}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

const rootHtml = read('index.html');
if (!rootHtml.includes('<div id="root"></div>')) fail('root index is missing the React mount point.');
if (!rootHtml.includes('<title>Dian — systems between equations and interfaces</title>')) fail('root index has stale title metadata.');
if (!rootHtml.includes('Applied Mathematics student building software, AI, maps, spatial systems and experimental interfaces.')) fail('root index has stale description metadata.');
if (!rootHtml.includes('content="index,follow"')) fail('root index is not indexable.');
if (!rootHtml.includes('name="twitter:card" content="summary"')) fail('root index should use the summary card until a real social image exists.');
if (siteUrl && !rootHtml.includes(`rel="canonical" href="${siteUrl}/"`)) fail('root canonical is missing or stale.');

for (const project of catalog) {
  const relative = path.join('work', project.slug, 'index.html');
  const html = read(relative);
  if (!html) continue;

  const title = `${project.title} — ${project.category} / Dian`;
  if (!html.includes(`<title>${title}</title>`)) fail(`${relative} has stale title metadata.`);
  if (!html.includes(project.summary)) fail(`${relative} has stale description metadata.`);
  if (!html.includes('content="index,follow"')) fail(`${relative} is not indexable.`);

  const expectsLargeCard = Boolean(siteUrl && project.socialImage);
  const expectedCard = expectsLargeCard ? 'summary_large_image' : 'summary';
  if (!html.includes(`name="twitter:card" content="${expectedCard}"`)) {
    fail(`${relative} has the wrong Twitter card type.`);
  }

  if (project.socialImage) {
    const publicPath = path.join(root, 'public', project.socialImage.replace(/^\//, ''));
    if (!fs.existsSync(publicPath)) fail(`catalog social image is missing: ${project.socialImage}`);
  }

  if (siteUrl) {
    const canonical = `${siteUrl}/work/${project.slug}`;
    if (!html.includes(`rel="canonical" href="${canonical}"`)) fail(`${relative} canonical is missing or stale.`);
    if (project.socialImage && !html.includes(`property="og:image" content="${siteUrl}${project.socialImage}"`)) {
      fail(`${relative} social image metadata is missing.`);
    }
  }
}

const notFound = read('404.html');
if (notFound && !notFound.includes('content="noindex,follow"')) fail('404.html must be noindex,follow.');
if (notFound && /rel=["']canonical["']/.test(notFound)) fail('404.html must not declare a canonical URL.');

const robots = read('robots.txt');
if (robots && !robots.includes('User-agent: *')) fail('robots.txt is malformed.');

if (siteUrl) {
  const sitemap = read('sitemap.xml');
  const expectedUrls = [`${siteUrl}/`, ...catalog.map((project) => `${siteUrl}/work/${project.slug}`)];
  for (const url of expectedUrls) {
    if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`sitemap.xml is missing ${url}`);
  }
  if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) fail('robots.txt does not advertise the configured sitemap.');
}

if (!process.exitCode) {
  console.log(`DIST OK: ${catalog.length} project entrypoints, route metadata, 404 and crawler files verified${siteUrl ? ' with canonical URLs' : ''}.`);
}
