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
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(selector: string) {
  document.querySelector(selector)?.remove();
}

export function Seo({
  title,
  description,
  path,
  themeColor = '#f4f2ed',
  noIndex = false,
  image
}: Props) {
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
      const absolute = new URL(image, window.location.origin).href;
      setMeta('property', 'og:image', absolute);
      setMeta('name', 'twitter:image', absolute);
    } else {
      removeMeta('meta[property="og:image"]');
      removeMeta('meta[name="twitter:image"]');
    }

    const href = window.location.origin + path;
    if (noIndex) {
      removeMeta('link[rel="canonical"]');
      removeMeta('meta[property="og:url"]');
      return;
    }
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
    setMeta('property', 'og:url', href);
  }, [title, description, path, themeColor, noIndex, image]);

  return null;
}