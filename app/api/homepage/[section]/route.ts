import { NextResponse } from "next/server";
import { prisma } from "@/lib/sql";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const content = await (prisma as any).homePageContent.findUnique({
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

    const content = await (prisma as any).homePageContent.upsert({
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
    await (prisma as any).homePageContent.delete({
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

