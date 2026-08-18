import React, { useRef } from 'react';
import { Hero } from '../components/hero/Hero';
import { WorkIndex } from '../components/work/WorkIndex';
import { About } from '../components/about/About';
import { Now } from '../components/sections/Now';
import { DigitalArtifact } from '../components/artifact/DigitalArtifact';
import { Lab } from '../components/sections/Lab';
import { Tools } from '../components/sections/Tools';
import { Contact } from '../components/sections/Contact';
import { Seo } from '../components/global/Seo';
import { useReveals } from '../hooks/useReveals';

export function Home() {
  const scope = useRef<HTMLDivElement>(null);
  useReveals(scope);

  return (
    <div ref={scope}>
      <Seo
        title="Dian — systems between equations and interfaces"
        description="Applied Mathematics student building software, AI, maps, spatial systems and experimental interfaces."
        path="/" />
      
      <Hero />
      <main id="main">
        <WorkIndex />
        <About />
        <Now />
        <DigitalArtifact />
        <Lab />
        <Tools />
        <Contact />
      </main>
    </div>);

}