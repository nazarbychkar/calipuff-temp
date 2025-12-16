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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const content = await (prisma as unknown as { homePageContent: { findUnique: (args: { where: { section: string } }) => Promise<HomePageContentType | null> } }).homePageContent.findUnique({
      where: { section },
    });

    if (!content) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("[GET /api/homepage/[section]]", error);
    return NextResponse.json(
      { error: "Failed to fetch section content" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const data = await request.json();

    const content = await (prisma as unknown as { homePageContent: { upsert: (args: { where: { section: string }; update: Record<string, unknown>; create: Record<string, unknown> }) => Promise<HomePageContentType> } }).homePageContent.upsert({
      where: { section },
      update: data,
      create: {
        section,
        ...data,
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("[PUT /api/homepage/[section]]", error);
    return NextResponse.json(
      { error: "Failed to update section content" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    await (prisma as unknown as { homePageContent: { delete: (args: { where: { section: string } }) => Promise<HomePageContentType> } }).homePageContent.delete({
      where: { section },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/homepage/[section]]", error);
    return NextResponse.json(
      { error: "Failed to delete section content" },
      { status: 500 }
    );
  }
}

