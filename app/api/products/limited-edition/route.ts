import { NextResponse } from "next/server";
import { sqlGetLimitedEditionProducts } from "@/lib/sql";

export async function GET() {
  try {
    const products = await sqlGetLimitedEditionProducts();
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("[GET /api/products/limited-edition]", error);
    return NextResponse.json(
      { error: "Failed to fetch limited edition products" },
      { status: 500 }
    );
  }
}

export const revalidate = 60; // 1 minute

