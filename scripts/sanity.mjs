import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fail = (message) => {
  console.error(`SANITY FAIL: ${message}`);
  process.exitCode = 1;
};

const pkg = JSON.parse(read('package.json'));
if (pkg.dependencies?.['gsap/ScrollTrigger']) fail('gsap/ScrollTrigger must not be listed as a package dependency.');
if (fs.existsSync(path.join(root, 'src/package.json'))) fail('duplicate src/package.json exists.');
if (!fs.existsSync(path.join(root, 'public/favicon.svg'))) fail('public/favicon.svg is missing.');

const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(?:ts|tsx|html)$/.test(entry.name)) sourceFiles.push(full);
  }
}
walk(path.join(root, 'src'));
sourceFiles.push(path.join(root, 'index.html'));

const combined = sourceFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
for (const marker of [
  'PLACEHOLDER /',
  'RECORDS 41',
  'ETA 4–7 MIN',
  'SMS IN / 5',
  'DEDUPED / 3',
  'NODES 42',
  "href: '#'",
  'href="#"',
]) {
  if (combined.includes(marker)) fail(`stale generated marker remains: ${marker}`);
}

const projects = read('src/data/projects.ts');
const siteData = read('src/data/site.ts');
for (const match of `${projects}
${siteData}`.matchAll(/href:\s*['"]([^'"]*)['"]/g)) {
  const href = match[1];
  if (href && !href.startsWith('https://')) fail(`external content link must use https: ${href}`);
}

for (const match of projects.matchAll(/(?:src|poster):\s*['"](\/work\/[^'"]+)['"]/g)) {
  const assetPath = path.join(root, 'public', match[1].replace(/^\//, ''));
  if (!fs.existsSync(assetPath)) fail(`case-study media asset is missing: ${match[1]}`);
}

// Follow static relative imports from the application entry. Dynamic imports are
// deliberately ignored because they are the intended WebGL lazy boundaries.
const extensions = ['.ts', '.tsx', '.js', '.jsx'];
const importRe = /(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g;
const seen = new Set();
const packages = new Set();
const stack = [path.join(root, 'src/index.tsx')];

while (stack.length) {
  const file = path.resolve(stack.pop());
  if (seen.has(file) || !fs.existsSync(file)) continue;
  seen.add(file);
  const code = fs.readFileSync(file, 'utf8');
  for (const match of code.matchAll(importRe)) {
    const spec = match[1];
    if (!spec.startsWith('.')) {
      packages.add(spec);
      continue;
    }
    const base = path.resolve(path.dirname(file), spec);
    const candidates = [
      base,
      ...extensions.map((ext) => base + ext),
      ...extensions.map((ext) => path.join(base, 'index' + ext)),
    ];
    const resolved = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (resolved) stack.push(resolved);
  }
}

if (packages.has('three')) fail('Three.js is reachable from the initial static import graph; keep WebGL behind lazy imports.');

if (!process.exitCode) {
  console.log(`SANITY OK: ${sourceFiles.length} source files checked; content links/assets are bounded; Three.js remains outside the initial static graph.`);
}
