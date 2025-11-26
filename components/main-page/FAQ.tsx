"use client";

import { useAppContext } from "@/lib/GeneralProvider";
import { useState } from "react";
import { BRAND } from "@/lib/brand";

export default function FAQ() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const { isDark } = useAppContext();

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <section
      id="payment-and-delivery"
      className={`scroll-mt-20 max-w-[1920px] w-full mx-auto ${
        isDark ? "bg-stone-900" : "bg-gradient-to-br from-[#FFF4E6] via-[#FFFBE6] to-[#F0FDFC]"
      } py-10 lg:py-20 -mt-12 md:-mt-16 lg:-mt-20 pt-12 md:pt-16 lg:pt-20 relative overflow-hidden pb-24 md:pb-32 lg:pb-40`}
    >
      <div className="flex flex-col lg:flex-row justify-between m-5 lg:m-10 gap-10">
        <div className="w-full lg:w-96 lg:h-72 relative">
          <div className="text-4xl lg:text-7xl font-medium font-['Montserrat'] leading-snug lg:leading-[74.69px]">
            Ви часто
            <br />
            запитуєте
          </div>
          <div className="mt-4 text-lg lg:text-2xl font-normal font-['Poppins'] leading-relaxed">
            Зібрали відповіді про легальні вейпи,
            <br />
            поставки та сертифікацію {BRAND.name}
          </div>
        </div>

        <div className="max-w-4xl w-full">
          {[
            {
              number: "01",
              title: `Оплата | ${BRAND.name}`,
              content:
                "Приймаємо банківські картки, рахунок-фактуру для компаній та еквайринг у шоурумі. Партнерські замовлення від 10 одиниць підтверджуємо 50% передоплатою.",
            },
            {
              number: "02",
              title: `Доставка | ${BRAND.name}`,
              content:
                "Відправляємо по Україні Новою Поштою або курʼєром з Wave Lab у день підтвердження замовлення. Для HoReCa та ритейлу доступна регулярна відвантажувальна сітка.",
            },
            {
              number: "03",
              title: `Сертифікація та безпека | ${BRAND.name}`,
              content:
                "Всі рідини та картриджі не містять ТГК і мають COA. Посилання на лабораторні звіти додаємо в особистому кабінеті партнера або за запитом.",
            },
            {
              number: "04",
              title: `Відправка та оновлення смаків | ${BRAND.name}`,
              content:
                "Лімітовані серії виходять щомісяця. Резерв можна оформити завчасно — ми бронюємо партію та надсилаємо тест-кити для команди продажів.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => toggleAccordion(index + 1)}
            >
              <div className="max-w-4xl flex flex-row justify-between items-start sm:items-center p-3 sm:p-5 gap-3 sm:gap-0 relative">
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FFE5CC] via-[#FFF8DC] to-[#E0F7F5]"></div>
                <div className="flex justify-center gap-10">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-normal font-['Arial'] leading-8 bg-gradient-to-b from-[#FFA500] via-[#FFD700] to-[#40E0D0] bg-clip-text text-transparent">
                    {item.number}
                  </div>
                  <div className="text-lg sm:text-xl lg:text-3xl font-normal font-['Arial'] leading-relaxed max-w-full sm:max-w-[765px]">
                    {item.title}
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-normal font-['Arial'] leading-8 text-[#FFA500] hover:text-[#FFD700] transition-colors duration-300">
                  {openAccordion === index + 1 ? "-" : "+"}
                </div>
              </div>

              {/* Accordion content with smooth transition */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openAccordion === index + 1 ? "max-h-[500px]" : "max-h-0"
                }`}
              >
                <div className="p-3 sm:p-5 text-base sm:text-lg lg:text-xl font-normal font-['Poppins'] leading-relaxed max-w-full sm:max-w-[608px]">
                  {item.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Smooth transition gradient to Reviews section - positioned at bottom */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[1920px] h-24 md:h-32 lg:h-40 pointer-events-none z-20">
        <div className={`h-full bg-gradient-to-b from-transparent ${
          isDark ? "via-stone-900/90 to-stone-900" : "via-[#FFF4E6]/90 to-[#FFF4E6]"
        }`}>
          {/* Wave transition element */}
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,200 Q300,100 600,140 T1200,140 L1200,200 L0,200 Z" fill={isDark ? "#1c1917" : "#FFF4E6"} opacity="0.95" />
            <path d="M0,200 Q250,120 500,150 T1000,150 T1200,150 L1200,200 L0,200 Z" fill={isDark ? "#1c1917" : "#FFF4E6"} opacity="0.9" />
            <path d="M0,200 Q350,110 700,145 T1200,145 L1200,200 L0,200 Z" fill={isDark ? "#1c1917" : "#FFF4E6"} opacity="0.85" />
          </svg>
        </div>
      </div>
    </section>
  );
}
