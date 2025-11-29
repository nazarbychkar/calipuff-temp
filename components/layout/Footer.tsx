"use client";

import { Montserrat, Poppins } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/brand";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins" });

export default function Footer() {

  return (
    <footer className={`${montserrat.variable} ${poppins.variable} max-w-[1858px] mx-auto lg:mt-20 m-6 h-auto relative overflow-hidden flex flex-col justify-between`}>
      {/* Wave Background Decoration */}
      <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden pointer-events-none z-0">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="rgba(255, 165, 0, 0.15)"
          />
          <path
            d="M0,80 Q300,40 600,80 T1200,80 L1200,120 L0,120 Z"
            fill="rgba(64, 224, 208, 0.15)"
          />
        </svg>
      </div>

      {/* Sun Decoration */}
      <div className="absolute top-8 right-8 lg:top-16 lg:right-16 w-16 h-16 lg:w-24 lg:h-24 pointer-events-none z-0">
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-30"
            style={{ background: "radial-gradient(circle, #FFD700 0%, transparent 70%)" }}
          />
          <div
            className="absolute inset-2 rounded-full"
            style={{ background: "radial-gradient(circle, #FFD700 0%, #FFA500 100%)" }}
          />
        </div>
      </div>

      <div
        className={`font-['Montserrat'] w-full text-center my-16 border-b overflow-hidden whitespace-nowrap relative z-10`}
        style={{
          borderColor: "rgba(255, 165, 0, 0.3)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: "linear-gradient(to right, transparent, #40E0D0, #FFD700, #FFA500, transparent)",
          }}
        />
        <h1
          className="leading-none tracking-widest text-[13vw] relative z-10 font-bold"
          style={{
            wordBreak: "keep-all",
            background: "linear-gradient(135deg, #FFA500 0%, #FFD700 50%, #40E0D0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {BRAND.name}
        </h1>
      </div>

      {/* On larger screens (PC view) */}
      <div className="hidden lg:flex justify-between items-start relative z-10">
        <div className="flex flex-col gap-8">
          <div className="flex justify-start gap-6 group cursor-pointer">
            <div
              className={`w-20 h-20 md:w-26 md:h-26 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                "border-stone-300/60 group-hover:border-stone-400"
              }`}
              style={{
                background: "rgba(245, 245, 244, 0.5)",
              }}
            >
              <Image
                src="/images/location-icon.svg"
                alt="Location"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300 opacity-60"
              />
            </div>
            <Link
              href="https://maps.app.goo.gl/jJS3JdddMq6njJvb8?g_st=it"
              target="_blank"
              className="font-['Poppins'] w-48 h-8 md:w-72 md:h-11 text-sm md:text-xl flex justify-start my-3 transition-all duration-300"
              style={{
                color: "rgba(28, 25, 23, 0.8)",
              }}
              onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
                e.currentTarget.style.transform = "translateX(2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(28, 25, 23, 0.8)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              {BRAND.contact.showroom}
            </Link>
          </div>

          <div className="flex justify-start gap-6 group cursor-pointer">
            <div
              className={`w-20 h-20 md:w-26 md:h-26 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                "border-stone-300/60 group-hover:border-stone-400"
              }`}
              style={{
                background: "rgba(245, 245, 244, 0.5)",
              }}
            >
              <Image
                src="/images/email-icon.svg"
                alt="Email"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300 opacity-60"
              />
            </div>
            <Link
              href={`mailto:${BRAND.contact.email}`}
              className="font-['Poppins'] w-48 h-5 items-center md:w-72 md:h-5 text-sm md:text-xl flex justify-start my-auto transition-all duration-300"
              style={{
                color: "rgba(28, 25, 23, 0.8)",
              }}
              onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
                e.currentTarget.style.transform = "translateX(2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(28, 25, 23, 0.8)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              {BRAND.contact.email}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex justify-start gap-6 group cursor-pointer">
            <div
              className={`w-20 h-20 md:w-26 md:h-26 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                "border-stone-300/60 group-hover:border-stone-400"
              }`}
              style={{
                background: "rgba(245, 245, 244, 0.5)",
              }}
            >
              <Image
                src="/images/instagram-icon.svg"
                alt="Instagram"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300 opacity-60"
              />
            </div>
            <Link
              href={BRAND.socials.instagram}
              target="_blank"
              className="font-['Poppins'] w-28 h-8 md:w-32 md:h-11 text-sm md:text-xl flex justify-start my-auto transition-all duration-300"
              style={{
                color: "rgba(28, 25, 23, 0.8)",
              }}
              onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
                e.currentTarget.style.transform = "translateX(2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(28, 25, 23, 0.8)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              Instagram
            </Link>
          </div>

          <div className="flex justify-start gap-6 group cursor-pointer">
            <div
              className={`w-20 h-20 md:w-26 md:h-26 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                "border-stone-300/60 group-hover:border-stone-400"
              }`}
              style={{
                background: "rgba(245, 245, 244, 0.5)",
              }}
            >
              <Image
                src="/images/telegram-icon.svg"
                alt="Telegram"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300 opacity-60"
              />
            </div>
            <Link
              href={BRAND.socials.telegram}
              target="_blank"
              className="font-['Poppins'] w-28 h-5 md:w-40 md:h-5 text-sm md:text-xl flex justify-start my-auto transition-all duration-300"
              style={{
                color: "rgba(28, 25, 23, 0.8)",
              }}
              onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
                e.currentTarget.style.transform = "translateX(2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(28, 25, 23, 0.8)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              Telegram
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <div className="space-y-4">
            <h3
              className="font-['Montserrat'] text-lg md:text-2xl font-semibold mb-4"
              style={{ color: "rgba(28, 25, 23, 0.95)" }}
            >
              Графік роботи
            </h3>
            <p
              className="font-['Poppins'] text-sm md:text-lg"
              style={{ color: "rgba(28, 25, 23, 0.7)" }}
            >
              {BRAND.contact.schedule}
            </p>
          </div>

          <div className="space-y-4">
            <h3
              className="font-['Montserrat'] text-lg md:text-2xl font-semibold mb-4"
              style={{ color: "rgba(28, 25, 23, 0.95)" }}
            >
              Телефон
            </h3>
            <a
              href={`tel:${BRAND.contact.phone.replace(/\s+/g, "")}`}
              className="font-['Poppins'] text-sm md:text-lg transition-all duration-300"
              style={{ color: "rgba(28, 25, 23, 0.7)" }}
              onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(28, 25, 23, 0.7)";
              }}
            >
              {BRAND.contact.phone}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3
            className="font-['Montserrat'] text-lg md:text-2xl font-semibold mb-2"
            style={{ color: "rgba(28, 25, 23, 0.95)" }}
          >
            Навігація
          </h3>
          <Link
            href="/#about"
            className="font-['Poppins'] text-sm md:text-lg transition-all duration-300 hover:translate-x-1 inline-block w-fit"
            style={{ color: "rgba(28, 25, 23, 0.7)" }}
            onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(28, 25, 23, 0.7)";
            }}
          >
            Про нас
          </Link>
          <Link
            href="/#payment-and-delivery"
            className="font-['Poppins'] text-sm md:text-lg transition-all duration-300 hover:translate-x-1 inline-block w-fit"
            style={{ color: "rgba(28, 25, 23, 0.7)" }}
            onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(28, 25, 23, 0.7)";
            }}
          >
            Оплата і доставка
          </Link>
          <Link
            href="/#reviews"
            className="font-['Poppins'] text-sm md:text-lg transition-all duration-300 hover:translate-x-1 inline-block w-fit"
            style={{ color: "rgba(28, 25, 23, 0.7)" }}
            onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(28, 25, 23, 0.7)";
            }}
          >
            Відгуки
          </Link>
          <Link
            href="/#contacts"
            className="font-['Poppins'] text-sm md:text-lg transition-all duration-300 hover:translate-x-1 inline-block w-fit"
            style={{ color: "rgba(28, 25, 23, 0.7)" }}
            onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(28, 25, 23, 0.7)";
            }}
          >
            Контакти
          </Link>
        </div>

        <Link
          href="/"
          className="w-48 h-48 md:w-60 md:h-60 rounded-full flex justify-center transition-all duration-300 hover:scale-110 shadow-xl relative overflow-hidden group"
          style={{
            background: "linear-gradient(135deg, #FFA500 0%, #FFD700 50%, #40E0D0 100%)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span
            className="font-['Montserrat'] my-auto text-xl md:text-2xl font-bold relative z-10 text-white"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
          >
            На головну
          </span>
        </Link>
      </div>

      {/* On smaller screens (Mobile view) */}
      <div className="lg:hidden flex flex-col gap-10 m-3 relative z-10">
        <div className="flex justify-between gap-4 md:gap-6">
          <div className="flex flex-col gap-5">
            <div className="flex justify-start gap-4 md:gap-6">
              <div className="w-40 h-8 md:w-56 md:h-11 flex flex-col justify-start my-auto">
                <span
                  className="font-['Montserrat'] text-lg md:text-2xl font-semibold"
                  style={{ color: "rgba(28, 25, 23, 0.95)" }}
                >
                  Графік роботи:
                </span>
                <span
                  className="font-['Poppins'] text-sm md:text-lg"
                  style={{ color: "rgba(28, 25, 23, 0.7)" }}
                >
                  {BRAND.contact.schedule}
                </span>
              </div>
            </div>

            <div className="flex justify-start gap-4 md:gap-6">
              <div className="w-40 h-8 md:w-56 md:h-11 flex flex-col justify-start my-auto">
                <span
                  className="font-['Montserrat'] text-lg md:text-2xl font-semibold"
                  style={{ color: "rgba(28, 25, 23, 0.95)" }}
                >
                  Телефон
                </span>
                <a
                  href={`tel:${BRAND.contact.phone.replace(/\s+/g, "")}`}
                  className="font-['Poppins'] text-sm md:text-lg transition-colors duration-300"
                  style={{ color: "rgba(28, 25, 23, 0.7)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(28, 25, 23, 0.7)";
                  }}
                >
                  {BRAND.contact.phone}
                </a>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="w-40 h-40 md:w-60 md:h-60 rounded-full flex justify-center transition-all duration-300 hover:scale-110 shadow-xl relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #FFA500 0%, #FFD700 50%, #40E0D0 100%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span
              className="font-['Montserrat'] my-auto text-xl md:text-2xl font-bold relative z-10 text-white"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
            >
              На головну
            </span>
          </Link>
        </div>

        <div>
          <span
            className="font-['Montserrat'] text-lg md:text-2xl font-semibold block mb-4"
            style={{ color: "rgba(28, 25, 23, 0.95)" }}
          >
            Навігація
          </span>
          <div className="flex justify-around gap-4 md:gap-6 flex-wrap">
            <Link
              href="/#about"
              className="font-['Poppins'] text-sm md:text-lg transition-colors duration-300"
              style={{ color: "rgba(28, 25, 23, 0.7)" }}
              onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(28, 25, 23, 0.7)";
              }}
            >
              Про нас
            </Link>
            <Link
              href="/#payment-and-delivery"
              className="font-['Poppins'] text-sm md:text-lg transition-colors duration-300"
              style={{ color: "rgba(28, 25, 23, 0.7)" }}
              onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(28, 25, 23, 0.7)";
              }}
            >
              Оплата і доставка
            </Link>
            <Link
              href="/#reviews"
              className="font-['Poppins'] text-sm md:text-lg transition-colors duration-300"
              style={{ color: "rgba(28, 25, 23, 0.7)" }}
              onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(28, 25, 23, 0.7)";
              }}
            >
              Відгуки
            </Link>
            <Link
              href="/#contacts"
              className="font-['Poppins'] text-sm md:text-lg transition-colors duration-300"
              style={{ color: "rgba(28, 25, 23, 0.7)" }}
              onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(28, 25, 23, 0.7)";
              }}
            >
              Контакти
            </Link>
          </div>
        </div>

        <div className="flex justify-between gap-4 md:gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-start gap-4">
              <div
                className={`w-15 h-15 md:w-26 md:h-26 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                  "border-stone-300/60"
                }`}
                style={{
                  background: "rgba(245, 245, 244, 0.5)",
                }}
              >
                <Image
                  src="/images/location-icon.svg"
                  alt="Location"
                  width={16}
                  height={16}
                  className="w-3 h-3 md:w-4 md:h-4 opacity-60"
                />
              </div>
              <Link
                href="https://maps.app.goo.gl/jJS3JdddMq6njJvb8?g_st=it"
                target="_blank"
                className="font-['Poppins'] w-48 h-8 md:w-56 md:h-11 text-sm md:text-xl flex justify-start my-3 transition-colors duration-300"
                style={{ color: "rgba(28, 25, 23, 0.8)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 0.8)";
                }}
              >
                {BRAND.contact.showroom}
              </Link>
            </div>

            <div className="flex justify-start gap-4 md:gap-6">
              <div
                className={`w-15 h-15 md:w-26 md:h-26 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                  "border-stone-300/60"
                }`}
                style={{
                  background: "rgba(245, 245, 244, 0.5)",
                }}
              >
                <Image
                  src="/images/email-icon.svg"
                  alt="Email"
                  width={16}
                  height={16}
                  className="w-3 h-3 md:w-4 md:h-4 opacity-60"
                />
              </div>
              <Link
                href={`mailto:${BRAND.contact.email}`}
                className="font-['Poppins'] w-48 h-5 md:w-56 md:h-5 text-sm md:text-xl flex justify-start my-auto transition-colors duration-300"
                style={{ color: "rgba(28, 25, 23, 0.8)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 0.8)";
                }}
              >
                {BRAND.contact.email}
              </Link>
            </div>

            <div className="flex justify-start gap-4 md:gap-6">
              <div
                className={`w-15 h-15 md:w-26 md:h-26 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                  "border-stone-300/60"
                }`}
                style={{
                  background: "rgba(245, 245, 244, 0.5)",
                }}
              >
                <Image
                  src="/images/instagram-icon.svg"
                  alt="Instagram"
                  width={16}
                  height={16}
                  className="w-3 h-3 md:w-4 md:h-4 opacity-60"
                />
              </div>
              <Link
                href={BRAND.socials.instagram}
                target="_blank"
                className="font-['Poppins'] w-28 h-8 md:w-32 md:h-11 text-sm md:text-xl flex justify-start my-auto transition-colors duration-300"
                style={{ color: "rgba(28, 25, 23, 0.8)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 0.8)";
                }}
              >
                Instagram
              </Link>
            </div>

            <div className="flex justify-start gap-4 md:gap-6">
              <div
                className={`w-15 h-15 md:w-26 md:h-26 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                  "border-stone-300/60"
                }`}
                style={{
                  background: "rgba(245, 245, 244, 0.5)",
                }}
              >
                <Image
                  src="/images/telegram-icon.svg"
                  alt="Telegram"
                  width={16}
                  height={16}
                  className="w-3 h-3 md:w-4 md:h-4 opacity-60"
                />
              </div>
              <Link
                href={BRAND.socials.telegram}
                target="_blank"
                className="font-['Poppins'] w-28 h-5 md:w-32 md:h-5 text-sm md:text-xl flex justify-start my-auto transition-colors duration-300"
                style={{ color: "rgba(28, 25, 23, 0.8)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(28, 25, 23, 0.8)";
                }}
              >
                Telegram
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col sm:flex-row justify-between items-center sm:items-start mt-16 gap-6 border-t pt-8 relative z-10"
        style={{
          borderColor: "rgba(255, 165, 0, 0.3)",
        }}
      >
        <span
          className="font-['Poppins'] text-sm md:text-lg text-center sm:text-left"
          style={{ color: "rgba(28, 25, 23, 0.6)" }}
        >
          {BRAND.name} © 2025 All rights reserved
        </span>
        <div className="flex gap-4 md:gap-6 items-center">
          <Link
            href="/privacy-policy"
            className="font-['Poppins'] text-sm md:text-lg transition-all duration-300 text-center"
            style={{ color: "rgba(28, 25, 23, 0.6)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(28, 25, 23, 0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(28, 25, 23, 0.6)";
            }}
          >
            Політика конфіденційності
          </Link>
          <span
            className="text-sm md:text-lg hidden sm:inline"
            style={{ color: "rgba(28, 25, 23, 0.3)" }}
          >
            |
          </span>
          <Link
            href="/terms-of-service"
            className="font-['Poppins'] text-sm md:text-lg transition-all duration-300 text-center"
            style={{ color: "rgba(28, 25, 23, 0.6)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(28, 25, 23, 0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(28, 25, 23, 0.6)";
            }}
          >
            Договір оферти
          </Link>
        </div>
      </div>

      {/* Centered developer credit */}
      <div className="mt-8 mb-6 flex flex-col lg:flex-row items-center gap-3 lg:gap-6 justify-center relative z-10">
        <Link
          href="https://telebots.site/"
          target="_blank"
          className="font-['Poppins'] px-6 py-3 rounded-full border-2 transition-all duration-300 text-sm md:text-base tracking-wide hover:scale-105 relative overflow-hidden group"
          style={{
            borderColor: "rgba(168, 162, 158, 0.4)",
            color: "rgba(28, 25, 23, 0.7)",
            background: "rgba(245, 245, 244, 0.4)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(168, 162, 158, 0.6)";
            e.currentTarget.style.color = "rgba(28, 25, 23, 0.9)";
            e.currentTarget.style.background = "rgba(245, 245, 244, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(168, 162, 158, 0.4)";
            e.currentTarget.style.color = "rgba(28, 25, 23, 0.7)";
            e.currentTarget.style.background = "rgba(245, 245, 244, 0.4)";
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10">Telebots | Розробка сайтів</span>
        </Link>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none z-0">
        <svg
          className="absolute top-0 w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 Q300,0 600,40 T1200,40 L1200,120 L0,120 Z"
            fill="rgba(255, 215, 0, 0.12)"
          />
          <path
            d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="rgba(255, 165, 0, 0.12)"
          />
        </svg>
      </div>
    </footer>
  );
}
