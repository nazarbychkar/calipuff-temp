import ProductServer from "@/components/product/ProductServer";
import YouMightLike from "@/components/product/YouMightLike";
import { Suspense } from "react";
import { generateMetadata } from "./metadata";
export { generateMetadata };

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Allow dynamic rendering as fallback if static generation fails
// This ensures the route works even if generateStaticParams returns empty array
export const dynamicParams = true;
export const revalidate = 300; // ISR every 5 minutes
export const runtime = 'nodejs'; // Ensure Node.js runtime for database access

// Generate static params for popular products
// This runs at build time, but if it fails, the route will still work dynamically
export async function generateStaticParams() {
  try {
    // Only try to generate static params if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log("DATABASE_URL not available during build, skipping static generation");
      return [];
    }

    const { prisma } = await import("@/lib/sql");
    const products = await prisma.product.findMany({
      take: 50, // Limit to 50 products for build performance
      orderBy: { priority: 'desc' }, // Prioritize important products
    });
    
    console.log(`Generated static params for ${products.length} products`);
    return products.map((product: { id: number }) => ({
      id: String(product.id),
    }));
  } catch (error) {
    // Don't fail the build if static generation fails
    // The route will work dynamically instead
    console.error("Error generating static params (will use dynamic rendering):", error);
    return [];
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <main>
      <Suspense fallback={<div className="text-center py-20 text-lg">Завантаження товару...</div>}>
        <ProductServer id={id} />
      </Suspense>
      <YouMightLike />
    </main>
  );
}
