"use client";

import SidebarMenu from "@/components/layout/SidebarMenu";
import { useAppContext } from "@/lib/GeneralProvider";
import { BRAND } from "@/lib/brand";
import Link from "next/link";

const featurePills = [
  "0% ТГК",
  "COA сертифікація",
  "California Wave & Sun",
];

export default function Hero() {
  const { isDark, isSidebarOpen, setIsSidebarOpen } = useAppContext();

  return (
    <section>
      <div className="max-w-[1920px] mx-auto w-full h-screen sm:h-[720px] md:h-[860px] lg:h-[980px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFA500] via-[#FFD700] to-[#40E0D0]" />
        <div className="absolute inset-x-0 bottom-0 h-44 md:h-60 bg-white/30 mix-blend-soft-light blur-2xl" />
        <div className="absolute -bottom-20 -left-16 w-80 h-80 bg-white/15 blur-3xl rounded-full" />
        <div className="absolute -top-20 -right-10 w-72 h-72 bg-[#40E0D0]/50 blur-3xl rounded-full" />
        <div className="absolute inset-0 opacity-15">
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

        <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 lg:px-24 gap-10 text-white">
          <p className="uppercase tracking-[0.3em] text-sm sm:text-base font-semibold">
            {BRAND.name} — Бізнес-план «Україна»
          </p>
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold leading-tight drop-shadow">
              {BRAND.tagline}
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl max-w-3xl">
              {BRAND.description} {BRAND.compliance}.
            </p>
            <p className="text-base sm:text-lg max-w-2xl">
              {BRAND.style}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {featurePills.map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full border border-white/40 text-sm sm:text-base bg-white/10 backdrop-blur"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="px-8 py-4 rounded-full border border-white/70 text-white font-semibold tracking-wide uppercase hover:bg-white hover:text-black transition-all duration-300"
            >
              {BRAND.catalogCTA}
            </button>

            <Link
              href="/catalog"
              className="px-8 py-4 rounded-full bg-black/70 text-white font-semibold tracking-wide uppercase text-center hover:bg-black transition-all duration-300"
            >
              Дивитися колекцію
            </Link>
          </div>
        </div>
      </div>

      <SidebarMenu
        isDark={isDark}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
    </section>
  );
}
