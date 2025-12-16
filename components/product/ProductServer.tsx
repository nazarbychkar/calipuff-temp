import ProductClientWrapper from "./ProductClientWrapper";
import StructuredData from "@/components/shared/StructuredData";
import { notFound } from "next/navigation";
import { sqlGetProduct } from "@/lib/sql";

interface Product {
  id: number;
  name: string;
  price: number;
  old_price?: number | null;
  discount_percentage?: number | null;
  description?: string | null;
  isAvailable?: boolean;
  media?: { url: string; type: string }[];
  colors?: { label: string; hex?: string | null }[];
  // CBD-specific fields
  cbdContentMg?: number;
  thcContentMg?: number | null;
  // Product specifications
  effect?: string | null;
  inhalationCount?: string | null;
  volume?: string | null;
  composition?: string | null;
  deviceType?: string | null;
  manufacturer?: string | null;
  // Boolean badges
  isPopular?: boolean;
  isRecommended?: boolean;
  hasStrongEffect?: boolean;
  // Category for similar products
  category?: { name: string } | null;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const productId = Number(id);
    if (isNaN(productId)) {
      console.error("Invalid product ID:", id);
      return null;
    }
    
    const product = await sqlGetProduct(productId);
    if (!product) {
      console.log(`Product with ID ${id} not found`);
    } else {
      console.log(`Successfully fetched product ${id}: ${product.name}`);
    }
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    // Log more details in production
    if (process.env.NODE_ENV === 'production') {
      console.error("Product ID:", id);
      console.error("Error details:", error instanceof Error ? error.message : String(error));
    }
    return null;
  }
}

interface ProductServerProps {
  id: string;
}

export default async function ProductServer({ id }: ProductServerProps) {
  const product = await getProduct(id);

  if (!product) {
    console.log(`Product ${id} not found, calling notFound()`);
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calipuff.ua';
  const productImage = product.media?.[0]?.url || `${baseUrl}/images/hero-bg.png`;
  const fullImageUrl = productImage.startsWith('http') ? productImage : `${baseUrl}${productImage}`;

  // Build breadcrumbs
  const breadcrumbs = [
    { name: "Головна", url: baseUrl },
    { name: "Каталог", url: `${baseUrl}/catalog` },
    { name: product.name, url: `${baseUrl}/product/${id}` },
  ];

  return (
    <>
      <StructuredData
        type="product"
        product={{
          name: product.name,
          description: product.description || `${product.name} від CALIPUFF`,
          price: product.price,
          image: fullImageUrl,
          sku: id.toString(),
          availability: product.isAvailable !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        }}
      />
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />
      <ProductClientWrapper product={product} />
    </>
  );
}
