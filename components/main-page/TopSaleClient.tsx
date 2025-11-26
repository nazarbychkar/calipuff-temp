"use client";

import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductImageSrc } from "@/lib/getFirstProductImage";

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
}

interface TopSaleClientProps {
  products: Product[];
}

export default function TopSaleClient({ products }: TopSaleClientProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-10">Наразі немає топових товарів.</div>
    );
  }

  const limitedProducts = products.slice(0, 4);

  return (
    <section className="max-w-[1920px] mx-auto w-full mb-12 relative overflow-hidden flex flex-col gap-10 pb-24 md:pb-32 lg:pb-40">
      <div className="pb-10 flex flex-col lg:flex-row justify-between items-center mt-20 px-6 sm:px-10 relative">
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FFA500] via-[#FFD700] to-[#40E0D0]"></div>
        <div className="text-2xl lg:text-5xl font-semibold font-['Montserrat'] uppercase tracking-wide flex items-center gap-3">
          <span>Топ продажів</span>
          <span className="bg-gradient-to-b from-[#FFA500] via-[#FFD700] to-[#40E0D0] bg-clip-text text-transparent text-3xl lg:text-6xl leading-none">|</span>
          <span className="text-black">CALIPUFF</span>
        </div>
        <div className="text-left lg:text-right opacity-70 text-base lg:text-xl font-normal font-['Poppins'] capitalize leading-normal mt-4 lg:mt-0">
          Улюблені смаки хвилі та сонця.
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 px-6 sm:px-10">
        {limitedProducts.map((product, index) => (
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            className="flex flex-col gap-3 group w-full"
          >
            <div className="aspect-[2/3] w-full overflow-hidden relative">
              {product.first_media?.type === "video" ? (
                <VideoWithAutoplay
                  src={`/api/images/${product.first_media.url}`}
                  className="object-cover group-hover:brightness-90 transition duration-300 w-full h-full"
                />
              ) : (
                <Image
                  className="object-cover group-hover:brightness-90 transition duration-300"
                  src={getProductImageSrc(
                    product.first_media,
                    "https://placehold.co/432x613"
                  )}
                  alt={product.name}
                  fill
                  sizes="(max-width: 420px) 90vw, (max-width: 640px) 45vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  priority={index < 2} // Only first 2 images get priority for mobile
                  loading={index < 2 ? undefined : "lazy"}
                  quality={index < 4 ? 85 : 75} // Higher quality for first 4, lower for others
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              )}
            </div>

            <div className="text-center text-base sm:text-lg md:text-xl font-normal font-['Poppins'] capitalize leading-normal">
              {product.name} <br />
              <span className="font-semibold text-[#FFA500]">{product.price.toLocaleString()} ₴</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile swiper carousel */}
      <div className="sm:hidden">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1.5}
          centeredSlides
          grabCursor
        >
          {limitedProducts.map((product, index) => (
            <SwiperSlide key={product.id}>
              <Link
                href={`/product/${product.id}`}
                className="relative flex flex-col gap-3 group"
              >
                <div className="relative w-full h-[350px]">
                  {product.first_media?.type === "video" ? (
                    <VideoWithAutoplay
                      src={`/api/images/${product.first_media.url}`}
                      className="object-cover group-hover:brightness-90 transition duration-300 w-full h-full"
                    />
                  ) : (
                    <Image
                      className="object-cover group-hover:brightness-90 transition duration-300"
                      src={getProductImageSrc(
                        product.first_media,
                        "https://placehold.co/432x613"
                      )}
                      alt={product.name}
                      fill
                      sizes="85vw"
                      priority={index === 0} // Only first image gets priority on mobile
                      loading={index === 0 ? undefined : "lazy"}
                      quality={index === 0 ? 90 : 70} // First image high quality, others lower
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  )}
                </div>
                <div className="justify-center text-lg font-normal font-['Poppins'] capitalize leading-normal text-center">
                  {product.name} <br />
                  <span className="font-semibold text-[#FFA500]">{product.price.toLocaleString()} ₴</span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Smooth transition gradient to AboutUs section - positioned at bottom */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[1920px] h-24 md:h-32 lg:h-40 pointer-events-none z-20">
        <div className="h-full bg-gradient-to-b from-transparent via-white/90 to-white">
          {/* Wave transition element */}
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,200 Q300,100 600,140 T1200,140 L1200,200 L0,200 Z" fill="white" opacity="0.95" />
            <path d="M0,200 Q250,120 500,150 T1000,150 T1200,150 L1200,200 L0,200 Z" fill="white" opacity="0.9" />
            <path d="M0,200 Q350,110 700,145 T1200,145 L1200,200 L0,200 Z" fill="white" opacity="0.85" />
          </svg>
        </div>
      </div>
    </section>
  );
}
