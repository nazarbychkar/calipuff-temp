import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/sql";
import { cookies } from "next/headers";

async function checkAuth() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("admin_auth");
    if (!authCookie) {
      return false;
    }
    
    // Перевіряємо валідність токену (аналогічно до middleware)
    const token = authCookie.value;
    const decoded = Buffer.from(token, "base64").toString();
    const [user, password] = decoded.split(":");

    const validUser = process.env.ADMIN_USER;
    const validPass = process.env.ADMIN_PASS;

    if (user === validUser && password === validPass) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await req.json();
    const { code, discount_percent, is_one_time, is_active } = body;

    if (discount_percent !== undefined && (discount_percent < 1 || discount_percent > 100)) {
      return NextResponse.json(
        { error: "Відсоток знижки має бути від 1 до 100" },
        { status: 400 }
      );
    }

    // Перевірка на унікальність коду (якщо код змінюється)
    if (code) {
      const existing = await prisma.promoCode.findFirst({
        where: {
          code: code.toUpperCase(),
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Промокод з таким кодом вже існує" },
          { status: 400 }
        );
      }
    }

    const updateData: {
      code?: string;
      discount_percent?: number;
      is_one_time?: boolean;
      is_active?: boolean;
    } = {};
    if (code !== undefined) updateData.code = code.toUpperCase();
    if (discount_percent !== undefined) updateData.discount_percent = Number(discount_percent);
    if (is_one_time !== undefined) updateData.is_one_time = Boolean(is_one_time);
    if (is_active !== undefined) updateData.is_active = Boolean(is_active);

    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(promoCode);
  } catch (error) {
    console.error("[PUT /api/admin/promo-codes/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update promo code" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);

    // Деактивуємо замість видалення
    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: { is_active: false },
    });

    return NextResponse.json(promoCode);
  } catch (error) {
    console.error("[DELETE /api/admin/promo-codes/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete promo code" },
      { status: 500 }
    );
  }
}

