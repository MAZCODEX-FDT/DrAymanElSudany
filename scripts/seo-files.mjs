// Writes dist/sitemap.xml and dist/robots.txt with absolute URLs after `vite build`.
// Set SITE_URL (e.g. SITE_URL=https://drayman-elsudany.com npm run build).
import { writeFileSync } from 'node:fs';
import { seedContent } from '../src/data/seed.js';

const site = (process.env.SITE_URL || 'https://draymanelsudany.com').replace(/\/$/, '');
if (!process.env.SITE_URL) console.warn('[seo-files] SITE_URL not set; using https://draymanelsudany.com.');

// Static copy for hosts without PHP (GitHub Pages). On Bluehost, /sitemap.xml is served live by api/sitemap.php from the database.
const { procedures, articles } = seedContent();
const paths = ['/', '/about', '/procedures', ...procedures.map((p) => `/procedures/${p.slug}`), '/for-doctors', '/faq', '/contact', '/book', '/before-your-visit', '/articles', ...articles.map((a) => `/articles/${a.slug}`)];
const today = new Date().toISOString().slice(0, 10);
const url = (p) => {
  const ar = `${site}${p}`;
  const en = `${site}${p === '/' ? '/en' : `/en${p}`}`;
  const alt = `<xhtml:link rel="alternate" hreflang="ar" href="${ar}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${ar}"/>`;
  return [ar, en].map((loc) => `<url><loc>${loc}</loc><lastmod>${today}</lastmod>${alt}</url>`).join('');
};
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${paths.map(url).join('')}</urlset>\n`
);
writeFileSync('dist/robots.txt', `User-agent: *\nDisallow: /dashboard\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`);
console.log(`[seo-files] sitemap.xml (${paths.length * 2} URLs) and robots.txt written for ${site}`);
