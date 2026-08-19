import React, { useEffect, useRef } from 'react';
import { Seo } from '../components/global/Seo';
import { Hero } from '../components/hero/Hero';
import { WorkLedger } from '../components/work/WorkLedger';
import { About } from '../components/about/About';
import { Now } from '../components/sections/Now';
import { DigitalArtifact } from '../components/artifact/DigitalArtifact';
import { Lab } from '../components/sections/Lab';
import { Tools } from '../components/sections/Tools';
import { Contact } from '../components/sections/Contact';
import { useReveals } from '../hooks/useReveals';
import { resetPageContext } from '../lib/navigation/pageContext';

export function Home() {
  const scope = useRef<HTMLDivElement>(null);
  useReveals(scope);

  useEffect(() => {
    resetPageContext();
  }, []);

  return (
    <div ref={scope}>
      <Seo
        title="Dian — systems between equations and interfaces"
        description="Applied Mathematics student building software, AI, maps, spatial systems and experimental interfaces."
        path="/" />
      
      <Hero />
      <main id="main">
        <WorkLedger />
        <About />
        <Now />
        <DigitalArtifact />
        <Lab />
        <Tools />
        <Contact />
      </main>
    </div>);

}