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
    return await sqlGetProduct(Number(id));
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

interface ProductServerProps {
  id: string;
}

export default async function ProductServer({ id }: ProductServerProps) {
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Wrap ProductClient to ensure it only renders client-side after hydration
  return <ProductClientWrapper product={product} />;
}
