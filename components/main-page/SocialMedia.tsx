"use client";

import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/brand";

export default function SocialMedia() {

  return (
    // h-[977px]
    <section
      id="contacts"
      className="scroll-mt-30 max-w-[1920px] mx-auto w-full relative overflow-hidden lg:my-20 -mt-12 md:-mt-16 lg:-mt-20 pt-12 md:pt-16 lg:pt-20 bg-white pb-24 md:pb-32 lg:pb-40"
    >
      <div className="flex flex-col-reverse lg:flex-row justify-center items-center px-6 lg:px-12 gap-6 lg:gap-8">
        {/* Left: Social media image */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-center">
          <Image
            className="w-64 h-auto sm:w-80 lg:w-full max-w-md rounded-3xl max-h-[calc(100vh-20px)]"
            src="https://placehold.co/400x600/FFA500/FFFFFF?text=Social+Media"
            alt="social media"
            width={400}
            height={600}
          />
        </div>

        {/* Right: Text content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-10 m-8 lg:m-0">
          <div className="flex flex-col">
            <span className="text-stone-500 text-5xl lg:text-8xl font-normal font-['Inter']">
              {BRAND.tagline}
            </span>
            <span className="text-5xl lg:text-8xl font-normal font-['Inter']">
              Мережа California Wave
            </span>
          </div>

          <div className="border-b lg:border-0 lg:w-[465px] justify-center text-lg lg:text-3xl font-normal font-['Poppins'] leading-9">
            Stay tuned: нові хвилі смаку презентуємо спочатку в соцмережах і Telegram-каналі партнерів.
          </div>

          <div className="flex justify-start gap-10 lg:justify-between items-center w-full lg:w-115">
            <Link
              href={BRAND.socials.tiktok}
              className="w-60 h-12 md:w-80 md:h-16 text-center flex items-center bg-stone-900 text-white justify-center text-base md:text-2xl font-normal font-['Inter'] uppercase leading-none tracking-tight"
            >
              МИ В TIKTOK
            </Link>
            <Image
              width={39}
              height={39}
              className="w-11 h-11 md:w-13 md:h-13"
              src="/images/light-theme/tiktok.svg"
              alt={"tiktok icon"}
            />
          </div>

          <div className="flex justify-start gap-10 lg:justify-between items-center w-full lg:w-115 mt-4 md:mt-0">
            <Link
              href={BRAND.socials.instagram}
              className="w-60 h-12 md:w-80 md:h-16 text-center flex items-center bg-stone-900 text-white justify-center text-base md:text-2xl font-normal font-['Inter'] uppercase leading-none tracking-tight"
            >
              МИ В ІНСТАГРАМ
            </Link>
            <Image
              width={39}
              height={39}
              className="w-8 h-8 md:w-10 md:h-10"
              src="/images/light-theme/instagram.svg"
              alt={"instagram icon"}
            />
          </div>
          <Link
            href={BRAND.socials.telegram}
            className="text-base lg:text-xl underline decoration-dotted hover:opacity-80 transition-opacity"
          >
            Telegram-спільнота для партнерів
          </Link>
        </div>
      </div>
      
      {/* Smooth transition gradient to LimitedEdition section - positioned at bottom */}
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
