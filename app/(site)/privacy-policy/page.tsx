import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Політика для сайту | Calishops",
  description: "Політика повернення, доставки та оферта для сайту Calishops",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <Link
            href="/"
            className="inline-block mb-8 text-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
          >
            ← На головну
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Calishops — Політика для сайту
          </h1>
          <p className="text-lg opacity-70 max-w-2xl">
            Актуальні умови повернення, доставки та оферта для клієнтів Calishops.
          </p>
          <div className="w-20 h-1 bg-black dark:bg-white mt-6"></div>
        </div>

        {/* Content */}
        <div className="space-y-12 text-base leading-relaxed">
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold">1. Політика повернення</h2>
            <div className="space-y-4">
              <div className="p-6 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                <p className="text-lg font-semibold mb-2">1. Термін повернення</p>
                <p className="opacity-80">
                  Клієнт може повернути не відкритий товар протягом 14 днів з моменту отримання.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-lg font-semibold">2. Стан товару</p>
                <ul className="space-y-2 opacity-80">
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Товар повинен бути не відкритий, неношений, у первинній упаковці і без видимих слідів використання.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Заводський брак / дефект: навіть якщо товар відкритий, клієнт може повернути його або обміняти на новий, якщо надасть фото або відео дефекту.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-lg font-semibold">3. Процедура повернення / обміну</p>
                <ul className="space-y-2 opacity-80">
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Напишіть на email: <a className="underline" href="mailto:support@calishops.com">support@calishops.com</a> або через форму зворотного зв’язку.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Для заводського браку обов’язково прикріпіть фото/відео.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Після перевірки дефектного товару: на вибір клієнта повертаються гроші або відправляється інший товар того ж типу.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Для звичайного повернення не відкритого товару — стандартна процедура: відправка на склад, перевірка, повернення коштів протягом 3 робочих днів.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-lg font-semibold">4. Вартість доставки при поверненні</p>
                <ul className="space-y-2 opacity-80">
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>У разі заводського браку – доставка за рахунок Calishops.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>У разі звичайного повернення – доставка оплачується покупцем, якщо інше не погоджено.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-lg font-semibold">5. Виключення</p>
                <ul className="space-y-2 opacity-80">
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Товари, які були відкриті або використані, не підлягають поверненню, крім випадку заводського браку.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Інформація про товари, які не можна повернути, зазначена на сторінці кожного товару окремо.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold">2. Політика доставки</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-black/10 dark:border-white/10">
                <p className="text-lg font-semibold mb-2">1. Методи доставки</p>
                <ul className="space-y-1 opacity-80">
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Нова Пошта</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Самовивіз за попередньою домовленістю</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-black/10 dark:border-white/10">
                <p className="text-lg font-semibold mb-2">2. Терміни доставки</p>
                <p className="opacity-80">Доставка Новою Поштою по Україні: 1–3 робочих дні після підтвердження замовлення.</p>
              </div>

              <div className="p-6 rounded-xl border border-black/10 dark:border-white/10">
                <p className="text-lg font-semibold mb-2">3. Вартість доставки</p>
                <ul className="space-y-1 opacity-80">
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Оплата при отриманні (накладений платіж).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Можливе безкоштовне доставлення при замовленні від певної суми (наприклад, 500 грн).</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-black/10 dark:border-white/10">
                <p className="text-lg font-semibold mb-2">4. Особливі умови</p>
                <p className="opacity-80">
                  Якщо покупець відмовився отримувати замовлення або не забрав його, товар повертається на склад, а повторна доставка оплачується покупцем.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold">3. Оферта / Terms of Service</h2>
            <div className="space-y-4">
              <div className="p-6 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                <p className="text-lg font-semibold mb-2">1. Прийом замовлень</p>
                <p className="opacity-80">Замовлення здійснюються через сайт calishops.com.</p>
              </div>

              <div className="p-6 rounded-xl border border-black/10 dark:border-white/10">
                <p className="text-lg font-semibold mb-2">2. Оплата</p>
                <ul className="space-y-2 opacity-80">
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Банківськими картками Visa та MasterCard через платіжний шлюз, який буде підключений.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Готівкою при отриманні через Нову Пошту (накладений платіж).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Картою при отриманні через термінал кур’єра Нової Пошти (якщо доступно).</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-black/10 dark:border-white/10">
                <p className="text-lg font-semibold mb-2">3. Вік покупця</p>
                <p className="opacity-80">Користувач повинен бути повнолітнім (18+) для оформлення замовлення.</p>
              </div>

              <div className="p-6 rounded-xl border border-black/10 dark:border-white/10">
                <p className="text-lg font-semibold mb-2">4. Відповідальність</p>
                <ul className="space-y-2 opacity-80">
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Calishops несе відповідальність за доставку товару у відповідності з політикою доставки та повернення.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Клієнт несе відповідальність за правильність контактних даних і адресу доставки.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                <p className="text-lg font-semibold mb-2">5. Конфіденційність</p>
                <p className="opacity-80">Персональні дані клієнтів обробляються відповідно до Закону України «Про захист персональних даних».</p>
              </div>
            </div>
          </section>

          <section className="mt-16 pt-8 border-t border-black/10 dark:border-white/10">
            <p className="text-sm opacity-50">Дата останнього оновлення: 08 грудня 2025 року</p>
          </section>
        </div>
      </div>
    </div>
  );
}
