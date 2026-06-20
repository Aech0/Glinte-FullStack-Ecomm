import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Served at /robots.txt. Crawlers are welcome on public pages; admin and
// account routes are off-limits so they don't get indexed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/account/', '/api/', '/cart', '/checkout/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
