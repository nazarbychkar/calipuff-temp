import { BRAND } from "@/lib/brand";
import Image from "next/image";
import { getImageUrl } from "@/lib/getFirstProductImage";

interface AboutUsClientProps {
  title: string;
  description: string;
  mission: Array<{ text: string; image?: string }>;
}

export default function AboutUsClient({
  title,
  description,
  mission,
}: AboutUsClientProps) {
  // Placeholder images for mission points - using brand colors (fallback)
  const defaultImages = [
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
          {title}
        </h2>
        <p className="max-w-4xl text-center text-base lg:text-2xl leading-relaxed font-['Poppins']">
          {description}
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 max-w-6xl">
        {mission.map((missionPoint, index) => {
          // Get image URL - use uploaded image or fallback to placeholder
          const imageUrl = missionPoint.image
            ? (missionPoint.image.startsWith('/') || missionPoint.image.startsWith('http'))
              ? missionPoint.image
              : getImageUrl(missionPoint.image)
            : defaultImages[index] || defaultImages[0];

          return (
            <article
              key={index}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md card-hover animate-fade-in transition-shadow duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative w-full h-48 lg:h-56 overflow-hidden">
                <Image
                  src={imageUrl}
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
                  {missionPoint.text}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="relative max-w-3xl text-center text-base lg:text-xl text-stone-500 leading-relaxed">
        {BRAND.style}
      </div>

      {/* Detailed Information Section */}
      <div className="relative w-full max-w-6xl mt-16 lg:mt-24 space-y-12 lg:space-y-16">
        {/* How Effect is Formed */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-10 shadow-sm">
          <h3 className="text-2xl lg:text-3xl font-semibold font-['Montserrat'] mb-6 text-stone-900">
            Як формується ефект у продуктах CaliPuff
          </h3>
          <div className="space-y-4 text-base lg:text-lg leading-relaxed font-['Poppins'] text-stone-700">
            <p>
              У продуктах CaliPuff ефект формується по-різному.
              У будь-якому випадку основну роль відіграють канабіноїди — саме вони визначають силу та тривалість ефекту.
            </p>
            <p>
              У деяких продуктах ефект може додатково змінюватися терпенами, якщо вони беруть участь у формуванні дії.
            </p>
          </div>
        </div>

        {/* Terpene Profile */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-10 shadow-sm">
          <h3 className="text-2xl lg:text-3xl font-semibold font-['Montserrat'] mb-6 text-stone-900">
            Терпеновий профіль: Indica, Hybrid, Sativa
          </h3>
          <div className="space-y-4 text-base lg:text-lg leading-relaxed font-['Poppins'] text-stone-700">
            <p>
              <strong className="text-stone-900">Indica / Hybrid / Sativa</strong> — це типи ефекту, які залежать від терпенового профілю.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                <h4 className="font-semibold text-lg mb-2 text-stone-900">Indica</h4>
                <p className="text-sm text-stone-600">заспокійливий ефект: розслаблення тіла, комфорт, відчуття спокою.</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                <h4 className="font-semibold text-lg mb-2 text-stone-900">Hybrid</h4>
                <p className="text-sm text-stone-600">збалансований ефект: поєднання розслаблення та ясності, підходить для дня й вечора.</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                <h4 className="font-semibold text-lg mb-2 text-stone-900">Sativa</h4>
                <p className="text-sm text-stone-600">активний ефект: бадьорість, концентрація, легке піднесення настрою.</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-stone-600 italic">
              Ці характеристики проявляються лише тоді, коли терпени беруть участь у формуванні ефекту.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-10 shadow-sm">
          <h3 className="text-2xl lg:text-3xl font-semibold font-['Montserrat'] mb-6 text-stone-900">
            Як це працює
          </h3>
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-lg mb-3 text-stone-900">Канабіноїд + терпени</h4>
              <ul className="space-y-2 text-base leading-relaxed font-['Poppins'] text-stone-700">
                <li>• Канабіноїд формує основний ефект.</li>
                <li>• Терпени доповнюють його, задаючи характер дії (Indica, Hybrid або Sativa).</li>
              </ul>
            </div>
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <h4 className="font-semibold text-lg mb-3 text-stone-900">Лише канабіноїд</h4>
              <ul className="space-y-2 text-base leading-relaxed font-['Poppins'] text-stone-700">
                <li>• Ефект формується виключно канабіноїдом.</li>
                <li>• Терпени (якщо присутні) відповідають тільки за смак та аромат.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Examples */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-10 shadow-sm">
          <h3 className="text-2xl lg:text-3xl font-semibold font-['Montserrat'] mb-6 text-stone-900">
            Приклади продуктів
          </h3>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-200">
              <h4 className="font-semibold text-xl mb-4 text-stone-900">PPX</h4>
              <div className="space-y-2 text-base leading-relaxed font-['Poppins'] text-stone-700">
                <p>Ефект формується поєднанням канабіноїдів і живих терпенів (Live Resin).</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Канабіноїди</strong> — сила.</li>
                  <li>• <strong>Терпени</strong> — напрям ефекту (Indica / Hybrid / Sativa).</li>
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-6 border border-teal-200">
              <h4 className="font-semibold text-xl mb-4 text-stone-900">HCT</h4>
              <div className="space-y-3 text-base leading-relaxed font-['Poppins'] text-stone-700">
                <p>Ефект формується самим канабіноїдом HCT.</p>
                <p>Інтенсивність ефекту напряму залежить від концентрації HCT у формулі.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <div className="bg-white rounded p-3 border border-stone-200">
                    <p className="font-semibold text-stone-900">5% HCT</p>
                    <p className="text-sm text-stone-600">легкий ефект</p>
                  </div>
                  <div className="bg-white rounded p-3 border border-stone-200">
                    <p className="font-semibold text-stone-900">10% HCT</p>
                    <p className="text-sm text-stone-600">помірний ефект</p>
                  </div>
                  <div className="bg-white rounded p-3 border border-stone-200">
                    <p className="font-semibold text-stone-900">15% HCT</p>
                    <p className="text-sm text-stone-600">сильний ефект</p>
                  </div>
                  <div className="bg-white rounded p-3 border border-stone-200">
                    <p className="font-semibold text-stone-900">20% HCT</p>
                    <p className="text-sm text-stone-600">дуже інтенсивний ефект</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-stone-600 italic">
                  Чим вищий відсоток HCT — тим сильніший ефект.
                  Терпени використовуються лише для смаку та аромату і не впливають на характер ефекту.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Effect Types Explanation */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-10 shadow-sm">
          <h3 className="text-2xl lg:text-3xl font-semibold font-['Montserrat'] mb-6 text-stone-900">
            Пояснення типів ефектів
          </h3>
          <div className="space-y-4 text-base lg:text-lg leading-relaxed font-['Poppins'] text-stone-700">
            <p>
              <strong className="text-stone-900">Hybrid / Indica / Sativa</strong> — це різні типи ефектів, які залежать від терпенового профілю, а не лише від назви сорту.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                <h4 className="font-semibold text-lg mb-2 text-stone-900">Hybrid</h4>
                <p className="text-sm text-stone-600">збалансований ефект: поєднання розслаблення та ясності, підходить для дня й вечора.</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-200">
                <h4 className="font-semibold text-lg mb-2 text-stone-900">Indica</h4>
                <p className="text-sm text-stone-600">більш заспокійливий ефект: розслаблення тіла, комфорт, ідеально для відпочинку.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                <h4 className="font-semibold text-lg mb-2 text-stone-900">Sativa</h4>
                <p className="text-sm text-stone-600">більш активний ефект: бадьорість, концентрація, легке піднесення настрою.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-10 shadow-sm">
          <h3 className="text-2xl lg:text-3xl font-semibold font-['Montserrat'] mb-6 text-stone-900">
            THC, HHC та канабіноїди в Україні: що дозволено у 2025 році
          </h3>
          <div className="space-y-4 text-base lg:text-lg leading-relaxed font-['Poppins'] text-stone-700">
            <p>
              В Україні тема канабіноїдів викликає багато запитань, особливо щодо THC та HHC.
            </p>
            <div className="bg-red-50 rounded-lg p-5 border border-red-200 mt-4">
              <ul className="space-y-2">
                <li>• <strong>Δ9-THC</strong> є контрольованою психотропною речовиною та заборонений до вільного обігу, за винятком медичного або ліцензованого використання.</li>
                <li>• Для промислових конопель допускається вміст THC до приблизно 0,2–0,3 %.</li>
                <li>• <strong>HHC</strong> та його похідні з 2024 року включені до переліку заборонених психотропних речовин в Україні.</li>
              </ul>
            </div>
            <p className="mt-4 font-semibold text-stone-900">
              Висновок: продукти без THC, HHC та їх похідних, підтверджені лабораторно, не підпадають під наркотичне регулювання.
            </p>
          </div>
        </div>

        {/* Transparency */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-10 shadow-sm">
          <h3 className="text-2xl lg:text-3xl font-semibold font-['Montserrat'] mb-6 text-stone-900">
            Прозорість складу — новий стандарт у ЄС та Україні
          </h3>
          <div className="space-y-4 text-base lg:text-lg leading-relaxed font-['Poppins'] text-stone-700">
            <p>
              Ринок канабіноїдних продуктів швидко змінюється.
            </p>
            <p>
              Прозоро заявлений склад, сертифікати аналізу та відповідність законам стають новим стандартом.
            </p>
            <p>
              Європейські країни та Україна рухаються до чіткого регулювання та зменшення сірих зон.
            </p>
            <p className="font-semibold text-stone-900 mt-4">
              Продукти з прозорим складом — це відповідальність перед споживачем.
            </p>
          </div>
        </div>

        {/* Laboratory Tests */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6 lg:p-10 shadow-sm">
          <h3 className="text-2xl lg:text-3xl font-semibold font-['Montserrat'] mb-6 text-stone-900">
            Чому лабораторні тести ISO/IEC 17025 мають значення
          </h3>
          <div className="space-y-4 text-base lg:text-lg leading-relaxed font-['Poppins'] text-stone-700">
            <p>
              У сфері канабіноїдів ключову роль відіграє лабораторна перевірка.
            </p>
            <div className="bg-white rounded-lg p-5 border border-blue-200 mt-4">
              <ul className="space-y-3">
                <li>• <strong>ISO/IEC 17025</strong> — це міжнародний стандарт, який підтверджує компетентність лабораторії та точність методів.</li>
                <li>• <strong>COA (Certificate of Analysis)</strong> дозволяє перевірити склад продукту, відсутність THC, HHC та інших заборонених речовин.</li>
                <li>• Прозорість тестування — основа довіри споживачів та партнерів.</li>
              </ul>
            </div>
          </div>
        </div>
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

