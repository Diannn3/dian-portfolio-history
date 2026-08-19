import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'scripts/frozen-surfaces.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let failed = false;

for (const [relative, expected] of Object.entries(manifest.files)) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    console.error(`FROZEN FAIL: missing protected file ${relative}`);
    failed = true;
    continue;
  }
  const actual = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if (actual !== expected) {
    console.error(`FROZEN FAIL: ${relative} changed (${actual.slice(0, 12)} != ${expected.slice(0, 12)})`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`FROZEN OK: ${Object.keys(manifest.files).length} protected visual/runtime files match the approved baseline.`);
