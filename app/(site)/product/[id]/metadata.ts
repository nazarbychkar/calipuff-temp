import { Metadata } from "next";
import { prisma } from "@/lib/sql";
import { BRAND } from "@/lib/brand";
import { generateSEOKeywords, generateSEOTitle, generateSEODescription } from "@/lib/seo-keywords";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calishops.com';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        subcategory: true,
        media: { take: 1 },
      },
    });

    if (!product) {
      return {
        title: "Товар не знайдено",
        description: "Товар не знайдено",
      };
    }

    const productImage = product.media[0]?.url || `${baseUrl}/images/hero-bg.png`;
    const fullImageUrl = productImage.startsWith('http') ? productImage : `${baseUrl}${productImage}`;
    const price = Number(product.price);
    const oldPrice = product.old_price ? Number(product.old_price) : null;

    // Generate SEO-optimized title and description
    const seoTitle = generateSEOTitle(
      {
        name: product.name,
        description: product.description,
        category: product.category,
        subcategory: product.subcategory,
        cbdContentMg: product.cbdContentMg,
        thcContentMg: product.thcContentMg,
        effect: product.effect,
        deviceType: product.deviceType,
        composition: product.composition,
        manufacturer: product.manufacturer,
        hasStrongEffect: product.hasStrongEffect,
      },
      BRAND.name
    );

    const seoDescription = generateSEODescription(
      {
        name: product.name,
        description: product.description,
        category: product.category,
        subcategory: product.subcategory,
        cbdContentMg: product.cbdContentMg,
        thcContentMg: product.thcContentMg,
        effect: product.effect,
        deviceType: product.deviceType,
        composition: product.composition,
        manufacturer: product.manufacturer,
        hasStrongEffect: product.hasStrongEffect,
      },
      BRAND.name
    );

    // Generate SEO keywords
    const seoKeywords = generateSEOKeywords({
      name: product.name,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory,
      cbdContentMg: product.cbdContentMg,
      thcContentMg: product.thcContentMg,
      effect: product.effect,
      deviceType: product.deviceType,
      composition: product.composition,
      manufacturer: product.manufacturer,
      hasStrongEffect: product.hasStrongEffect,
    });

    // H1 title is generated in ProductServer component

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: seoKeywords,
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
      openGraph: {
        type: "website",
        title: seoTitle,
        description: seoDescription,
        url: `${baseUrl}/product/${id}`,
        siteName: BRAND.name,
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: `${product.name} - ${BRAND.name}`,
          },
        ],
        locale: "uk_UA",
        alternateLocale: ["ru_RU"],
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: [fullImageUrl],
        creator: "@calishops_com",
        site: "@calishops_com",
      },
      alternates: {
        canonical: `${baseUrl}/product/${id}`,
        languages: {
          "uk-UA": `${baseUrl}/product/${id}`,
          "ru-RU": `${baseUrl}/product/${id}`,
        },
      },
      other: {
        "product:price:amount": price.toString(),
        "product:price:currency": "UAH",
        ...(oldPrice && { "product:price:original_amount": oldPrice.toString() }),
        "product:availability": (product as { isAvailable?: boolean }).isAvailable !== false ? "in stock" : "out of stock",
        "product:condition": "new",
        "product:brand": BRAND.name,
        "product:category": product.category?.name || "",
        ...(product.subcategory?.name && { "product:category2": product.subcategory.name }),
      },
    };
  } catch (error) {
    console.error("Error generating product metadata:", error);
    return {
      title: "Товар",
      description: BRAND.shortDescription,
    };
  }
}

