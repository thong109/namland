import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/client/', '/account/', '/my-profile'],
    },
    sitemap: `https://${process.env.NEXT_PUBLIC_URL}/sitemap.xml`,
  };
}
