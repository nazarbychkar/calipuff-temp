"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation"; // Next.js 13+ client hook for reading query params
import SidebarFilter from "../layout/SidebarFilter";
import { useAppContext } from "@/lib/GeneralProvider";
import SidebarMenu from "../layout/SidebarMenu";
import Link from "next/link";
import Image from "next/image";
import { getProductImageSrc } from "@/lib/getFirstProductImage";
import { cachedFetch, CACHE_KEYS } from "@/lib/cache";

// Video component with proper mobile autoplay
function VideoWithAutoplay({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      
      const playVideo = async () => {
        try {
          await video.play();
        } catch {
          // Retry after delay for mobile
          setTimeout(async () => {
            try {
              await video.play();
            } catch (e) {
              console.log("Video autoplay failed:", e);
            }
          }, 200);
        }
      };
      
      if (video.readyState >= 2) {
        playVideo();
      } else {
        video.addEventListener('loadeddata', playVideo, { once: true });
        video.addEventListener('canplay', playVideo, { once: true });
        video.load();
      }
    }
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      loop
      muted
      playsInline
      autoPlay
      preload="metadata"
    />
  );
}

interface Product {
  id: number;
  name: string;
  price: number;
  first_media?: { url: string; type: string } | null;
  color?: string | null;
}

export default function Catalog() {
  const { isSidebarOpen, setIsSidebarOpen } = useAppContext();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesColor =
        selectedColors.length === 0 || (product.color && selectedColors.includes(product.color));

      const matchesMinPrice = minPrice === null || product.price >= minPrice;
      const matchesMaxPrice = maxPrice === null || product.price <= maxPrice;

      return matchesMinPrice && matchesMaxPrice && matchesColor;
    });
  }, [products, minPrice, maxPrice, selectedColors]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );
  }, [filteredProducts, sortOrder]);

  // Read filters from URL params
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        let url = "/api/products";
        let cacheKey = CACHE_KEYS.PRODUCTS;

        if (subcategory) {
          url = `/api/products/subcategory?subcategory=${encodeURIComponent(
            subcategory
          )}`;
          cacheKey = CACHE_KEYS.PRODUCTS_SUBCATEGORY(subcategory);
        } else if (category) {
          url = `/api/products/category?category=${encodeURIComponent(
            category
          )}`;
          cacheKey = CACHE_KEYS.PRODUCTS_CATEGORY(category);
        }

        const data = await cachedFetch<Product[]>(url, cacheKey);
        setProducts(data);
      } catch (err: unknown) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    // Fetch colors
    async function fetchColors() {
      try {
        const data = await cachedFetch<{ color: string }[]>(
          "/api/colors",
          CACHE_KEYS.COLORS
        );
        const colorNames = data.map((item: { color: string }) => item.color);
        setColors(colorNames);
      } catch (err: unknown) {
        console.error("Error fetching colors:", err);
      }
    }

    fetchProducts();
    fetchColors();
  }, [category, subcategory]); // refetch if URL params change

  if (loading) return <div>Loading products...</div>;

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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            // Debug logging
            if (product.first_media) {
              console.log(`[Catalog] Product ${product.id} - first_media:`, product.first_media);
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
                  <VideoWithAutoplay
                    src={`/api/images/${product.first_media.url}`}
                    className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
                  />
                ) : (
                  <Image
                    src={getProductImageSrc(product.first_media)}
                    alt={product.name}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-2">
                <h3 className="text-base sm:text-lg font-medium leading-tight line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#FFA500]">
                    {product.price.toLocaleString()}₴
                  </span>
                </div>
              </div>
            </Link>
          );
          })}
        </div>
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
        products={products}
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
