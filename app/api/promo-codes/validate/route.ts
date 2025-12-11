import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/sql";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Промокод не вказано" },
        { status: 400 }
      );
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promoCode) {
      return NextResponse.json(
        { valid: false, error: "Промокод не знайдено" },
        { status: 404 }
      );
    }

    if (!promoCode.is_active) {
      return NextResponse.json(
        { valid: false, error: "Промокод неактивний" },
        { status: 400 }
      );
    }

    if (promoCode.is_one_time && promoCode.usage_count > 0) {
      return NextResponse.json(
        { valid: false, error: "Промокод вже використано" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      discount_percent: promoCode.discount_percent,
      code: promoCode.code,
    });
  } catch (error) {
    console.error("[GET /api/promo-codes/validate]", error);
    return NextResponse.json(
      { error: "Помилка валідації промокоду" },
      { status: 500 }
    );
  }
}

