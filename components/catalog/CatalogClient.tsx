"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import SidebarFilter from "../layout/SidebarFilter";
import { useAppContext } from "@/lib/GeneralProvider";
import SidebarMenu from "../layout/SidebarMenu";
import Link from "next/link";
import Image from "next/image";
import { getProductImageSrc } from "@/lib/getFirstProductImage";

interface Product {
  id: number;
  name: string;
  price: number;
  first_media?: { url: string; type: string } | null;
  color?: string | null;
  discount_percentage?: number;
}

interface CatalogClientProps {
  initialProducts: Product[];
  colors: string[];
}

export default function CatalogClient({
  initialProducts,
  colors,
}: CatalogClientProps) {
  const { isSidebarOpen, setIsSidebarOpen } = useAppContext();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesColor =
        selectedColors.length === 0 ||
        (product.color && selectedColors.includes(product.color));

      const matchesMinPrice = minPrice === null || product.price >= minPrice;
      const matchesMaxPrice = maxPrice === null || product.price <= maxPrice;

      return matchesMinPrice && matchesMaxPrice && matchesColor;
    });
  }, [initialProducts, minPrice, maxPrice, selectedColors]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );
  }, [filteredProducts, sortOrder]);

  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  const [visibleCount, setVisibleCount] = useState(12);

  const visibleProducts = useMemo(() => {
    return sortedProducts.slice(0, visibleCount);
  }, [sortedProducts, visibleCount]);

  return (
    <>
      <section className="max-w-[1824px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 mt-10 mb-20">
        {/* Top Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="cursor-pointer text-2xl sm:text-3xl hover:text-[#FFA500] transition-colors"
            >
              {"<"}
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {subcategory
                  ? subcategory
                  : category
                  ? category
                  : "Усі товари"}
              </h1>
              {subcategory && category && (
                <p className="text-sm text-gray-500 mt-1">{category}</p>
              )}
            </div>
          </div>

          <button
            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:border-[#FFA500] hover:text-[#FFA500] transition-colors text-sm sm:text-base"
            onClick={() => setIsFilterOpen(true)}
          >
            Фільтри
          </button>
        </div>

        {/* Product Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {visibleProducts.map((product, index) => {
            // Debug logging
            if (product.first_media) {
              console.log(`[CatalogClient] Product ${product.id} - first_media:`, product.first_media);
            }
            
            return (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="flex flex-col gap-3 group card-hover"
            >
              {/* Image or Video */}
              <div className="relative w-full aspect-[2/3] bg-gray-50 rounded-lg overflow-hidden">
                {product.first_media?.type === "video" ? (
                  <video
                    src={`/api/images/${product.first_media.url}`}
                    className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
                    loop
                    muted
                    playsInline
                    autoPlay
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={getProductImageSrc(
                      product.first_media,
                      "https://placehold.co/432x613"
                    )}
                    alt={product.name}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 420px) 45vw, (max-width: 640px) 45vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    loading={index < 6 ? "eager" : "lazy"}
                    priority={index < 4}
                    quality={index < 8 ? 80 : 70}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm sm:text-base font-medium leading-tight line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  {product.discount_percentage ? (
                    <>
                      <span className="text-lg font-bold text-[#FFA500]">
                        {(
                          product.price *
                          (1 - product.discount_percentage / 100)
                        ).toFixed(0)}₴
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {product.price}₴
                      </span>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        -{product.discount_percentage}%
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-[#FFA500]">
                      {product.price.toLocaleString()}₴
                    </span>
                  )}
                </div>
              </div>
              </Link>
            );
          })}
        </div>
        {visibleCount < sortedProducts.length && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="cursor-pointer px-6 py-3 bg-stone-900 text-stone-100"
            >
              Показати ще
            </button>
          </div>
        )}
      </section>

      <SidebarFilter
        isDark={false}
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        openAccordion={openAccordion}
        setOpenAccordion={setOpenAccordion}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
        colors={colors}
        products={initialProducts}
      />

      {/* Menu Sidebar */}
      <SidebarMenu
        isDark={false}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
    </>
  );
}
