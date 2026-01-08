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

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        slug: true,
        updated_at: true,
        publishedAt: true,
        created_at: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calishops.com';
  const [products, categories, subcategories, blogPosts] = await Promise.all([
    getProducts(),
    getCategories(),
    getSubcategories(),
    getBlogPosts(),
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
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
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

  // Blog post pages
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : (post.updated_at || new Date(post.created_at) || now),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...subcategoryPages, ...productPages, ...blogPages];
}
