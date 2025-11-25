"use client";

import { useAppContext } from "@/lib/GeneralProvider";
import { BRAND } from "@/lib/brand";

const WHY_US = [
  {
    title: "Легальні вейпи без ТГК",
    text: "Кожна формула проходить сертифікацію COA в Європі, аби ви відчували лише смак і свободу.",
    accent: BRAND.palette.sunset,
  },
  {
    title: "Wave Lab у Києві",
    text: "Тестуємо нові смаки в живому форматі — тут народжуються сонячні лімітовані серії.",
    accent: BRAND.palette.dune,
  },
  {
    title: "Тонкі смаки з Каліфорнії",
    text: "Використовуємо мікс фруктів, трав та спецій, що нагадує океанський бриз і теплий вітер.",
    accent: BRAND.palette.tide,
  },
  {
    title: "Відповідальність перед ринком",
    text: "Транспарентний склад, онлайн-доступ до лабораторних звітів і гаряча підтримка для партнерів.",
    accent: "#ffffff",
  },
  {
    title: "Гнучкі бізнес-моделі",
    text: "Франшиза, pop-up бари, корпоративні подарунки — обирайте формат співпраці та масштабуйтеся.",
    accent: "#111111",
  },
];

export default function WhyChooseUs() {
  const { isDark } = useAppContext();

  return (
    <section
      className={`max-w-[1920px] mx-auto w-full relative ${
        isDark ? "bg-[#050505]" : "bg-[#fef9f2]"
      } overflow-hidden py-16`}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center px-6 md:px-12">
        <div className="text-start lg:text-center text-3xl lg:text-5xl font-semibold font-['Montserrat'] uppercase">
          Чому обирають {BRAND.name}
        </div>
        <div className="opacity-80 lg:text-xl font-['Poppins'] leading-normal max-w-xl mt-6 lg:mt-0">
          Каліфорнійська хвиля свободи, контроль якості українського виробництва та сервіс, який говорить мовою бізнесу.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 px-6 md:px-12 mt-10">
        {WHY_US.map((item, i) => (
          <div
            key={item.title}
            className="border border-white/10 rounded-3xl overflow-hidden shadow-lg bg-white/80 backdrop-blur"
          >
            <div
              className="h-40 w-full relative"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${item.accent} 0%, transparent 60%), linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))`,
              }}
            >
              <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                <path
                  d="M0 120 Q 80 60 160 120 T 320 120"
                  stroke="#ffffff"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <span className="absolute top-4 right-6 text-4xl font-bold text-white/80">
                {`0${i + 1}`}
              </span>
            </div>
            <div className="p-6 lg:p-8 space-y-4">
              <div className="text-xl lg:text-2xl font-semibold font-['Montserrat']">
                {item.title}
              </div>
              <p className="text-base lg:text-xl font-['Poppins'] text-stone-600">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

