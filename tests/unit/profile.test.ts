import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Profile Identity & Primary CTA Tests', () => {
  it('should maintain canonical public links and primary CTA', () => {
    const headerPath = path.resolve(__dirname, '../../src/components/Header.astro');
    const footerPath = path.resolve(__dirname, '../../src/components/Footer.astro');
    const heroPath = path.resolve(__dirname, '../../src/components/hero/HeroStage.astro');

    const headerContent = fs.readFileSync(headerPath, 'utf-8');
    const footerContent = fs.readFileSync(footerPath, 'utf-8');
    const heroContent = fs.readFileSync(heroPath, 'utf-8');

    // Canonical links
    expect(headerContent).toContain('https://github.com/Diannn3');
    expect(headerContent).toContain('https://www.linkedin.com/in/aedrian-ponce-a602b0398/');
    expect(footerContent).toContain('https://github.com/Diannn3');
    expect(footerContent).toContain('https://www.linkedin.com/in/aedrian-ponce-a602b0398/');

    // Primary CTA
    expect(heroContent).toContain('Let’s build a system together');
    expect(footerContent).toContain('Let’s build a system together');
  });
});
