import { Metadata } from "next";
import { BRAND } from "@/lib/brand";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calishops.com';

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcategory?: string }>;
}): Promise<Metadata> {
  return Promise.resolve(searchParams).then((params) => {
    const category = params.category;
    const subcategory = params.subcategory;

    let title = `Каталог товарів | ${BRAND.name}`;
    let description = `Каталог ароматичних девайсів та lifestyle‑продуктів від ${BRAND.name}. ${BRAND.shortDescription}`;
    const baseKeywords = [
      "каталог аромадевайсів",
      "купити аромадевайс",
      "ароматичні девайси Європа",
      "CALISHOPs каталог",
      "аромадевайси",
      "lifestyle продукти",
    ];

    const additionalKeywords: string[] = [];
    if (category) {
      title = `${category} | Каталог | ${BRAND.name}`;
      description = `Каталог ${category.toLowerCase()} від ${BRAND.name}. ${BRAND.shortDescription}`;
      additionalKeywords.push(category, `купити ${category.toLowerCase()}`);
    }

    if (subcategory) {
      title = `${subcategory} | ${category || 'Каталог'} | ${BRAND.name}`;
      description = `${subcategory} від ${BRAND.name}. ${BRAND.shortDescription}`;
      additionalKeywords.push(subcategory);
    }

    const keywords = [...baseKeywords, ...additionalKeywords];

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: `${baseUrl}/catalog${category ? `?category=${encodeURIComponent(category)}` : ''}${subcategory ? `&subcategory=${encodeURIComponent(subcategory)}` : ''}`,
        siteName: BRAND.name,
        type: "website",
        images: [
          {
            url: `${baseUrl}/images/hero-bg.png`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${baseUrl}/images/hero-bg.png`],
      },
      alternates: {
        canonical: `${baseUrl}/catalog${category ? `?category=${encodeURIComponent(category)}` : ''}${subcategory ? `&subcategory=${encodeURIComponent(subcategory)}` : ''}`,
      },
    };
  });
}

