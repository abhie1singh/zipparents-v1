import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zipparents.com';

  const routes = [
    '',
    '/login',
    '/signup',
    '/how-it-works',
    '/safety-trust',
    '/for-parents',
    '/faq',
    '/blog',
    '/about',
    '/safety',
    '/terms',
    '/privacy',
    '/guidelines',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
