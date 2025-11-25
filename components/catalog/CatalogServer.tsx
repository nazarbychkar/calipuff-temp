import CatalogClient from "./CatalogClient";
import {
  sqlGetProducts,
  sqlGetAllColors,
} from "@/lib/sql";

interface Product {
  id: number;
  name: string;
  price: number;
  first_media?: { url: string; type: string } | null;
  sizes?: { size: string; stock: number }[];
  color?: string;
}

interface CatalogServerProps {
  category?: string | null;
  season?: string | null;
  subcategory?: string | null;
}

async function getProducts(params: CatalogServerProps): Promise<Product[]> {
  const { category, season, subcategory } = params;

  try {
    if (subcategory) {
      return sqlGetProducts({ subcategoryName: subcategory });
    }
    if (category) {
      return sqlGetProducts({ categoryName: category });
    }
    if (season) {
      return sqlGetProducts({ season });
    }
    return sqlGetProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getColors(): Promise<string[]> {
  try {
    const data = await sqlGetAllColors();
    return data.map((item: { color: string }) => item.color);
  } catch (error) {
    console.error("Error fetching colors:", error);
    return [];
  }
}

export default async function CatalogServer(props: CatalogServerProps) {
  const [products, colors] = await Promise.all([
    getProducts(props),
    getColors(),
  ]);

  return <CatalogClient initialProducts={products} colors={colors} />;
}

