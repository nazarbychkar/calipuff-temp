import { MetadataRoute } from 'next'
import { prisma } from '@/lib/sql'

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        updated_at: true,
        top_sale: true,
        priority: true,
      },
      orderBy: [
        { top_sale: 'desc' },
        { priority: 'desc' },
      ],
    });
    return products;
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        updated_at: true,
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
    return [];
  }
}

async function getSubcategories() {
  try {
    const subcategories = await prisma.subcategory.findMany({
      select: {
        id: true,
        name: true,
        parent_category_id: true,
        updated_at: true,
      },
    });
    return subcategories;
  } catch (error) {
    console.error("Error fetching subcategories for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calipuff.ua';
  const [products, categories, subcategories] = await Promise.all([
    getProducts(),
    getCategories(),
    getSubcategories(),
  ]);

  const now = new Date();

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/catalog?category=${encodeURIComponent(category.name)}`,
    lastModified: category.updated_at || now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Subcategory pages
  const subcategoryPages = subcategories.map((subcategory) => ({
    url: `${baseUrl}/catalog?subcategory=${encodeURIComponent(subcategory.name)}`,
    lastModified: subcategory.updated_at || now,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Product pages with dynamic priority based on importance
  const productPages = products.map((product) => {
    let priority = 0.6;
    if (product.top_sale) priority = 0.9;
    else if (product.priority > 5) priority = 0.8;
    else if (product.priority > 0) priority = 0.7;

    return {
      url: `${baseUrl}/product/${product.id}`,
      lastModified: product.updated_at || now,
      changeFrequency: 'weekly' as const,
      priority,
    };
  });

  return [...staticPages, ...categoryPages, ...subcategoryPages, ...productPages];
}
