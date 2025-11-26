import ProductClientWrapper from "./ProductClientWrapper";
import { notFound } from "next/navigation";
import { sqlGetProduct } from "@/lib/sql";

interface Product {
  id: number;
  name: string;
  price: number;
  old_price?: number | null;
  discount_percentage?: number | null;
  description?: string | null;
  stock?: number;
  media?: { url: string; type: string }[];
  colors?: { label: string; hex?: string | null }[];
  // CBD-specific fields
  cbdContentMg?: number;
  thcContentMg?: number | null;
  potency?: string | null;
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

  // Wrap ProductClient to ensure it only renders client-side after hydration
  return <ProductClientWrapper product={product} />;
}
