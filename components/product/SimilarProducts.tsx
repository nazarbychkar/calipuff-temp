"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProductImageSrc, getImageUrl } from "@/lib/getFirstProductImage";

interface SimilarProduct {
  id: number;
  name: string;
  price: number;
  first_media: { url: string; type: string } | null;
}

interface SimilarProductsProps {
  productId: number;
  categoryName?: string;
}

export default function SimilarProducts({ productId, categoryName }: SimilarProductsProps) {
  const [products, setProducts] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilarProducts() {
      try {
        setLoading(true);
        // Fetch products from the same category, excluding current product
        const response = await fetch(`/api/products/category?category=${encodeURIComponent(categoryName || '')}`);
        if (response.ok) {
          const data: SimilarProduct[] = await response.json();
          // Filter out current product and limit to 4
          const filtered = data
            .filter((p) => p.id !== productId)
            .slice(0, 4);
          setProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching similar products:", error);
      } finally {
        setLoading(false);
      }
    }

    if (categoryName) {
      fetchSimilarProducts();
    } else {
      setLoading(false);
    }
  }, [productId, categoryName]);

  if (loading) {
    return (
      <div className="w-full">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Схожі товари
        </h3>
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Схожі товари
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => {
          const isVideo = product.first_media?.type === "video";
          
          return (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex flex-col gap-3 group card-hover"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[2/3] max-h-[350px] sm:max-h-[400px] bg-gray-50 rounded-lg overflow-hidden">
                {isVideo && product.first_media ? (
                  <video
                    src={getImageUrl(product.first_media.url)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loop
                    muted
                    playsInline
                    autoPlay
                    preload="metadata"
                  />
                ) : product.first_media ? (
                  <Image
                    src={getProductImageSrc(
                      product.first_media,
                      "https://placehold.co/432x613"
                    )}
                    alt={product.name}
                    width={400}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 420px) 45vw, (max-width: 640px) 45vw, (max-width: 1024px) 33vw, 400px"
                    loading="lazy"
                    quality={75}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    Немає зображення
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 leading-tight line-clamp-2 text-center">
                  {product.name}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-[#FFA500]">
                    {product.price.toLocaleString()} ₴
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

