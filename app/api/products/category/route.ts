import { NextResponse } from "next/server";
import { sqlGetProductsByCategoryName } from "@/lib/sql";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");

  try {
    const products = await sqlGetProductsByCategoryName(category);

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("[GET /api/products/category]", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export const revalidate = 60; // 1 minute
