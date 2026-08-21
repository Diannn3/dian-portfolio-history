import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function walkDir(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.astro' && file !== 'dist' && file !== '.git') {
        walkDir(filePath, fileList);
      }
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

describe('Clean-Room Privacy & Security Boundary Tests', () => {
  const projectRoot = path.resolve(__dirname, '../../');
  const filesToScan = walkDir(path.join(projectRoot, 'src')).concat(
    walkDir(path.join(projectRoot, 'docs'))
  );

  it('should not contain raw vault internal paths', () => {
    for (const file of filesToScan) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toContain('C:\\Users\\Dian\\Documents\\Vaults\\Fensalir');
      expect(content).not.toContain('raw/brain_dump.md');
      expect(content).not.toContain('AGENTS.md');
    }
  });

  it('should not contain private credentials or API keys', () => {
    for (const file of filesToScan) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/sk-[a-zA-Z0-9]{20,}/);
      expect(content).not.toMatch(/ghp_[a-zA-Z0-9]{20,}/);
      expect(content).not.toMatch(/eyJhbGciOi/);
    }
  });
});
