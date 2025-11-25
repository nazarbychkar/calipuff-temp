"use client";

import React from "react";
import Link from "next/link";
import { useAppContext } from "@/lib/GeneralProvider";
import { BRAND } from "@/lib/brand";

export default function Reviews() {
  const { isDark } = useAppContext();

  return (
    <section
      id="reviews"
      className={`scroll-mt-5 max-w-[1920px] w-full mx-auto relative ${
        isDark ? "bg-stone-900" : "bg-[#e3dfd7]"
      } px-6 py-12 md:py-20`}
    >
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
            className="underline italic hover:text-blue-600 transition-colors"
          >
            Instagram
          </Link>{" "}
          та Telegram-спільноті {BRAND.name}.
        </div>
      </div>
    </section>
  );
}
