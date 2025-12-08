import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/sql";

// GET - отримати пост за slug (для публічної сторінки)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Якщо пост не опублікований, повертаємо 404 (для публічного доступу)
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get("admin") === "true";

    if (!post.published && !isAdmin) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("[GET /api/blog/slug/[slug]]", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}
