"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProductImageSrc } from "@/lib/getFirstProductImage";
import { useProducts } from "@/lib/useProducts";

export default function YouMightLike() {
  const { products: allProducts, loading } = useProducts();

  // Shuffle and pick 4 random products
  const products = useMemo(() => {
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [allProducts]);

  if (loading) return null; // or a spinner

  return (
    <section className="max-w-[1920px] w-full mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
      <div className="flex flex-col gap-8 md:gap-12">
        {/* Title */}
        <div className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center md:text-left">
          Вам може сподобатися
        </div>

        {/* Products list - Mobile Optimized */}
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
                <div className="relative w-full aspect-[2/3] bg-gray-50 rounded-lg overflow-hidden">
                  {isVideo && product.first_media ? (
                    <video
                      src={`/api/images/${product.first_media.url}`}
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
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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

        {/* More products button */}
        <div className="flex justify-center mt-4">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-base md:text-lg uppercase tracking-wide bg-[#FFA500] text-white hover:bg-[#ff8c00] transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            Переглянути всі товари
          </Link>
        </div>
      </div>
    </section>
  );
}
