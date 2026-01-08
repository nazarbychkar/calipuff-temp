import ProductClientWrapper from "./ProductClientWrapper";
import StructuredData from "@/components/shared/StructuredData";
import { notFound } from "next/navigation";
import { sqlGetProduct } from "@/lib/sql";

interface Product {
  id: number;
  name: string;
  price: number;
  old_price?: number | null;
  discount_percentage?: number | null;
  description?: string | null;
  isAvailable?: boolean;
  media?: { url: string; type: string }[];
  colors?: { label: string; hex?: string | null }[];
  // CBD-specific fields
  cbdContentMg?: number;
  thcContentMg?: number | null;
  // Product specifications
  effect?: string | null;
  inhalationCount?: string | null;
  volume?: string | null;
  composition?: string | null;
  deviceType?: string | null;
  manufacturer?: string | null;
  // Boolean badges
  isPopular?: boolean;
  isRecommended?: boolean;
  hasStrongEffect?: boolean;
  // Category for similar products
  category?: { name: string } | null;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const productId = Number(id);
    if (isNaN(productId)) {
      console.error("Invalid product ID:", id);
      return null;
    }
    
    const product = await sqlGetProduct(productId);
    if (!product) {
      console.log(`Product with ID ${id} not found`);
    } else {
      console.log(`Successfully fetched product ${id}: ${product.name}`);
    }
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    // Log more details in production
    if (process.env.NODE_ENV === 'production') {
      console.error("Product ID:", id);
      console.error("Error details:", error instanceof Error ? error.message : String(error));
    }
    return null;
  }
}

interface ProductServerProps {
  id: string;
}

export default async function ProductServer({ id }: ProductServerProps) {
  const product = await getProduct(id);

  if (!product) {
    console.log(`Product ${id} not found, calling notFound()`);
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calipuff.ua';
  const productImage = product.media?.[0]?.url || `${baseUrl}/images/hero-bg.png`;
  const fullImageUrl = productImage.startsWith('http') ? productImage : `${baseUrl}${productImage}`;

  // Build breadcrumbs
  const breadcrumbs = [
    { name: "Головна", url: baseUrl },
    { name: "Каталог", url: `${baseUrl}/catalog` },
    { name: product.name, url: `${baseUrl}/product/${id}` },
  ];

  // Fetch reviews for structured data
  let reviews: Array<{ author_name: string; rating: number; comment: string | null; created_at: Date }> = [];
  try {
    const { prisma } = await import("@/lib/sql");
    reviews = await prisma.review.findMany({
      where: { product_id: product.id },
      orderBy: { created_at: "desc" },
      take: 10,
    });
  } catch (error) {
    console.error("Error fetching reviews for structured data:", error);
  }

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 5; // Default to 5 if no reviews

  return (
    <>
      <StructuredData
        type="product"
        product={{
          name: product.name,
          description: product.description || `${product.name} від CALIPUFF`,
          price: product.price,
          image: fullImageUrl,
          sku: id.toString(),
          availability: product.isAvailable !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          cbdContentMg: product.cbdContentMg,
          thcContentMg: product.thcContentMg,
          effect: product.effect,
          deviceType: product.deviceType,
          composition: product.composition,
          manufacturer: product.manufacturer,
          category: product.category?.name,
        }}
        reviews={reviews.map(r => ({
          author: r.author_name,
          rating: r.rating,
          comment: r.comment || "",
          date: r.created_at.toISOString(),
        }))}
        aggregateRating={{
          ratingValue: averageRating.toFixed(1),
          reviewCount: reviews.length.toString(),
        }}
      />
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />
      <StructuredData
        type="faq"
        faq={[
          {
            question: `Що таке ${product.name}?`,
            answer: `${product.name} - це ${product.cbdContentMg && product.cbdContentMg > 0 ? `CBD канабіс вейп з ${product.cbdContentMg} мг канабідіолу` : 'вейп'}${product.effect ? ` з ефектом ${product.effect}` : ''}. ${!product.thcContentMg || product.thcContentMg === 0 ? 'Легальний продукт без ТГК, сертифікований та безпечний для використання в Україні.' : ''}`,
          },
          {
            question: `Як використовувати ${product.name}?`,
            answer: `${product.name} можна використовувати як звичайний вейп. ${product.inhalationCount ? `Орієнтовна кількість затяжок: ${product.inhalationCount}.` : ''} ${product.effect ? `Ефект: ${product.effect}.` : ''}`,
          },
          {
            question: `Чи легальний ${product.name} в Україні?`,
            answer: `Так, ${product.name} легальний в Україні. ${!product.thcContentMg || product.thcContentMg === 0 ? 'Продукт не містить ТГК (0.0% THC) та відповідає вимогам українського законодавства. Всі продукти сертифіковані та проходять лабораторні тести.' : 'Продукт відповідає вимогам українського законодавства.'}`,
          },
          {
            question: `Яка доставка для ${product.name}?`,
            answer: `Доставка ${product.name} здійснюється по всій Україні через Нову Пошту. Вартість доставки залежить від розміру та ваги товару. Детальніше про умови доставки можна дізнатися при оформленні замовлення.`,
          },
        ]}
      />
      <ProductClientWrapper product={product} />
    </>
  );
}
