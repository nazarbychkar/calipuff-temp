"use client";

export default function ProductDisclaimer() {
  return (
    <div className="w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-y-2 border-amber-200 py-6 md:py-8">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-center">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl font-bold text-gray-900 font-['Montserrat']">
              18+
            </span>
            <span className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider font-['Poppins']">
              Продукція доступна лише для повнолітніх
            </span>
          </div>
          <div className="hidden md:block w-px h-8 bg-amber-300"></div>
          <p className="text-xs md:text-sm text-gray-800 leading-relaxed max-w-4xl font-['Poppins']">
            Уся продукція, представлена на нашому сайті (ароматичні девайси, змінні модулі, аромаконцентрати, товари з канабіноїдами), призначена виключно для сувенірних, декоративних або дослідницьких цілей. Продукція не призначена для вживання, куріння або інших способів використання, що можуть суперечити законодавству.
          </p>
        </div>
      </div>
    </div>
  );
}

