import { useEffect } from 'react';

/**
 * Lightweight, zero-dependency SEO manager for GearGrid SPA routes.
 * Directly updates document title, meta tags, Open Graph, Twitter cards,
 * canonical link, and JSON-LD structured data.
 */
export default function SEO({
  title = 'GearGrid — Premium PC Hardware & Custom Builds',
  description = 'High-performance desktop graphics cards, high-bandwidth processors, OLED displays, and precision-engineered custom gaming rigs. Engineered for zero compromises.',
  canonical = 'https://geargrid-delta.vercel.app/',
  ogType = 'website',
  ogImage = 'https://geargrid-delta.vercel.app/heroSection/heroPc.png',
  noindex = false,
  jsonLd = null
}) {
  useEffect(() => {
    // 1. Page Title
    if (title) {
      document.title = title;
    }

    // Helper to safely set or create meta tag
    const setMetaTag = (attr, key, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Meta Description
    setMetaTag('name', 'description', description);

    // 3. Robots Crawl Directives
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // 4. Canonical Link
    if (canonical) {
      let canonEl = document.querySelector('link[rel="canonical"]');
      if (!canonEl) {
        canonEl = document.createElement('link');
        canonEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonEl);
      }
      canonEl.setAttribute('href', canonical);
    }

    // 5. Open Graph Meta Tags
    setMetaTag('property', 'og:site_name', 'GearGrid');
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonical);
    setMetaTag('property', 'og:image', ogImage);

    // 6. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 7. Dynamic JSON-LD Structured Data
    const scriptId = 'geargrid-page-jsonld';
    let scriptEl = document.getElementById(scriptId);

    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      try {
        scriptEl.textContent = JSON.stringify(jsonLd);
      } catch (err) {
        console.error('Failed to stringify JSON-LD structured data:', err);
      }
    } else if (scriptEl) {
      scriptEl.remove();
    }

    // Cleanup on route unmount
    return () => {
      const activeScript = document.getElementById(scriptId);
      if (activeScript) {
        activeScript.remove();
      }
    };
  }, [title, description, canonical, ogType, ogImage, noindex, jsonLd]);

  return null;
}
