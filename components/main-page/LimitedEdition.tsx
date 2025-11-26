"use client";

import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import Image from "next/image";
import { getProductImageSrc } from "@/lib/getFirstProductImage";
import { useProducts } from "@/lib/useProducts";
import { BRAND } from "@/lib/brand";
import { useAppContext } from "@/lib/GeneralProvider";

// Define a fallback (template) product
const templateProduct = {
  id: -1,
  name: "Шовкова сорочка без рукавів",
  price: 1780,
  first_media: null, // Will use fallback in getProductImageSrc
  limited_edition: false,
};

export default function LimitedEdition() {
  const { isDark } = useAppContext();
  const { products: limitedEditionProducts, loading } = useProducts({
    limitedEdition: true,
  });

  // Fill with template products if there are not enough and transform to include first_media
  const products = useMemo(() => {
    // Transform products to include first_media from media array (like TopSale does)
    const transformed = limitedEditionProducts.map((product) => ({
      ...product,
      first_media: product.media?.[0] ?? product.first_media ?? null,
    }));

    // Fill up to 8 first (so we still get templates if needed)
    const filled =
      transformed.length < 8
        ? [
            ...transformed,
            ...Array(8 - transformed.length).fill(templateProduct),
          ]
        : transformed;

    // ✅ Then limit to 4
    return filled.slice(0, 4);
  }, [limitedEditionProducts]);

  if (loading) {
    return <div className="text-center py-10">Завантаження...</div>;
  }

  return (
    <section className="max-w-[1920px] mx-auto w-full mb-12 relative overflow-hidden flex flex-col gap-10 -mt-12 md:-mt-16 lg:-mt-20 pt-12 md:pt-16 lg:pt-8 bg-white pb-24 md:pb-32 lg:pb-40">
      <div className="pb-10 flex flex-col lg:flex-row justify-between items-center mt-20 px-6 sm:px-10 relative">
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FFA500] via-[#FFD700] to-[#40E0D0]"></div>
        <div className="text-2xl lg:text-5xl font-semibold font-['Montserrat'] uppercase tracking-wide flex items-center gap-3">
          <span className="text-center">Лімітована хвиля</span>
          <span className="bg-gradient-to-b from-[#FFA500] via-[#FFD700] to-[#40E0D0] bg-clip-text text-transparent text-3xl lg:text-6xl leading-none">
            |
          </span>
          <span className="text-black">{BRAND.name}</span>
        </div>
        <div className="text-left lg:text-right opacity-70 text-base lg:text-xl font-normal font-['Poppins'] capitalize leading-normal mt-4 lg:mt-0">
          Каліфорнійські смаки, що виходять невеликими серіями: насичені солодкі
          хвилі вдень та освіжаючі вечірні бризи.
        </div>
      </div>

      {/* Mobile layout: Two stacked sliders */}
      <div className="sm:hidden">
        {/* First Slider */}
        <Swiper
          spaceBetween={12}
          slidesPerView={1.5}
          centeredSlides={true}
          grabCursor={true}
          initialSlide={0}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 8 },
            480: { slidesPerView: 1.5, spaceBetween: 12 },
          }}
        >
          {products.map((product, i) => (
            <SwiperSlide key={product.id !== -1 ? product.id : `template-${i}`}>
              <Link
                href={`/product/${product.id}`}
                className="w-full group space-y-5"
              >
                <div className="relative w-full h-[500px]">
                  <Image
                    className="object-cover group-hover:brightness-90 transition duration-300"
                    src={getProductImageSrc(
                      product.first_media,
                      "https://placehold.co/432x682/FFA500/FFFFFF?text=Product"
                    )}
                    alt={product.name}
                    fill
                    sizes="90vw"
                  />
                </div>
                <div>
                  <div className="text-xl font-normal font-['Poppins'] capitalize leading-normal text-center">
                    {product.name}
                  </div>
                  <div className="text-xl font-semibold text-[#FFA500] leading-none text-center">
                    {product.price.toLocaleString()} ₴
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Second Slider */}
        <Swiper
          spaceBetween={12}
          slidesPerView={1.5}
          centeredSlides={true}
          grabCursor={true}
          initialSlide={0}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 8 },
            480: { slidesPerView: 1.5, spaceBetween: 12 },
          }}
        >
          {products.map((product, i) => (
            <SwiperSlide key={product.id !== -1 ? product.id : `template-${i}`}>
              <Link
                href={`/product/${product.id}`}
                className="w-full group space-y-5"
              >
                <div className="relative w-full h-[500px]">
                  <Image
                    className="object-cover group-hover:brightness-90 transition duration-300"
                    src={getProductImageSrc(
                      product.first_media,
                      "https://placehold.co/432x682/FFA500/FFFFFF?text=Product"
                    )}
                    alt={product.name}
                    fill
                    sizes="90vw"
                  />
                </div>
                <div>
                  <div className="text-xl font-normal font-['Poppins'] capitalize leading-normal text-center">
                    {product.name}
                  </div>
                  <div className="text-xl font-semibold text-[#FFA500] leading-none text-center">
                    {product.price.toLocaleString()} ₴
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop layout: 4x2 Grid */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 px-6 sm:px-10">
        {products.map((product, i) => (
          <Link
            href={`/product/${product.id}`}
            key={product.id !== -1 ? product.id : `template-${i}`}
            className="group space-y-4 sm:space-y-5 w-full"
          >
            <div className="aspect-[2/3] w-full overflow-hidden relative">
              {product.first_media?.type === "video" ? (
                <video
                  src={`/api/images/${product.first_media.url}`}
                  className="object-cover group-hover:brightness-90 transition duration-300 w-full h-full"
                  loop
                  muted
                  playsInline
                  autoPlay
                  preload="metadata"
                />
              ) : (
                <Image
                  className="object-cover group-hover:brightness-90 transition duration-300"
                  src={getProductImageSrc(
                    product.first_media,
                    "https://placehold.co/432x682/FFA500/FFFFFF?text=Product"
                  )}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
              )}
            </div>

            <div>
              <div className="text-center text-base sm:text-lg md:text-xl font-normal font-['Poppins'] capitalize leading-normal">
                {product.name}
              </div>
              <div className="text-center text-base sm:text-lg font-semibold text-[#FFA500] leading-none">
                {product.price.toLocaleString()} ₴
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Smooth transition gradient to FAQ section - positioned at bottom */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[1920px] h-24 md:h-32 lg:h-40 pointer-events-none z-20">
        <div className={`h-full bg-gradient-to-b from-transparent ${
          isDark ? "via-stone-900/90 to-stone-900" : "via-[#FFF4E6]/90 to-[#FFF4E6]"
        }`}>
          {/* Wave transition element */}
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,200 Q300,100 600,140 T1200,140 L1200,200 L0,200 Z" fill={isDark ? "#1c1917" : "#FFF4E6"} opacity="0.95" />
            <path d="M0,200 Q250,120 500,150 T1000,150 T1200,150 L1200,200 L0,200 Z" fill={isDark ? "#1c1917" : "#FFF4E6"} opacity="0.9" />
            <path d="M0,200 Q350,110 700,145 T1200,145 L1200,200 L0,200 Z" fill={isDark ? "#1c1917" : "#FFF4E6"} opacity="0.85" />
          </svg>
        </div>
      </div>
    </section>
  );
}
