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
  } catch (e) {
    return false;
  }
}

export async function GET() {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(promoCodes);
  } catch (error) {
    console.error("[GET /api/admin/promo-codes]", error);
    return NextResponse.json(
      { error: "Failed to fetch promo codes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { code, discount_percent, is_one_time } = body;

    if (!code || !discount_percent) {
      return NextResponse.json(
        { error: "Код та відсоток знижки обов'язкові" },
        { status: 400 }
      );
    }

    if (discount_percent < 1 || discount_percent > 100) {
      return NextResponse.json(
        { error: "Відсоток знижки має бути від 1 до 100" },
        { status: 400 }
      );
    }

    // Перевірка на унікальність коду
    const existing = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Промокод з таким кодом вже існує" },
        { status: 400 }
      );
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discount_percent: Number(discount_percent),
        is_one_time: Boolean(is_one_time),
        is_active: true,
        usage_count: 0,
      },
    });

    return NextResponse.json(promoCode, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/promo-codes]", error);
    return NextResponse.json(
      { error: "Failed to create promo code" },
      { status: 500 }
    );
  }
}

