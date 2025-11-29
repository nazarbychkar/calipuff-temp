import { Suspense } from "react";
import CatalogServer from "@/components/catalog/CatalogServer";
import StructuredData from "@/components/shared/StructuredData";
import { generateMetadata } from "./metadata";
export { generateMetadata };

interface PageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
  }>;
}

export const revalidate = 300; // ISR every 5 minutes

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calipuff.ua';
    
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
    
    return (
        <>
            <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />
            <Suspense fallback={<div className="text-center py-20 text-lg">Завантаження каталогу...</div>}>
                <CatalogServer 
                    category={params.category || null}
                    subcategory={params.subcategory || null}
                />
            </Suspense>
        </>
    );
}