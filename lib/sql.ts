import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

const db = prisma;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    media: true;
    colors: true;
    category: true;
    subcategory: true;
  };
}>;

const productInclude = {
  media: true,
  colors: true,
  category: true,
  subcategory: true,
};

type OrderEntity = Prisma.OrderGetPayload<Record<string, never>>;

const decimalToNumber = (value: Prisma.Decimal | null) =>
  value ? Number(value) : null;

function normalizeProduct(product: ProductWithRelations) {
  const record = product;

  return {
    id: record.id,
    name: record.name,
    description: record.description,
    price: Number(record.price),
    old_price: decimalToNumber(record.old_price),
    discount_percentage: record.discount_percentage,
    priority: record.priority,
    top_sale: record.top_sale,
    limited_edition: record.limited_edition,
    color: record.color,
    category_id: record.category_id,
    subcategory_id: record.subcategory_id,
    // CBD-specific fields
    cbdContentMg: record.cbdContentMg ?? 0,
    thcContentMg: record.thcContentMg ?? null,
    potency: record.potency ?? null,
    imageUrl: record.imageUrl ?? null,
    stock: record.stock ?? 0,
    created_at: record.created_at,
    updated_at: record.updated_at,
    category: record.category,
    subcategory: record.subcategory,
    media: (record.media ?? []).map((media) => ({
      id: media.id,
      url: media.url,
      type: media.type,
    })),
    first_media: record.media?.[0] ? {
      url: record.media[0].url,
      type: record.media[0].type,
    } : null,
    colors: (record.colors ?? []).map((color) => ({
      id: color.id,
      label: color.label,
      hex: color.hex,
    })),
  };
}

const normalizeOrder = (order: OrderEntity) => {
  const record = order;
  return {
    ...record,
    items: Array.isArray(record.items) ? record.items : [],
  };
};

type ProductFilter = {
  categoryName?: string;
  subcategoryName?: string;
  limitedEdition?: boolean;
  topSale?: boolean;
};

export async function sqlGetProducts(filter: ProductFilter = {}) {
  const where: Record<string, unknown> = {};

  if (filter.categoryName) {
    where.category = {
      name: { equals: filter.categoryName, mode: "insensitive" },
    };
  }

  if (filter.subcategoryName) {
    where.subcategory = {
      name: { equals: filter.subcategoryName, mode: "insensitive" },
    };
  }

  if (filter.limitedEdition) {
    where.limited_edition = true;
  }

  if (filter.topSale) {
    where.top_sale = true;
  }

  const products = await db.product.findMany({
    where,
    include: productInclude,
    orderBy: [{ priority: "desc" }, { created_at: "desc" }],
  });

  return products.map(normalizeProduct);
}

export async function sqlGetAllCategories() {
  return db.category.findMany({
    include: { subcategories: true },
    orderBy: [{ priority: "desc" }, { name: "asc" }],
  });
}

export async function sqlPostCategory(name: string, priority = 0) {
  return db.category.create({
    data: { name, priority },
  });
}

export async function sqlGetSubcategoriesByCategory(categoryId: number) {
  return db.subcategory.findMany({
    where: { parent_category_id: categoryId },
    orderBy: { name: "asc" },
  });
}

export async function sqlPostSubcategory(name: string, categoryId: number) {
  return db.subcategory.create({
    data: {
      name,
      parent_category_id: categoryId,
    },
  });
}

export async function sqlGetSubcategory(subcategoryId: number) {
  return db.subcategory.findUnique({
    where: { id: subcategoryId },
  });
}

export async function sqlPutSubcategory(
  subcategoryId: number,
  name: string,
  parentCategoryId: number
) {
  return db.subcategory.update({
    where: { id: subcategoryId },
    data: {
      name,
      parent_category_id: parentCategoryId,
    },
  });
}

export async function sqlDeleteSubcategory(subcategoryId: number) {
  await db.subcategory.delete({
    where: { id: subcategoryId },
  });
}

export async function sqlGetAllColors() {
  return db.color.findMany({
    orderBy: { color: "asc" },
  });
}

export async function sqlGetProductsBySubcategoryName(subcategory: string) {
  return sqlGetProducts({ subcategoryName: subcategory });
}

export async function sqlGetProductsByCategoryName(category?: string | null) {
  return sqlGetProducts(
    category ? { categoryName: category } : undefined
  );
}

export async function sqlGetLimitedEditionProducts() {
  return sqlGetProducts({ limitedEdition: true });
}

export async function sqlGetProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    include: productInclude,
  });
  return product ? normalizeProduct(product) : null;
}

type UpsertProductInput = {
  name: string;
  description?: string | null;
  price: number;
  old_price?: number | null;
  discount_percentage?: number | null;
  priority?: number;
  top_sale?: boolean;
  limited_edition?: boolean;
  color?: string | null;
  category_id: number;
  subcategory_id?: number | null;
  // CBD-specific fields
  cbdContentMg?: number;
  thcContentMg?: number | null;
  potency?: string | null;
  imageUrl?: string | null;
  stock?: number;
  media: { type: string; url: string }[];
  colors: { label: string; hex?: string | null }[];
};

export async function sqlPutProduct(
  id: number,
  data: UpsertProductInput
): Promise<void> {
  const {
    media,
    colors,
    price,
    old_price,
    discount_percentage,
    priority = 0,
    top_sale = false,
    limited_edition = false,
    category_id,
    subcategory_id,
    color,
    description,
    name,
    cbdContentMg = 0,
    thcContentMg,
    potency,
    imageUrl,
    stock = 0,
  } = data;

  await prisma.$transaction(async (txRaw) => {
    const tx = txRaw;
    await tx.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        old_price,
        discount_percentage,
        priority,
        top_sale,
        limited_edition,
        color,
        category_id,
        subcategory_id,
        cbdContentMg,
        thcContentMg,
        potency,
        imageUrl,
        stock,
      },
    });

    await tx.productMedia.deleteMany({ where: { product_id: id } });
    if (media.length) {
      await tx.productMedia.createMany({
        data: media.map((item) => ({
          product_id: id,
          type: item.type,
          url: item.url,
        })),
      });
    }

    await tx.productColor.deleteMany({ where: { product_id: id } });
    if (colors.length) {
      await tx.productColor.createMany({
        data: colors.map((item) => ({
          product_id: id,
          label: item.label,
          hex: item.hex,
        })),
      });
    }
  });
}

export async function sqlDeleteProduct(id: number) {
  await db.product.delete({
    where: { id },
  });
}

export async function sqlGetRelatedColorsByName(name: string) {
  const products = await db.product.findMany({
    where: {
      name: {
        contains: name.trim(),
        mode: "insensitive",
      },
    },
    include: {
      colors: {
        take: 1,
        orderBy: { created_at: "asc" },
      },
    },
    orderBy: [{ priority: "desc" }, { created_at: "desc" }],
    take: 8,
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    first_color: product.colors[0]
      ? {
          label: product.colors[0].label,
          hex: product.colors[0].hex,
        }
      : null,
  }));
}

export async function sqlGetTopSaleProducts() {
  return sqlGetProducts({ topSale: true });
}

type NormalizedOrderItem = {
  product_id: number;
  size: string;
  quantity: number;
  price: number;
  color: string | null;
};

type CreateOrderInput = {
  customer_name: string;
  phone_number: string;
  email?: string | null;
  delivery_method: string;
  city: string;
  post_office: string;
  comment?: string | null;
  payment_type: string;
  invoice_id?: string | null;
  status?: string;
  items: NormalizedOrderItem[];
};

export async function sqlGetAllOrders() {
  const orders = await db.order.findMany({
    orderBy: { created_at: "desc" },
  });
  return orders.map(normalizeOrder);
}

export async function sqlPostOrder(data: CreateOrderInput) {
  const order = await db.order.create({
    data: {
      customer_name: data.customer_name,
      phone_number: data.phone_number,
      email: data.email,
      delivery_method: data.delivery_method,
      city: data.city,
      post_office: data.post_office,
      comment: data.comment,
      payment_type: data.payment_type,
      invoice_id: data.invoice_id ?? null,
      status: data.status ?? "unpaid",
      items: data.items as Prisma.JsonArray,
    },
  });
  return normalizeOrder(order);
}

export async function sqlGetOrder(id: number) {
  const order = await db.order.findUnique({
    where: { id },
  });
  return order ? normalizeOrder(order) : null;
}

export async function sqlPutOrder(
  id: number,
  data: { status: string }
) {
  const order = await db.order.update({
    where: { id },
    data: { status: data.status },
  });
  return normalizeOrder(order);
}

export async function sqlDeleteOrder(id: number) {
  await db.order.delete({
    where: { id },
  });
}

export async function sqlUpdatePaymentStatus(
  invoiceId: string,
  status: string
) {
  await db.order.updateMany({
    where: { invoice_id: invoiceId },
    data: { status },
  });
}

export async function sqlGetOrderByInvoiceId(invoiceId: string) {
  const order = await db.order.findFirst({
    where: { invoice_id: invoiceId },
  });
  return order ? normalizeOrder(order) : null;
}

export { prisma };
