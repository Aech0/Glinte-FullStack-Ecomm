import type { MetadataRoute } from 'next';

// Next.js picks this up at /sitemap.xml automatically. We hit the backend
// at build time so the product pages stay in sync with the actual catalogue.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type Product = { slug: string };

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return (await res.json()) as Product[];
  } catch {
    // Backend not reachable at build time — return an empty list and let
    // the static pages still ship. Sitemap will repopulate on next build.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    '/',
    '/about',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
    '/refund',
    '/shipping',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }));

  const products = await fetchProducts();
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
