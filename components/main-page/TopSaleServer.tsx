import TopSaleClient from "./TopSaleClient";
import { sqlGetTopSaleProducts } from "@/lib/sql";

interface Product {
  id: number;
  name: string;
  price: number;
  first_media?: { url: string; type: string } | null;
}

async function getTopSaleProducts(): Promise<Product[]> {
  try {
    const products = await sqlGetTopSaleProducts();

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      first_media: product.media?.[0] ?? null,
    }));
  } catch (error) {
    console.error("Error fetching top sale products:", error);
    return [];
  }
}

export default async function TopSaleServer() {
  const products = await getTopSaleProducts();

  return <TopSaleClient products={products} />;
}

