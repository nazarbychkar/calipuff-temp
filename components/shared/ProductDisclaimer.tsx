"use client";

export default function ProductDisclaimer() {
  return (
    <div className="w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-y-2 border-amber-200 py-6 md:py-8">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 space-y-6">
        {/* 18+ Section */}
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

        {/* Transparency & Certification Section */}
        <div className="border-t border-amber-300 pt-6 space-y-4">
          <div className="text-center space-y-3">
            <h3 className="text-base md:text-lg font-bold text-gray-900 font-['Montserrat'] uppercase tracking-wide">
              Прозорість та сертифікація
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-sm md:text-base text-gray-800 leading-relaxed font-['Poppins']">
              <div className="flex-1 max-w-2xl space-y-2">
                <p className="font-semibold text-gray-900">
                  Прозорість психоактивного вейпу:
                </p>
                <p>
                  Не містить Δ⁹‑THC, HHC, HHCP або інших прямо зазначених канабіноїдів; також відповідає нашій логіці white paper та внутрішньому юридичному аналізу.
                </p>
              </div>
              <div className="hidden md:block w-px h-16 bg-amber-300"></div>
              <div className="flex-1 max-w-2xl space-y-2">
                <p className="font-semibold text-gray-900">
                  Сертифіковані продукти:
                </p>
                <p>
                  Без THC та HHC. Лабораторні тести ISO/IEC 17025, COA. Відповідність нормам ЄС та України.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

