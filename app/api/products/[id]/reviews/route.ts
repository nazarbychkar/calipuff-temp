// app/api/products/[id]/reviews/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/sql";

// =========================
// GET /api/products/[id]/reviews
// =========================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { product_id: id },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[GET /products/:id/reviews]", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// =========================
// POST /api/products/[id]/reviews
// =========================
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { author_name, rating, comment } = body;

    if (!author_name || !rating) {
      return NextResponse.json(
        { error: "Missing required fields: author_name, rating" },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const review = await prisma.review.create({
      data: {
        product_id: id,
        author_name: author_name.trim(),
        rating: ratingNum,
        comment: comment?.trim() || null,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("[POST /products/:id/reviews]", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

