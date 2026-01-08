import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import StructuredData from "@/components/shared/StructuredData";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

async function getBlogPost(slug: string) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/blog/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calishops.com';

  if (!post) {
    return {
      title: "Пост не знайдено | Calishops",
    };
  }

  // Generate SEO keywords from title and content
  const keywords = [
    "CBD",
    "HHC",
    "THC",
    "TAC",
    "канабіс",
    "коноплі",
    "вейп",
    "дудка",
    "CBD Україна",
    "легальний CBD",
    "CBD канабіс",
    "коноплі без ТГК",
    "легальний канабіс",
    ...post.title.toLowerCase().split(' ').filter((w: string) => w.length > 3),
  ];

  const description = post.excerpt || 
    (post.content 
      ? post.content.replace(/<[^>]*>/g, '').substring(0, 160).trim() + '...'
      : post.title);
  
  const imageUrl = post.imageUrl 
    ? (post.imageUrl.startsWith('http') ? post.imageUrl : `${baseUrl}${post.imageUrl}`)
    : `${baseUrl}/images/hero-bg.png`;

  return {
    title: `${post.title} | Блог про CBD, HHC, THC канабіс | ${BRAND.name}`,
    description: description,
    keywords: keywords,
    authors: [{ name: BRAND.name }],
    openGraph: {
      type: "article",
      title: post.title,
      description: description,
      url: `${baseUrl}/blog/${slug}`,
      siteName: BRAND.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "uk_UA",
      alternateLocale: ["ru_RU"],
      publishedTime: post.publishedAt || post.created_at,
      modifiedTime: post.created_at,
      section: "Блог",
      tags: keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: [imageUrl],
      creator: "@calishops_com",
      site: "@calishops_com",
    },
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
      languages: {
        "uk-UA": `${baseUrl}/blog/${slug}`,
        "ru-RU": `${baseUrl}/blog/${slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calishops.com';
  const imageUrl = post.imageUrl 
    ? (post.imageUrl.startsWith('http') ? post.imageUrl : `${baseUrl}${post.imageUrl}`)
    : `${baseUrl}/images/hero-bg.png`;

  const publishedDate = post.publishedAt || post.created_at;
  const modifiedDate = post.created_at;

  // Breadcrumbs for blog post
  const breadcrumbs = [
    { name: "Головна", url: baseUrl },
    { name: "Блог", url: `${baseUrl}/blog` },
    { name: post.title, url: `${baseUrl}/blog/${slug}` },
  ];

  return (
    <>
      <StructuredData
        type="article"
        article={{
          headline: post.title,
          description: post.excerpt || post.title,
          image: imageUrl,
          datePublished: publishedDate,
          dateModified: modifiedDate,
          author: BRAND.name,
          publisher: BRAND.name,
          url: `${baseUrl}/blog/${slug}`,
        }}
      />
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-block mb-8 text-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
          >
            ← До блогу
          </Link>

          {/* Header */}
          <article className="space-y-8" itemScope itemType="https://schema.org/BlogPosting">
            <header className="space-y-4">
              <time 
                className="text-sm opacity-60"
                dateTime={publishedDate}
                itemProp="datePublished"
              >
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : new Date(post.created_at).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
              </time>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight" itemProp="headline">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl opacity-70" itemProp="description">{post.excerpt}</p>
              )}
            </header>

            {/* Featured Image */}
            {post.imageUrl && (
              <div className="relative w-full h-96 rounded-xl overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={`${post.title} - ${BRAND.name} блог`}
                  fill
                  className="object-cover"
                  priority
                  itemProp="image"
                />
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              itemProp="articleBody"
            >
              <div
                className="space-y-4 text-base leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(/\n/g, "<br />"),
                }}
              />
            </div>

            {/* Author and Publisher Info */}
            <footer className="pt-8 border-t border-gray-200 dark:border-gray-800">
              <div itemScope itemType="https://schema.org/Organization" itemProp="publisher">
                <meta itemProp="name" content={BRAND.name} />
                <meta itemProp="url" content={baseUrl} />
              </div>
              <div itemScope itemType="https://schema.org/Person" itemProp="author">
                <meta itemProp="name" content={BRAND.name} />
              </div>
            </footer>
          </article>
        </div>
      </div>
    </>
  );
}
