import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calishops.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/product-images/',
          '*.json',
          '/admin/*',
          '/api/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/catalog',
          '/blog',
          '/product/*',
          '/blog/*',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/product-images/',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/catalog',
          '/blog',
          '/product/*',
          '/blog/*',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/product-images/',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Slurp',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
