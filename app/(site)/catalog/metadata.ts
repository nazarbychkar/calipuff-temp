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

    // Base SEO keywords for catalog
    const baseKeywords = [
      "CBD магазин",
      "CBD Україна",
      "купити CBD",
      "CBD канабіс",
      "CBD коноплі",
      "CBD канабіску",
      "канабіс CBD",
      "коноплі CBD",
      "канабіс",
      "каннабіс",
      "коноплі",
      "канабіску",
      "канабіс Україна",
      "коноплі Україна",
      "легальний канабіс",
      "легальні коноплі",
      "технічні коноплі",
      "екстракт конопель",
      "екстракт канабісу",
      "конопляний екстракт",
      "канабіноїди",
      "канабіноїди Україна",
      "HHC Україна",
      "легальний HHC",
      "HHC канабіс",
      "HHC коноплі",
      "THC Україна",
      "ТГК Україна",
      "THC канабіс",
      "THC коноплі",
      "вейп Україна",
      "купити вейп",
      "купити дудку",
      "дудка Україна",
      "TAC вейп",
      "ТАС вейп",
      "TAC канабіс",
      "ТАС канабіс",
      "ТАС вейп Україна",
      "купити ТАС вейп",
      "CBD вейп",
      "HHC вейп",
      "THC вейп",
      "картридж 510",
      "одноразовий вейп",
      "легальний CBD",
      "без ТГК",
      "без THC",
      "THC FREE",
      "канабіс без ТГК",
      "коноплі без ТГК",
      "легальний канабіс Україна",
      "каталог вейпів",
      "каталог дудок",
      "каталог канабісу",
      "каталог конопель",
      "каталог аромадевайсів",
      "купити аромадевайс",
      "доставка по Україні",
      "Нова Пошта",
      "Київ",
      BRAND.name,
    ];

    let title = `Каталог CBD канабісу та конопель | ${BRAND.name}`;
    let description = `Каталог CBD канабісу, HHC, THC та TAC вейпів від ${BRAND.name}. CBD коноплі та канабіску з екстрактом. Легальні продукти без ТГК. Легальний канабіс в Україні. Доставка по Україні. Широкий вибір смаків та ефектів.`;

    const additionalKeywords: string[] = [];

    if (category) {
      // SEO-optimized titles based on category
      if (category.toLowerCase().includes("вейп") || category.toLowerCase().includes("vape")) {
        title = `Вейпи ${category} | CBD канабіс | Каталог | ${BRAND.name}`;
        description = `Каталог ${category} від ${BRAND.name}. CBD канабіс та коноплі з екстрактом. Легальні вейпи без ТГК. Широкий вибір смаків: Amnesia, OG Kush, Gelato, Lemon Haze та інші. Легальний канабіс в Україні. Доставка по Україні.`;
        additionalKeywords.push(
          `${category} купити`,
          `${category} Україна`,
          `${category} Київ`,
          `купити ${category.toLowerCase()}`,
          `${category.toLowerCase()} без ТГК`,
          `${category.toLowerCase()} легально`
        );
      } else {
        title = `${category} | Каталог | ${BRAND.name}`;
        description = `Каталог ${category} від ${BRAND.name}. ${BRAND.shortDescription}`;
        additionalKeywords.push(category, `купити ${category.toLowerCase()}`);
      }
    }

    if (subcategory) {
      title = `${subcategory} | ${category || 'Каталог'} | ${BRAND.name}`;
      description = `${subcategory} від ${BRAND.name}. Легальні продукти з сертифікацією. Доставка по Україні.`;
      additionalKeywords.push(
        subcategory,
        `${subcategory} купити`,
        `${subcategory} Україна`
      );
    }

    const keywords = [...baseKeywords, ...additionalKeywords];

    return {
      title,
      description,
      keywords: keywords.filter(Boolean),
      openGraph: {
        title,
        description,
        url: `${baseUrl}/catalog${category ? `?category=${encodeURIComponent(category)}` : ''}${subcategory ? `&subcategory=${encodeURIComponent(subcategory)}` : ''}`,
        siteName: BRAND.name,
        type: "website",
        locale: "uk_UA",
        alternateLocale: ["ru_RU"],
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

