import { useEffect } from 'react';

interface Props {
  title: string;
  description: string;
  path: string;
  themeColor?: string;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Per-route document metadata: title, description, canonical, Open Graph, theme. */
export function Seo({ title, description, path, themeColor = '#f4f2ed' }: Props) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'theme-color', themeColor);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', 'summary_large_image');

    const href = window.location.origin + path;
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = href;
    setMeta('property', 'og:url', href);
  }, [title, description, path, themeColor]);

  return null;
}