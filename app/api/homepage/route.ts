import { NextResponse } from "next/server";
import { prisma } from "@/lib/sql";

type HomePageContentType = {
  id: number;
  section: string;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_description?: string | null;
  hero_background_image?: string | null;
  hero_button_text?: string | null;
  hero_button_link?: string | null;
  about_title?: string | null;
  about_description?: string | null;
  about_mission?: unknown;
  why_title?: string | null;
  why_description?: string | null;
  why_items?: unknown;
  content?: unknown;
  images?: unknown;
  created_at: Date;
  updated_at: Date;
};

export async function GET() {
  try {
    const content = await (prisma as unknown as { homePageContent: { findMany: (args: { orderBy: { section: "asc" } }) => Promise<HomePageContentType[]> } }).homePageContent.findMany({
      orderBy: { section: "asc" },
    });

    // Transform to object keyed by section
    const contentMap = content.reduce((acc: Record<string, HomePageContentType>, item: HomePageContentType) => {
      acc[item.section] = item;
      return acc;
    }, {} as Record<string, HomePageContentType>);

    return NextResponse.json(contentMap);
  } catch (error) {
    console.error("[GET /api/homepage]", error);
    return NextResponse.json(
      { error: "Failed to fetch homepage content" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { section, ...data } = body;

    if (!section) {
      return NextResponse.json(
        { error: "Section is required" },
        { status: 400 }
      );
    }

    const content = await (prisma as unknown as { homePageContent: { upsert: (args: { where: { section: string }; update: Record<string, unknown>; create: Record<string, unknown> }) => Promise<HomePageContentType> } }).homePageContent.upsert({
      where: { section },
      update: data,
      create: {
        section,
        ...data,
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error("[POST /api/homepage]", error);
    return NextResponse.json(
      { error: "Failed to update homepage content" },
      { status: 500 }
    );
  }
}

