import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { identity } from '../../data/site';
import { getLenis } from '../../lib/motion/smoothScroll';

const links = [
{ label: 'WORK', hash: '#work' },
{ label: 'ABOUT', hash: '#about' },
{ label: 'LAB', hash: '#lab' },
{ label: 'CONTACT', hash: '#contact' }];


export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (hash: string) => {
    setOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + hash);
      return;
    }
    const el = document.querySelector(hash);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -40 });else
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500 ease-atlas"
      style={
      scrolled ?
      { backgroundColor: 'rgba(244, 242, 237, 0.88)', backdropFilter: 'blur(6px)' } :
      undefined
      }
      aria-label="Primary">
      
      <div className="atlas-grid">
        <div
          className={`col-span-4 flex items-center justify-between py-4 md:col-span-8 xl:col-span-12 ${
          scrolled ? 'border-b border-hairline' : ''}`
          }>
          
          <Link
            to="/"
            className="font-heading text-[1.05rem] font-medium uppercase tracking-tight"
            aria-label="Dian — home">
            
            {identity.name}
            <span className="ml-2 align-super font-mono text-micro text-graphite">/ 2026</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-7">
              {links.map((l) =>
              <li key={l.label}>
                  <button
                  type="button"
                  onClick={() => goTo(l.hash)}
                  className="link-underline font-mono text-label uppercase tracking-[0.14em] text-graphite transition-colors duration-300 hover:text-ink">
                  
                    {l.label}
                  </button>
                </li>
              )}
            </ul>
            <span className="flex items-center gap-2 font-mono text-micro uppercase tracking-[0.14em] text-graphite">
              <span className="h-[5px] w-[5px] bg-accent" aria-hidden="true" />
              {identity.status}
            </span>
          </div>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-expanded={open}
                aria-label="Open menu"
                className="flex h-11 w-11 -mr-2 items-center justify-center md:hidden">
                
                <span className="flex flex-col items-end gap-[5px]" aria-hidden="true">
                  <span className="block h-[1.5px] w-6 bg-ink" />
                  <span className="block h-[1.5px] w-4 bg-ink" />
                </span>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay
                className="fixed inset-0 z-[70]"
                style={{ backgroundColor: 'rgba(17, 17, 17, 0.22)' }} />
              
              <Dialog.Content
                className="fixed inset-0 z-[80] flex flex-col bg-canvas px-5 pb-8 pt-4 focus:outline-none"
                aria-label="Menu">
                
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-mono text-label uppercase tracking-[0.16em] text-graphite">
                    INDEX
                  </Dialog.Title>
                  <Dialog.Close
                    aria-label="Close menu"
                    className="flex h-11 w-11 -mr-2 items-center justify-center">
                    
                    <X className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
                  </Dialog.Close>
                </div>

                <ul className="mt-12 flex flex-col">
                  {links.map((l, i) =>
                  <li key={l.label} className="border-t border-hairline">
                      <button
                      type="button"
                      onClick={() => goTo(l.hash)}
                      className="flex w-full items-baseline justify-between py-5 text-left">
                      
                        <span className="font-heading text-[2.1rem] font-medium uppercase leading-none">
                          {l.label}
                        </span>
                        <span className="font-mono text-micro text-graphite">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </button>
                    </li>
                  )}
                </ul>

                <div className="mt-auto border-t border-hairline pt-4">
                  <p className="font-mono text-micro uppercase tracking-[0.16em] text-graphite">
                    N 14.16° / E 121.24° — LOS BAÑOS
                  </p>
                  <p className="mt-2 flex items-center gap-2 font-mono text-micro uppercase tracking-[0.16em] text-graphite">
                    <span className="h-[5px] w-[5px] bg-accent" aria-hidden="true" />
                    {identity.status}
                  </p>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </nav>);

}