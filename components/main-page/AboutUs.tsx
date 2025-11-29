import { BRAND } from "@/lib/brand";
import Image from "next/image";

export default function AboutUs() {
  // Placeholder images for mission points - using brand colors
  const missionImages = [
    "https://placehold.co/400x300/FFA500/FFFFFF?text=Mission+01",
    "https://placehold.co/400x300/FFD700/FFFFFF?text=Mission+02",
    "https://placehold.co/400x300/40E0D0/FFFFFF?text=Mission+03",
  ];
  return (
    <section
      id="about"
      className="scroll-mt-20 max-w-[1920px] mx-auto w-full px-6 py-16 lg:py-24 relative overflow-hidden flex flex-col items-center gap-10 -mt-12 md:-mt-16 lg:-mt-20 pt-12 md:pt-16 lg:pt-20 bg-white pb-24 md:pb-32 lg:pb-40"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-transparent pointer-events-none opacity-80" />
      <div className="relative flex flex-col items-center gap-6">
        <p className="text-[#FFA500] text-sm tracking-[0.4em] uppercase font-semibold">
          {BRAND.tagline}
        </p>
        <h2 className="text-center text-3xl lg:text-5xl font-semibold font-['Montserrat'] uppercase" itemProp="name">
          Про бренд {BRAND.name}
        </h2>
        <p className="max-w-4xl text-center text-base lg:text-2xl leading-relaxed font-['Poppins']">
          {BRAND.shortDescription} Ми народилися на європейському ринку, щоб перенести
          настрій узбережжя Каліфорнії в легальний та безпечний вейп-досвід з акцентом на відповідальне споживання.
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 max-w-6xl">
        {BRAND.mission.map((missionPoint, index) => (
          <article
            key={missionPoint}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md card-hover animate-fade-in transition-shadow duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative w-full h-48 lg:h-56 overflow-hidden">
              <Image
                src={missionImages[index] || missionImages[0]}
                alt={`Mission ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-6 lg:p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-stone-500 mb-3">
                0{index + 1}
              </p>
              <p className="text-base lg:text-xl leading-relaxed font-['Poppins']">
                {missionPoint}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="relative max-w-3xl text-center text-base lg:text-xl text-stone-500 leading-relaxed">
        {BRAND.style}
      </div>
      
      {/* Smooth transition gradient to WhyChooseUs section - positioned at bottom */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[1920px] h-24 md:h-32 lg:h-40 pointer-events-none z-20">
        <div className="h-full bg-gradient-to-b from-transparent via-[#fef9f2]/90 to-[#fef9f2]">
          {/* Wave transition element */}
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,200 Q300,100 600,140 T1200,140 L1200,200 L0,200 Z" fill="#fef9f2" opacity="0.95" />
            <path d="M0,200 Q250,120 500,150 T1000,150 T1200,150 L1200,200 L0,200 Z" fill="#fef9f2" opacity="0.9" />
            <path d="M0,200 Q350,110 700,145 T1200,145 L1200,200 L0,200 Z" fill="#fef9f2" opacity="0.85" />
          </svg>
        </div>
      </div>
    </section>
  );
}
