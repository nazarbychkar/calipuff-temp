"use client";

import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="relative w-full max-w-[1920px] mx-auto overflow-hidden">
      <div className="relative w-full h-auto">
        <Image
          src="/images/IMAGE 2025-12-13 20:34:20.jpg"
          alt="CALIPUFF - Каліфорнійська хвиля свободи"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
      </div>
    </section>
  );
}

