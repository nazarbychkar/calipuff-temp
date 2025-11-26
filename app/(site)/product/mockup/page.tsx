import ProductClientWrapper from "@/components/product/ProductClientWrapper";
import YouMightLike from "@/components/product/YouMightLike";

// Mock product data for demonstration
// This page shows a static mockup of the product page for client preview
const mockProduct = {
  id: 999,
  name: "Premium CBD Vape Pen - Blueberry",
  price: 1299,
  old_price: 1799,
  discount_percentage: 28,
  description: "Високоякісний вейп з натуральним екстрактом CBD та ароматом свіжої чорниці. Ідеальний для розслаблення та відновлення після навантаження. Містить 500 мг CBD на 1 мл рідини. Без шкідливих добавок та ГМО.",
  stock: 15,
  // Mock media - images will show placeholder if files don't exist
  // Replace these with actual product image filenames from your product-images folder
  media: [
    {
      url: "mockup-product-1.jpg",
      type: "photo"
    },
    {
      url: "mockup-product-2.jpg",
      type: "photo"
    },
    {
      url: "mockup-product-3.jpg",
      type: "photo"
    }
  ],
  colors: [
    {
      label: "Blueberry",
      hex: "#4A90E2"
    },
    {
      label: "Strawberry",
      hex: "#E24A4A"
    },
    {
      label: "Mint",
      hex: "#4AE2A0"
    },
    {
      label: "Vanilla",
      hex: "#F5E6D3"
    }
  ],
  cbdContentMg: 500,
  thcContentMg: null,
  potency: "Medium"
};

export default function MockupProductPage() {
  return (
    <main>
      <ProductClientWrapper product={mockProduct} />
      <YouMightLike />
    </main>
  );
}

