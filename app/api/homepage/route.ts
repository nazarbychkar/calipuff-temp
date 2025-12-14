import { NextResponse } from "next/server";
import { prisma } from "@/lib/sql";

export async function GET() {
  try {
    const content = await (prisma as any).homePageContent.findMany({
      orderBy: { section: "asc" },
    });

    // Transform to object keyed by section
    const contentMap = content.reduce((acc: Record<string, any>, item: any) => {
      acc[item.section] = item;
      return acc;
    }, {} as Record<string, any>);

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

    const content = await (prisma as any).homePageContent.upsert({
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

