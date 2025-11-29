"use client";

import React from "react";
import Link from "next/link";
import StructuredData from "@/components/shared/StructuredData";
import { BRAND } from "@/lib/brand";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const PLACEHOLDER_REVIEWS = [
  {
    id: 1,
    name: "Олександр К.",
    text: "Найкращі вейпи, які я коли-небудь пробував! Смаки справді каліфорнійські, а якість на висоті. Рекомендую всім!",
    rating: 5,
  },
  {
    id: 2,
    name: "Марія В.",
    text: "Чудовий сервіс та швидка доставка. Лімітовані серії завжди унікальні. Дякую за таку якість!",
    rating: 5,
  },
  {
    id: 3,
    name: "Дмитро С.",
    text: "Як партнер, дуже задоволений співпрацею. Професійний підхід та постійна підтримка. Відмінний бізнес!",
    rating: 5,
  },
  {
    id: 4,
    name: "Анна П.",
    text: "Смаки просто неймовірні! Особливо подобаються солодкі хвилі. COA сертифікація дає впевненість у якості.",
    rating: 5,
  },
  {
    id: 5,
    name: "Володимир М.",
    text: "Wave Lab у Києві - це щось особливе! Тестування нових смаків завжди захоплююче. Обов'язково повернуся!",
    rating: 5,
  },
];

export default function Reviews() {

  return (
    <section
      id="reviews"
      className="scroll-mt-5 max-w-[1920px] w-full mx-auto relative bg-gradient-to-br from-[#FFF4E6] via-[#FFFBE6] to-[#F0FDFC] px-6 py-12 md:py-20 overflow-hidden -mt-12 md:-mt-16 lg:-mt-20 pt-12 md:pt-16 lg:pt-20 pb-40 md:pb-56 lg:pb-72"
    >
      <StructuredData type="reviews" />
      {/* Content section */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8">
        <div className="text-4xl lg:text-7xl font-medium font-['Montserrat'] lg:leading-[74.69px]">
          Враження
          <br />
          наших клієнтів
        </div>

        <div className="text-base lg:text-2xl font-normal font-['Poppins'] leading-relaxed">
          Більше історій з Wave Lab шукайте у{" "}
          <Link
            href={BRAND.socials.instagram}
            className="underline italic text-[#FFA500] hover:text-[#FFD700] transition-colors duration-300"
          >
            Instagram
          </Link>{" "}
          та Telegram-спільноті {BRAND.name}.
        </div>
      </div>

      {/* Reviews Slider */}
      <div className="mt-12 lg:mt-16">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          grabCursor={true}
          breakpoints={{
            640: {
              slidesPerView: 1.5,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 2.5,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 36,
            },
          }}
          className="!pb-12"
        >
          {PLACEHOLDER_REVIEWS.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm h-full flex flex-col gap-4 transition-all duration-300 hover:shadow-md hover:border-[#FFA500] group">
                <div className="flex items-center gap-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-[#FFD700] text-xl">★</span>
                  ))}
                </div>
                <p className="text-base lg:text-lg font-normal font-['Poppins'] leading-relaxed text-stone-700 flex-grow">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-stone-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFA500] via-[#FFD700] to-[#40E0D0] flex items-center justify-center text-white font-semibold font-['Montserrat']">
                    {review.name.charAt(0)}
                  </div>
                  <div className="font-semibold font-['Montserrat'] text-stone-800">
                    {review.name}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Smooth transition gradient to Footer - positioned at bottom (same as Hero) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[1920px] h-40 md:h-56 lg:h-72 pointer-events-none z-20">
        <div className="h-full bg-gradient-to-b from-transparent via-[#f3f4f6]/70 to-[#f3f4f6]">
          {/* Wave transition element */}
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,200 Q300,100 600,140 T1200,140 L1200,200 L0,200 Z" fill="#f3f4f6" />
            <path d="M0,200 Q250,120 500,150 T1000,150 T1200,150 L1200,200 L0,200 Z" fill="#f3f4f6" opacity="0.8" />
          </svg>
        </div>
      </div>
    </section>
  );
}
