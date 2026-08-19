import React, { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from '../components/hero/Hero';
import { SectionFrame } from '../components/ui/SectionFrame';
import { WorkLedger } from '../components/work/WorkLedger';
import { About } from '../components/about/About';
import { Now } from '../components/sections/Now';
import { DigitalArtifact } from '../components/artifact/DigitalArtifact';
import { Lab } from '../components/lab/Lab';
import { Tools } from '../components/sections/Tools';
import { Contact } from '../components/sections/Contact';
import { Seo } from '../components/global/Seo';
import { useAtlas, type SectionMeta } from '../contexts/AtlasContext';
import { useSectionObserver } from '../hooks/useSectionObserver';
import { useReducedMotion } from '../hooks/useEnvironment';

const SECTIONS: SectionMeta[] = [
  { id: 'work', index: '01', label: 'SELECTED WORK' },
  { id: 'about', index: '02', label: 'ABOUT' },
  { id: 'now', index: '03', label: 'CURRENT VECTOR' },
  { id: 'artifact', index: '04', label: 'DIGITAL ARTIFACT' },
  { id: 'lab', index: '05', label: 'LAB' },
  { id: 'tools', index: '06', label: 'TOOLS' },
  { id: 'contact', index: '07', label: 'CONTACT' },
];

export function Home() {
  const shell = useRef<HTMLDivElement>(null);
  const { setMode, setProject, setChapter } = useAtlas();
  const reduced = useReducedMotion();
  useSectionObserver(SECTIONS);

  useEffect(() => {
    setProject(null);
    setChapter(null);
    setMode('top');
  }, [setProject, setChapter, setMode]);

  useGSAP(
    () => {
      const hero = shell.current?.querySelector('[data-hero]');
      if (!hero) return;
      ScrollTrigger.create({
        trigger: hero,
        start: 'bottom 88%',
        end: 'max',
        onEnter: () => setMode('content'),
        onLeaveBack: () => setMode('top'),
      });
    },
    { dependencies: [setMode, reduced], scope: shell, revertOnUpdate: true }
  );

  return (
    <div ref={shell}>
      <Seo
        title="Dian — systems between equations and interfaces"
        description="Applied Mathematics student building software, AI, maps, spatial systems and experimental interfaces."
        path="/"
      />

      <Hero />
      <main id="main">
        <SectionFrame
          id="work"
          index="01"
          title="Selected Work"
          coordinate="PLATE 01 / FOUR SYSTEMS"
          lede="Four systems at different stages of proof. The status labels are part of the content, not decoration."
        >
          <WorkLedger />
        </SectionFrame>
        <About />
        <Now />
        <DigitalArtifact />
        <Lab />
        <Tools />
        <Contact />
      </main>
    </div>
  );
}
