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
import { useAtlas, type SectionMeta } from '../contexts/AtlasContext';
import { useSectionObserver } from '../hooks/useSectionObserver';

const SECTIONS: SectionMeta[] = [
{ id: 'work', index: '01', label: 'SELECTED WORK' },
{ id: 'about', index: '02', label: 'ABOUT' },
{ id: 'now', index: '03', label: 'CURRENT VECTOR' },
{ id: 'artifact', index: '04', label: 'DIGITAL ARTIFACT' },
{ id: 'lab', index: '05', label: 'LAB' },
{ id: 'tools', index: '06', label: 'TOOLS' },
{ id: 'contact', index: '07', label: 'CONTACT' }];


export function Home() {
  const shell = useRef<HTMLDivElement>(null);
  const { setMode, setProject, setChapter } = useAtlas();
  useSectionObserver(SECTIONS);

  useEffect(() => {
    setProject(null);
    setChapter(null);
    setMode('top');
  }, [setProject, setChapter, setMode]);

  /* the rail changes register once the hero has handed over the viewport */
  useGSAP(
    () => {
      const hero = shell.current?.querySelector('[data-hero]');
      if (!hero) return;
      ScrollTrigger.create({
        trigger: hero,
        start: 'bottom 88%',
        end: 'max',
        onEnter: () => setMode('content'),
        onLeaveBack: () => setMode('top')
      });
    },
    { dependencies: [setMode], scope: shell, revertOnUpdate: true }
  );

  /* hash deep-links from the fullscreen index */
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const target = document.getElementById(hash);
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }, []);

  return (
    <div ref={shell}>
      <Hero />

      <SectionFrame
        id="work"
        index="01"
        title="Selected Work"
        coordinate="PLATE 01 / FOUR SYSTEMS"
        lede="Four systems at different stages of proof. Each row states what exists, what is only designed, and what has not been validated — the status labels are part of the content, not decoration.">

        <WorkLedger />
      </SectionFrame>

      <About />
      <Now />
      <DigitalArtifact />
      <Lab />
      <Tools />
      <Contact />
    </div>);

}