import { useEffect } from 'react';

interface Props {
  title: string;
  description: string;
  path: string;
  themeColor?: string;
  noIndex?: boolean;
  /** Local absolute-path social image, e.g. /og/uppetite.png. */
  image?: string;
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
export function Seo({ title, description, path, themeColor = '#f4f2ed', noIndex = false, image }: Props) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'theme-color', themeColor);
    setMeta('name', 'robots', noIndex ? 'noindex,follow' : 'index,follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');

    if (image) {
      const imageHref = new URL(image, window.location.origin).href;
      setMeta('property', 'og:image', imageHref);
      setMeta('name', 'twitter:image', imageHref);
    } else {
      document.head.querySelector('meta[property="og:image"]')?.remove();
      document.head.querySelector('meta[name="twitter:image"]')?.remove();
    }

    const href = window.location.origin + path;
    const existingCanonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (noIndex) {
      existingCanonical?.remove();
      document.head.querySelector('meta[property="og:url"]')?.remove();
    } else {
      const link = existingCanonical ?? document.createElement('link');
      link.rel = 'canonical';
      link.href = href;
      if (!existingCanonical) document.head.appendChild(link);
      setMeta('property', 'og:url', href);
    }
  }, [title, description, path, themeColor, noIndex, image]);

  return null;
}
