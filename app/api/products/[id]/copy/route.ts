import { NextRequest, NextResponse } from "next/server";
import { sqlGetProduct } from "@/lib/sql";
import { prisma } from "@/lib/sql";

// =========================
// POST /api/products/[id]/copy
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

    // Отримуємо оригінальний продукт з усіма даними
    const originalProduct = await sqlGetProduct(id);

    if (!originalProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Створюємо новий продукт з копією всіх даних
    // Додаємо "Копія" до назви
    const copiedName = `${originalProduct.name} (Копія)`;

    // Підготовка медіа файлів (копіюємо URL, не завантажуємо заново)
    const media = (originalProduct.media || []).map((m: { type: string; url: string }) => ({
      type: m.type,
      url: m.url,
    }));

    // Підготовка кольорів
    const colors = (originalProduct.colors || []).map((c: { label: string; hex?: string | null }) => ({
      label: c.label,
      hex: c.hex || null,
    }));

    // Створюємо новий продукт
    const newProduct = await prisma.product.create({
      data: {
        name: copiedName,
        description: originalProduct.description || null,
        price: originalProduct.price,
        old_price: originalProduct.old_price || null,
        discount_percentage: originalProduct.discount_percentage || null,
        priority: originalProduct.priority || 0,
        top_sale: originalProduct.top_sale || false,
        limited_edition: originalProduct.limited_edition || false,
        isPopular: originalProduct.isPopular || false,
        isRecommended: originalProduct.isRecommended || false,
        hasStrongEffect: originalProduct.hasStrongEffect || false,
        category_id: originalProduct.category_id,
        subcategory_id: originalProduct.subcategory_id || null,
        // CBD-specific fields
        cbdContentMg: originalProduct.cbdContentMg || 0,
        thcContentMg: originalProduct.thcContentMg || null,
        isAvailable: originalProduct.isAvailable !== undefined ? originalProduct.isAvailable : true,
        // Product specifications
        effect: originalProduct.effect || null,
        inhalationCount: originalProduct.inhalationCount || null,
        volume: originalProduct.volume || null,
        composition: originalProduct.composition || null,
        deviceType: originalProduct.deviceType || null,
        manufacturer: originalProduct.manufacturer || null,
        // Створюємо медіа файли
        media: {
          create: media.map((m) => ({
            type: m.type,
            url: m.url,
          })),
        },
        // Створюємо кольори
        colors: {
          create: colors.map((c) => ({
            label: c.label,
            hex: c.hex,
          })),
        },
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        product: newProduct,
        message: "Продукт успішно скопійовано" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /products/:id/copy]", error);
    return NextResponse.json(
      { error: "Failed to copy product" },
      { status: 500 }
    );
  }
}

