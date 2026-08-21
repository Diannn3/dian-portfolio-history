import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Brand Asset Pack & Model Size Limits', () => {
  const brandDir = path.resolve(__dirname, '../../brand');
  const publicBrandDir = path.resolve(__dirname, '../../public/brand');
  const assetsBrandDir = path.resolve(__dirname, '../../src/assets/brand');
  const docsBrandDir = path.resolve(__dirname, '../../docs/brand');

  it('should deliver master blend file', () => {
    const blendPath = path.join(brandDir, 'aedrian-a.blend');
    expect(fs.existsSync(blendPath)).toBe(true);
  });

  it('should deliver optimized web GLB under 150 KB', () => {
    const glbPath = path.join(publicBrandDir, 'aedrian-a.glb');
    expect(fs.existsSync(glbPath)).toBe(true);
    const sizeKb = fs.statSync(glbPath).size / 1024;
    expect(sizeKb).toBeLessThanOrEqual(150);
  });

  it('should deliver transparent presentation render', () => {
    const pngPath = path.join(publicBrandDir, 'aedrian-a-transparent.png');
    expect(fs.existsSync(pngPath)).toBe(true);
    expect(fs.statSync(pngPath).size).toBeGreaterThan(10000);
  });

  it('should deliver hero fallback poster under 180 KB', () => {
    const posterPath = path.join(assetsBrandDir, 'aedrian-a-poster.webp');
    expect(fs.existsSync(posterPath)).toBe(true);
    const sizeKb = fs.statSync(posterPath).size / 1024;
    expect(sizeKb).toBeLessThanOrEqual(180);
  });

  it('should deliver vector SVG silhouette', () => {
    const svgPath = path.join(publicBrandDir, 'aedrian-a.svg');
    expect(fs.existsSync(svgPath)).toBe(true);
    const content = fs.readFileSync(svgPath, 'utf-8');
    expect(content).toContain('<svg');
    expect(content).toContain('</svg>');
  });

  it('should deliver brand specification document', () => {
    const specPath = path.join(docsBrandDir, 'aedrian-a-spec.md');
    expect(fs.existsSync(specPath)).toBe(true);
  });
});
