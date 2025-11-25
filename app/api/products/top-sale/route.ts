import { NextResponse } from "next/server";
import { sqlGetTopSaleProducts } from "@/lib/sql";

export async function GET() {
  try {
    const products = await sqlGetTopSaleProducts();
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[GET /api/products/top-sale]", error);
    return NextResponse.json(
      { error: "Failed to fetch top sale products" },
      { status: 500 }
    );
  }
}

export const revalidate = 300;
