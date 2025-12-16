import { NextRequest, NextResponse } from "next/server";
import { sqlGetAllOrders, sqlPostOrder, prisma } from "@/lib/sql";

type IncomingOrderItem = {
  product_id?: number | string;
  productId?: number | string;
  price: number | string;
  quantity: number | string;
  product_name?: string;
  name?: string;
  size: string | number;
  color?: string | null;
};

type NormalizedOrderItem = {
  product_id: number;
  product_name: string;
  size: string;
  quantity: number;
  price: number;
  color: string | null;
};

// ==========================
// GET /api/orders
// ==========================
export async function GET() {
  try {
    const orders = await sqlGetAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("[GET /orders]", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// ==========================
// POST /api/orders
// ==========================
export async function POST(req: NextRequest) {
  try {
    console.log("=".repeat(50));
    console.log("[POST /api/orders] Starting order creation...");
    
    const body = await req.json();
    console.log("[POST /api/orders] Received body:", JSON.stringify(body, null, 2));

    const {
      customer_name,
      phone_number,
      email,
      delivery_method,
      city,
      post_office,
      comment,
      payment_type, // "full" або "prepay"
      items,
      promo_code, // Промокод
    } = body;

    console.log("[POST /api/orders] Extracted data:", {
      customer_name,
      phone_number,
      email,
      delivery_method,
      city,
      post_office,
      payment_type,
      itemsCount: items?.length,
    });

    // ✅ Basic validation
    if (
      !customer_name ||
      !phone_number ||
      !delivery_method ||
      !city ||
      !post_office ||
      !items?.length
    ) {
      console.error("[POST /api/orders] Validation failed:", {
        hasCustomerName: !!customer_name,
        hasPhoneNumber: !!phone_number,
        hasDeliveryMethod: !!delivery_method,
        hasCity: !!city,
        hasPostOffice: !!post_office,
        hasItems: !!items?.length,
      });
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }
    console.log("[POST /api/orders] Validation passed");

    const normalizedItems: NormalizedOrderItem[] = (items || []).map(
      (item: IncomingOrderItem, index: number) => {
        const productIdRaw = item.product_id ?? item.productId;
        const productId = Number(productIdRaw);
        if (!Number.isFinite(productId)) {
          throw new Error(
            `[POST /api/orders] Invalid product_id for item index ${index}`
          );
        }

        const price =
          typeof item.price === "string" ? Number(item.price) : item.price;
        if (!Number.isFinite(price)) {
          throw new Error(
            `[POST /api/orders] Invalid price for item index ${index}`
          );
        }

        const quantity =
          typeof item.quantity === "string"
            ? Number(item.quantity)
            : item.quantity;
        if (!Number.isFinite(quantity)) {
          throw new Error(
            `[POST /api/orders] Invalid quantity for item index ${index}`
          );
        }

        return {
          product_id: productId,
          product_name:
            item.product_name ||
            item.name ||
            `Товар #${productId}`,
          size: String(item.size),
          quantity,
          price,
          color: item.color ?? null,
        };
      }
    );

    const fullAmount = normalizedItems.reduce(
      (total: number, item: NormalizedOrderItem) => total + item.price * item.quantity,
      0
    );

    // Валідація та застосування промокоду
    let promoCodeId: number | null = null;
    let discountAmount: number = 0;
    let finalAmount = fullAmount;

    if (promo_code) {
      const promoCodeRecord = await prisma.promoCode.findUnique({
        where: { code: promo_code.toUpperCase() },
      });

      if (promoCodeRecord && promoCodeRecord.is_active) {
        if (promoCodeRecord.is_one_time && promoCodeRecord.usage_count > 0) {
          return NextResponse.json(
            { error: "Промокод вже використано" },
            { status: 400 }
          );
        }

        promoCodeId = promoCodeRecord.id;
        discountAmount = (fullAmount * promoCodeRecord.discount_percent) / 100;
        finalAmount = fullAmount - discountAmount;

        // Оновлюємо usage_count промокоду
        await prisma.promoCode.update({
          where: { id: promoCodeId },
          data: { usage_count: { increment: 1 } },
        });
      } else {
        return NextResponse.json(
          { error: "Невірний або неактивний промокод" },
          { status: 400 }
        );
      }
    }

    console.log("[POST /api/orders] Amount calculation:", {
      fullAmount,
      discountAmount,
      finalAmount,
      payment_type,
      promoCodeId,
    });

    // ✅ Зберігання замовлення у БД
    console.log("[POST /api/orders] Saving order to database...");
    const savedOrder = await sqlPostOrder({
      customer_name,
      phone_number,
      email,
      delivery_method,
      city,
      post_office,
      comment,
      payment_type,
      invoice_id: null,
      status: "pending", // замовлення створено, очікує підтвердження
      items: normalizedItems.map(
        ({ product_id, size, quantity, price, color }) => ({
          product_id,
          size,
          quantity,
          price,
          color,
        })
      ),
      promo_code_id: promoCodeId,
      discount_amount: discountAmount > 0 ? discountAmount : null,
    });
    console.log("[POST /api/orders] Order saved to database successfully, order ID:", savedOrder.id);

    // ✅ Відправка в Telegram
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (BOT_TOKEN && CHAT_ID) {
      try {
        const orderMessage = `
🛒 <b>Нове замовлення</b>

👤 <b>Ім'я:</b> ${customer_name}
📱 <b>Тел:</b> ${phone_number}
📧 <b>Email:</b> ${email || "—"}
🚚 <b>Доставка:</b> ${delivery_method}
🏙️ <b>Місто:</b> ${city}
🏤 <b>Відділення:</b> ${post_office}
📝 <b>Коментар:</b> ${comment || "—"}
💰 <b>Оплата:</b> ${
          payment_type === "prepay"
            ? "Передплата (300 грн)"
            : payment_type === "crypto"
            ? "Криптовалюта"
            : "Повна оплата при отриманні"
        }
🧾 <b>Сума:</b> ${finalAmount.toFixed(2)} грн
${discountAmount > 0 ? `🎁 <b>Знижка:</b> -${discountAmount.toFixed(2)} грн (промокод)\n` : ""}
📦 <b>Товари:</b>
${normalizedItems
  .map(
    (item, i) => {
      const sizePart = item.size && item.size !== "undefined" && item.size !== "null" ? ` | ${item.size}` : "";
      const colorPart = item.color ? ` (${item.color})` : "";
      return `${i + 1}. ${item.product_name}${colorPart}${sizePart} | x${item.quantity} | ${(item.price * item.quantity).toFixed(2)} грн`;
    }
  )
  .join("\n")}

🆔 <b>ID замовлення:</b> ${savedOrder.id}
        `;

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: orderMessage,
            parse_mode: "HTML",
          }),
        });

        console.log("[POST /api/orders] Telegram notification sent successfully");
      } catch (telegramError) {
        console.error("[POST /api/orders] Failed to send Telegram notification:", telegramError);
        // Не блокуємо створення замовлення, якщо Telegram не працює
      }
    } else {
      console.warn("[POST /api/orders] BOT_TOKEN or CHAT_ID not configured, skipping Telegram notification");
    }
    
    console.log("[POST /api/orders] Successfully completed order creation");
    console.log("=".repeat(50));
    
    return NextResponse.json({ 
      success: true, 
      orderId: savedOrder.id,
      message: "Замовлення успішно створено"
    });
  } catch (error) {
    console.error("[POST /api/orders] ERROR occurred:", error);
    console.error("[POST /api/orders] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    console.log("=".repeat(50));
    
    return NextResponse.json(
      { error: "Failed to create order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
