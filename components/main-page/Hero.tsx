"use client";

import SidebarMenu from "@/components/layout/SidebarMenu";
import { useAppContext } from "@/lib/GeneralProvider";
import { BRAND } from "@/lib/brand";
import Link from "next/link";

export default function Hero() {
  const { isSidebarOpen, setIsSidebarOpen } = useAppContext();

  return (
    <section className="relative">
      <div className="max-w-[1920px] mx-auto w-full h-screen sm:h-[720px] md:h-[860px] lg:h-[980px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFA500] via-[#FFD700] to-[#40E0D0]" />
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0 500 Q 300 420 600 500 T 1200 500"
              stroke="white"
              strokeWidth="40"
              fill="none"
            />
            <path
              d="M0 560 Q 300 480 600 560 T 1200 560"
              stroke="#FFE08A"
              strokeWidth="30"
              fill="none"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 lg:px-24 gap-8 text-white">
          <p className="uppercase tracking-[0.2em] text-xs sm:text-sm font-medium opacity-90">
            {BRAND.name}
          </p>
          <div className="space-y-5 max-w-4xl">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight">
              {BRAND.tagline}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl max-w-2xl font-light opacity-95">
              {BRAND.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/catalog"
              className="px-12 py-5 rounded-full bg-white text-black font-bold text-base sm:text-lg tracking-wide uppercase text-center hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Перейти до каталогу
            </Link>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="px-12 py-5 rounded-full border-2 border-white text-white font-bold text-base sm:text-lg tracking-wide uppercase hover:bg-white hover:text-black transition-all duration-300"
            >
              {BRAND.catalogCTA}
            </button>
          </div>
        </div>
      </div>
      
      {/* Smooth transition gradient to TopSale background - positioned after container */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[1920px] h-40 md:h-56 lg:h-72 pointer-events-none z-20">
        <div className="h-full bg-gradient-to-b from-transparent via-[#f3f4f6]/70 to-[#f3f4f6]">
          {/* Wave transition element */}
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,200 Q300,100 600,140 T1200,140 L1200,200 L0,200 Z" fill="#f3f4f6" />
            <path d="M0,200 Q250,120 500,150 T1000,150 T1200,150 L1200,200 L0,200 Z" fill="#f3f4f6" opacity="0.8" />
          </svg>
        </div>
      </div>

      <SidebarMenu
        isDark={false}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
    </section>
  );
}
