import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Content Collection & Evidence State Tests', () => {
  const workDir = path.resolve(__dirname, '../../src/content/work');

  it('should contain all 4 required case study entries', () => {
    const files = fs.readdirSync(workDir).filter((f) => f.endsWith('.md'));
    expect(files.sort()).toEqual([
      'aedriain.md',
      'aescent-web-studio.md',
      'ims-academic-hub.md',
      'uppetite.md'
    ]);
  });

  it('should preserve Needs Aedrian confirmation markers', () => {
    const files = fs.readdirSync(workDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(workDir, file), 'utf-8');
      expect(content).toContain('Needs Aedrian confirmation');
      expect(content).toContain('evidenceState: "conceptual"');
    }
  });

  it('should have 4 distinct programmatic system studies', () => {
    const studiesDir = path.resolve(__dirname, '../../public/studies');
    const studies = fs.readdirSync(studiesDir);
    expect(studies).toContain('uppetite-route-prism.svg');
    expect(studies).toContain('aedriain-gesture-field.svg');
    expect(studies).toContain('ims-wayfinding-lattice.svg');
    expect(studies).toContain('aescent-delivery-frame.svg');
  });
});
