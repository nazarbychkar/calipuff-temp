import { Suspense } from "react";
import CatalogServer from "@/components/catalog/CatalogServer";
import StructuredData from "@/components/shared/StructuredData";
import { BRAND } from "@/lib/brand";
import { generateMetadata } from "./metadata";
export { generateMetadata };

interface PageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
  }>;
}

export const revalidate = 60; // ISR every 1 minute

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calishops.com';
    
    // Build breadcrumbs for structured data
    const breadcrumbs = [
      { name: "Головна", url: baseUrl },
      { name: "Каталог", url: `${baseUrl}/catalog` },
    ];
    
    if (params.category) {
      breadcrumbs.push({
        name: params.category,
        url: `${baseUrl}/catalog?category=${encodeURIComponent(params.category)}`,
      });
    }
    
    if (params.subcategory) {
      breadcrumbs.push({
        name: params.subcategory,
        url: `${baseUrl}/catalog?category=${encodeURIComponent(params.category || '')}&subcategory=${encodeURIComponent(params.subcategory)}`,
      });
    }
    
    // Generate CollectionPage structured data for catalog
    const catalogUrl = params.category || params.subcategory
      ? `${baseUrl}/catalog?${params.category ? `category=${encodeURIComponent(params.category)}` : ''}${params.subcategory ? `${params.category ? '&' : ''}subcategory=${encodeURIComponent(params.subcategory)}` : ''}`
      : `${baseUrl}/catalog`;

    const pageName = params.subcategory || params.category || "Каталог товарів";
    const pageDescription = params.subcategory || params.category 
      ? `Каталог ${pageName} від ${BRAND.name}. CBD канабіс, HHC, THC та TAC вейпи. Легальні коноплі та канабіс в Україні. Без ТГК, сертифіковано.`
      : `Каталог CBD канабісу, HHC, THC та TAC вейпів від ${BRAND.name}. Легальні коноплі та канабіс в Україні. Широкий вибір смаків та ефектів. Без ТГК, сертифіковано.`;

    return (
        <>
            <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "CollectionPage",
                  "name": `${pageName} - CBD канабіс та коноплі`,
                  "description": pageDescription,
                  "url": catalogUrl,
                  "keywords": `${pageName}, CBD канабіс, CBD коноплі, HHC, THC, TAC вейпи, легальний канабіс, коноплі без ТГК, вейпи Україна`,
                  "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": breadcrumbs.map((crumb, index) => ({
                      "@type": "ListItem",
                      "position": index + 1,
                      "name": crumb.name,
                      "item": crumb.url
                    }))
                  },
                  "mainEntity": {
                    "@type": "ItemList",
                    "name": `${pageName} - список продуктів`,
                    "description": `Список CBD вейпів та канабіс продуктів: ${pageName}`,
                    "numberOfItems": "50+",
                    "itemListElement": []
                  },
                  "about": {
                    "@type": "Thing",
                    "name": "CBD канабіс та коноплі в Україні",
                    "description": "Легальні CBD, HHC, THC та TAC вейпи, коноплі без ТГК"
                  }
                })
              }}
            />
            <Suspense fallback={<div className="text-center py-20 text-lg">Завантаження каталогу...</div>}>
                <CatalogServer 
                    category={params.category || null}
                    subcategory={params.subcategory || null}
                />
            </Suspense>
        </>
    );
}