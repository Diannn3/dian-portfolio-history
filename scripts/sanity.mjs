import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fail = (message) => {
  console.error(`SANITY FAIL: ${message}`);
  process.exitCode = 1;
};

const pkg = JSON.parse(read('package.json'));
for (const [groupName, group] of Object.entries({ dependencies: pkg.dependencies ?? {}, devDependencies: pkg.devDependencies ?? {} })) {
  for (const [name, version] of Object.entries(group)) {
    if (version === 'latest' || version === '*' || String(version).trim() === '') {
      fail(`${groupName} must use a pinned version for ${name}: ${version}`);
    }
  }
}
if (pkg.dependencies?.['@emotion/react']) fail('@emotion/react is unused and should not be restored.');
if (pkg.dependencies?.['@gsap/react'] !== '2.1.1') fail('@gsap/react must remain pinned to the reviewed React 18-compatible integration version.');
if (pkg.dependencies?.['@radix-ui/react-collapsible'] !== '1.1.3') fail('Lab collapsibles require the pinned Radix Collapsible dependency.');
if (pkg.dependencies?.['gsap/ScrollTrigger']) fail('gsap/ScrollTrigger must not be listed as a package dependency.');
if (fs.existsSync(path.join(root, 'src/package.json'))) fail('duplicate src/package.json exists.');
if (!fs.existsSync(path.join(root, 'public/favicon.svg'))) fail('public/favicon.svg is missing.');
if (fs.existsSync(path.join(root, '.vercel'))) fail('.vercel is local deployment linkage and must not be tracked.');
for (const legacy of [
  'src/components/global/Nav.tsx',
  'src/components/sections/Lab.tsx',
  'src/components/work/WorkIndex.tsx',
  'src/components/artifact/SplineScene.tsx',
  'src/components/ui/Button.tsx',
  'src/components/ui/MagneticLink.tsx',
]) {
  if (fs.existsSync(path.join(root, legacy))) fail(`obsolete pre-merge surface should remain removed: ${legacy}`);
}

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

const projectDir = path.join(root, 'src/content/projects');
const projects = fs.readdirSync(projectDir)
  .filter((name) => name.endsWith('.ts'))
  .map((name) => fs.readFileSync(path.join(projectDir, name), 'utf8'))
  .join('\n');
const siteData = read('src/data/site.ts');
const revealData = read('src/lib/motion/reveal.ts');
const scrollData = read('src/lib/motion/smoothScroll.ts');
const entryData = read('src/index.tsx');
const artifactData = read('src/components/artifact/DigitalArtifact.tsx');
if (!revealData.includes('gsap.registerPlugin(ScrollTrigger, useGSAP)')) fail('GSAP React integration must register useGSAP with ScrollTrigger.');
if (!scrollData.includes('anchors: { offset: -96 }')) fail('Lenis anchor handling must stay enabled for skip/header/case navigation.');
if (!entryData.includes("lenis/dist/lenis.css")) fail('Lenis recommended stylesheet must remain imported so stopped/smooth states behave consistently.');
if (artifactData.includes('SPLINE_SCENE_URL') || artifactData.includes('SplineScene')) fail('Spline must remain a Lab-only experiment and must not replace the procedural Digital Artifact.');
if (!artifactData.includes("lazy(() =>") || !artifactData.includes("import('./ArtifactCanvas')")) fail('Digital Artifact WebGL must remain behind a lazy import.');
const catalogData = JSON.parse(read('src/data/projectCatalog.json'));
const registryData = read('src/content/projectRegistry.ts');
const catalogSlugs = catalogData.map((project) => project.slug);
const projectFiles = fs.readdirSync(projectDir).filter((name) => name.endsWith('.ts'));
if (projectFiles.length !== catalogSlugs.length) fail(`project catalog/content count mismatch: ${catalogSlugs.length} catalog entries vs ${projectFiles.length} project files.`);
for (const slug of catalogSlugs) {
  if (!registryData.includes(slug)) fail(`project registry is missing catalog slug: ${slug}`);
}
if (fs.existsSync(path.join(root, 'src/data/projects.ts'))) fail('legacy monolithic src/data/projects.ts should remain removed.');
for (const match of `${projects}
${siteData}`.matchAll(/href:\s*['"]([^'"]*)['"]/g)) {
  const href = match[1];
  if (href && !href.startsWith('https://')) fail(`external content link must use https: ${href}`);
}

for (const match of projects.matchAll(/(?:src|poster):\s*['"](\/work\/[^'"]+)['"]/g)) {
  const assetPath = path.join(root, 'public', match[1].replace(/^\//, ''));
  if (!fs.existsSync(assetPath)) fail(`case-study media asset is missing: ${match[1]}`);
}

for (const project of catalogData) {
  if (!project.socialImage) continue;
  if (!project.socialImage.startsWith('/')) fail(`social image must be a local absolute path: ${project.socialImage}`);
  const socialPath = path.join(root, 'public', project.socialImage.replace(/^\//, ''));
  if (!fs.existsSync(socialPath)) fail(`catalog social image is missing: ${project.socialImage}`);
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
const forbiddenInitialModules = [
  'src/components/work/ProjectStage.tsx',
  'src/components/artifact/ArtifactCanvas.tsx',
  'src/components/lab/VectorFieldPlayground.tsx',
  'src/components/lab/AedriAInStudy.tsx',
  'src/components/lab/SplineStudy.tsx',
  'src/components/lab/SplineScene.tsx',
  'src/components/lab/MotionStudies.tsx',
];
for (const relative of forbiddenInitialModules) {
  if (seen.has(path.join(root, relative))) fail(`${relative} leaked into the initial static import graph; keep expensive/experimental surfaces lazy.`);
}
for (const file of seen) {
  if (file.startsWith(path.join(root, 'src/content/projects') + path.sep)) {
    fail('long-form project content is reachable from the initial static import graph; keep it behind the lazy project route.');
    break;
  }
}
if (!combined.includes('404 / COORDINATE NOT FOUND')) fail('portfolio-native 404 surface is missing.');
if (!combined.includes('View system as text +')) fail('complex system diagrams need a text equivalent.');

if (!process.exitCode) {
  console.log(`SANITY OK: ${sourceFiles.length} source files checked; content links/assets are bounded; long-form project content, Three.js and lazy experiment surfaces remain outside the initial static graph.`);
}
