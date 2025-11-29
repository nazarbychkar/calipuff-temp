import { Metadata } from "next";
import { prisma } from "@/lib/sql";
import { BRAND } from "@/lib/brand";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calipuff.ua';

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

    const productImage = product.media[0]?.url || product.imageUrl || `${baseUrl}/images/hero-bg.png`;
    const fullImageUrl = productImage.startsWith('http') ? productImage : `${baseUrl}${productImage}`;
    
    const title = `${product.name} | ${BRAND.name} — Легальні вейпи`;
    const description = product.description || `${product.name} від ${BRAND.name}. ${BRAND.shortDescription}`;
    const price = Number(product.price);
    const oldPrice = product.old_price ? Number(product.old_price) : null;

    return {
      title,
      description,
      keywords: [
        product.name,
        "CALIPUFF",
        "легальні вейпи",
        "вейпи без ТГК",
        product.category?.name,
        product.subcategory?.name,
        "купити вейп",
        "вейп Україна",
      ].filter(Boolean) as string[],
      openGraph: {
        type: "website",
        title,
        description,
        url: `${baseUrl}/product/${id}`,
        siteName: BRAND.name,
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [fullImageUrl],
      },
      alternates: {
        canonical: `${baseUrl}/product/${id}`,
      },
      other: {
        "product:price:amount": price.toString(),
        "product:price:currency": "UAH",
        ...(oldPrice && { "product:price:original_amount": oldPrice.toString() }),
        "product:availability": product.stock > 0 ? "in stock" : "out of stock",
        "product:condition": "new",
        "product:brand": BRAND.name,
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

