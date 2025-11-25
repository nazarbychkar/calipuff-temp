import { NextResponse } from "next/server";
import { prisma } from "@/lib/sql"; // Make sure to import Prisma client
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Helper function to determine file type
function getFileType(mimeType: string, filename: string): "photo" | "video" {
  if (mimeType.startsWith("video/")) {
    return "video";
  }

  const ext = filename.split(".").pop()?.toLowerCase();
  const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "mkv", "flv", "wmv"];

  if (ext && videoExtensions.includes(ext)) {
    return "video";
  }

  return "photo";
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // JSON flow: expects media already uploaded via /api/images
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const {
        name,
        description,
        price,
        old_price,
        discount_percentage,
        priority = 0,
        media = [],
        colors = [],
        top_sale = false,
        limited_ition,
        limited_edition = false,
        color,
        category_id = null,
        subcategory_id = null,
        // CBD-specific fields
        cbdContentMg = 0,
        thcContentMg,
        potency,
        imageUrl,
        stock = 0,
      } = body || {};

      const numericPrice = Number(price);
      if (!name || !Number.isFinite(numericPrice)) {
        return NextResponse.json(
          { error: "Missing or invalid required fields: name, price" },
          { status: 400 }
        );
      }

      const categoryId = category_id ? Number(category_id) : null;
      if (!categoryId) {
        return NextResponse.json(
          { error: "Category is required" },
          { status: 400 }
        );
      }

      const normalizedColors = Array.isArray(colors)
        ? colors.map((c: string | { label: string; hex?: string | null }) =>
            typeof c === "string"
              ? { label: c, hex: null }
              : { label: c.label, hex: c.hex ?? null }
          )
        : [];

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: numericPrice,
          old_price: old_price ? Number(old_price) : null,
          discount_percentage: discount_percentage
            ? Number(discount_percentage)
            : null,
          priority: Number(priority || 0),
          top_sale,
          limited_edition:
            typeof limited_ition === "boolean" ? limited_ition : limited_edition,
          color,
          category_id: categoryId,
          subcategory_id: subcategory_id ? Number(subcategory_id) : null,
          // CBD-specific fields
          cbdContentMg: Number(cbdContentMg || 0),
          thcContentMg: thcContentMg ? Number(thcContentMg) : null,
          potency: potency || null,
          imageUrl: imageUrl || null,
          stock: Number(stock || 0),
          media: {
            create: Array.isArray(media)
              ? media.map((m: { type: string; url: string }) => ({
                  type: m.type,
                  url: m.url,
                }))
              : [],
          },
          colors: {
            create: normalizedColors,
          },
        },
      });

      return NextResponse.json(product, { status: 201 });
    }

    // Multipart form fallback
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const oldPrice = formData.get("old_price") ? Number(formData.get("old_price")) : null;
    const discountPercentage = formData.get("discount_percentage") ? Number(formData.get("discount_percentage")) : null;
    const priority = formData.get("priority") ? Number(formData.get("priority")) : 0;
    const description = formData.get("description") as string;
    const images = formData.getAll("images") as File[];
    const topSale = formData.get("top_sale") === "true";
    const limitedEdition = formData.get("limited_edition") === "true";
    const color = formData.get("color")?.toString();
    const categoryId = formData.get("category_id") ? Number(formData.get("category_id")) : null;
    const subcategoryId = formData.get("subcategory_id") ? Number(formData.get("subcategory_id")) : null;
    // CBD-specific fields
    const cbdContentMg = formData.get("cbdContentMg") ? Number(formData.get("cbdContentMg")) : 0;
    const thcContentMg = formData.get("thcContentMg") ? Number(formData.get("thcContentMg")) : null;
    const potency = formData.get("potency")?.toString() || null;
    const imageUrl = formData.get("imageUrl")?.toString() || null;
    const stock = formData.get("stock") ? Number(formData.get("stock")) : 0;

    if (!name || !price) {
      return NextResponse.json(
        { error: "Missing required fields: name, price" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // Create the directory to store images
    const uploadDir = path.join(process.cwd(), "product-images");
    await mkdir(uploadDir, { recursive: true });

    const savedMedia: { type: "photo" | "video"; url: string }[] = [];

    // Save the uploaded media (images/videos)
    for (const image of images) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const ext = image.name.split(".").pop();
      const uniqueName = `${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      await writeFile(filePath, buffer);

      const fileType = getFileType(image.type, image.name);
      savedMedia.push({ type: fileType, url: uniqueName });
    }

    // Prisma insertion
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        old_price: oldPrice,
        discount_percentage: discountPercentage,
        priority,
        top_sale: topSale,
        limited_edition: limitedEdition,
        color,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        // CBD-specific fields
        cbdContentMg,
        thcContentMg,
        potency,
        imageUrl,
        stock,
        media: {
          create: savedMedia.map((media) => ({
            type: media.type,
            url: media.url,
          })),
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("[POST /products]", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
