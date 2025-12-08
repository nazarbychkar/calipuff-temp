import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/sql";
import { generateSlug } from "@/lib/slug";

// GET - отримати всі пости (з фільтром published для публічної сторінки)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const published = url.searchParams.get("published");
    const limit = url.searchParams.get("limit");
    const offset = url.searchParams.get("offset");

    const where: { published?: boolean } = {};
    if (published === "true") {
      where.published = true;
    }

    const take = limit ? parseInt(limit, 10) : undefined;
    const skip = offset ? parseInt(offset, 10) : undefined;

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { created_at: "desc" },
      take,
      skip,
    });

    const total = await prisma.blogPost.count({ where });

    return NextResponse.json({
      posts,
      total,
    });
  } catch (error) {
    console.error("[GET /api/blog]", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST - створити новий пост
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { title, slug, excerpt, content, imageUrl, published, publishedAt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title, content" },
        { status: 400 }
      );
    }

    // Автоматично генеруємо slug з заголовку, якщо не наданий
    if (!slug) {
      slug = generateSlug(title);
    }

    // Якщо slug порожній після генерації, повертаємо помилку
    if (!slug) {
      return NextResponse.json(
        { error: "Cannot generate slug from title" },
        { status: 400 }
      );
    }

    // Перевірка чи slug вже існує, якщо так - додаємо номер
    let finalSlug = slug;
    let counter = 1;
    while (true) {
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: finalSlug },
      });

      if (!existingPost) {
        break;
      }

      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    slug = finalSlug;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        imageUrl: imageUrl || null,
        published: published === true,
        publishedAt: published && publishedAt ? new Date(publishedAt) : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/blog]", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Post with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
