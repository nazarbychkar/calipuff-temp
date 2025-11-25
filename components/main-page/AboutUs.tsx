import { BRAND } from "@/lib/brand";

export default function AboutUs() {
  return (
    <section
      id="about"
      className="scroll-mt-20 max-w-[1920px] mx-auto w-full px-6 py-16 lg:py-24 relative overflow-hidden flex flex-col items-center gap-10"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-transparent pointer-events-none opacity-80" />
      <div className="relative flex flex-col items-center gap-6">
        <p className="text-[#FFA500] text-sm tracking-[0.4em] uppercase font-semibold">
          {BRAND.tagline}
        </p>
        <h2 className="text-center text-3xl lg:text-5xl font-semibold font-['Montserrat'] uppercase">
          Про бренд {BRAND.name}
        </h2>
        <p className="max-w-4xl text-center text-base lg:text-2xl leading-relaxed font-['Poppins']">
          {BRAND.shortDescription} Ми народилися на українському ринку, щоб перенести
          настрій узбережжя Каліфорнії в легальний та безпечний вейп-досвід з акцентом на відповідальне споживання.
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 max-w-6xl">
        {BRAND.mission.map((missionPoint, index) => (
          <div
            key={missionPoint}
            className="bg-white/80 backdrop-blur rounded-3xl border border-black/5 p-6 lg:p-8 shadow-md"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-stone-500 mb-3">
              0{index + 1}
            </p>
            <p className="text-base lg:text-xl leading-relaxed font-['Poppins']">
              {missionPoint}
            </p>
          </div>
        ))}
      </div>

      <div className="relative max-w-3xl text-center text-base lg:text-xl text-stone-500 leading-relaxed">
        {BRAND.style}
      </div>
    </section>
  );
}
