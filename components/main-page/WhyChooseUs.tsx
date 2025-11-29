"use client";

import { BRAND } from "@/lib/brand";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const WHY_US = [
  {
    title: "Легальні вейпи без ТГК",
    text: "Кожна формула проходить сертифікацію COA в Європі, аби ви відчували лише смак і свободу.",
    accent: BRAND.palette.sunset,
  },
  {
    title: "Wave Lab у Києві",
    text: "Тестуємо нові смаки в живому форматі — тут народжуються сонячні лімітовані серії.",
    accent: BRAND.palette.dune,
  },
  {
    title: "Тонкі смаки з Каліфорнії",
    text: "Використовуємо мікс фруктів, трав та спецій, що нагадує океанський бриз і теплий вітер.",
    accent: BRAND.palette.tide,
  },
  {
    title: "Відповідальність перед ринком",
    text: "Транспарентний склад, онлайн-доступ до лабораторних звітів і гаряча підтримка для партнерів.",
    accent: "#ffffff",
  },
  {
    title: "Гнучкі бізнес-моделі",
    text: "Франшиза, pop-up бари, корпоративні подарунки — обирайте формат співпраці та масштабуйтеся.",
    accent: "#111111",
  },
];

export default function WhyChooseUs() {

  return (
    <section
      className="max-w-[1920px] mx-auto w-full relative bg-[#fef9f2] overflow-hidden py-16 -mt-12 md:-mt-16 lg:-mt-20 pt-12 md:pt-16 lg:pt-20 pb-24 md:pb-32 lg:pb-40"
    >
      <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center px-6 md:px-12">
        <div className="text-start lg:text-center text-3xl lg:text-5xl font-semibold font-['Montserrat'] uppercase">
          Чому обирають {BRAND.name}
        </div>
        <div className="opacity-80 lg:text-xl font-['Poppins'] leading-normal max-w-xl mt-6 lg:mt-0">
          Каліфорнійська хвиля свободи, контроль якості українського виробництва та сервіс, який говорить мовою бізнесу.
        </div>
      </div>

      {/* Mobile grid layout */}
      <div className="grid grid-cols-1 gap-6 md:gap-10 px-6 md:px-12 mt-10 lg:hidden">
        {WHY_US.map((item, i) => (
          <div
            key={item.title}
            className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md bg-white transition-shadow duration-300"
          >
            <div
              className="h-40 w-full relative"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${item.accent} 0%, transparent 60%), linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))`,
              }}
            >
              <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                <path
                  d="M0 120 Q 80 60 160 120 T 320 120"
                  stroke="#ffffff"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <span className="absolute top-4 right-6 text-4xl font-bold text-white/80">
                {`0${i + 1}`}
              </span>
            </div>
            <div className="p-6 lg:p-8 space-y-4">
              <div className="text-xl lg:text-2xl font-semibold font-['Montserrat']">
                {item.title}
              </div>
              <p className="text-base lg:text-xl font-['Poppins'] text-stone-600">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Swiper layout */}
      <div className="hidden lg:block mt-10 px-6 md:px-12">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={2.5}
          navigation
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          grabCursor={true}
          breakpoints={{
            1024: {
              slidesPerView: 2.5,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1536: {
              slidesPerView: 3.5,
              spaceBetween: 36,
            },
          }}
          className="!pb-12"
        >
          {WHY_US.map((item, i) => (
            <SwiperSlide key={item.title}>
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg bg-white h-full transition-all duration-300 ease-out hover:scale-[1.02] group">
                <div
                  className="h-48 w-full relative transition-[height] duration-500 ease-out group-hover:h-52"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${item.accent} 0%, transparent 60%), linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))`,
                    transition: 'height 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <svg className="absolute inset-0 w-full h-full opacity-30 transition-opacity duration-500 ease-out group-hover:opacity-40" preserveAspectRatio="none">
                    <path
                      d="M0 120 Q 80 60 160 120 T 320 120"
                      stroke="#ffffff"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                  <span className="absolute top-4 right-6 text-4xl font-bold text-white/80 transition-[color,transform] duration-500 ease-out group-hover:text-white group-hover:scale-110">
                    {`0${i + 1}`}
                  </span>
                </div>
                <div className="p-6 lg:p-8 space-y-4">
                  <div className="text-xl lg:text-2xl font-semibold font-['Montserrat'] transition-colors duration-500 ease-out group-hover:text-[#FFA500]">
                    {item.title}
                  </div>
                  <p className="text-base lg:text-xl font-['Poppins'] text-stone-600 leading-relaxed transition-colors duration-500 ease-out group-hover:text-stone-700">
                    {item.text}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Smooth transition gradient to SocialMedia section - positioned at bottom */}
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

