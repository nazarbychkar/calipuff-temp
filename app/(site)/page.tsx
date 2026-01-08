import dynamic from "next/dynamic";
import HeroServer from "@/components/main-page/HeroServer";
import TopSaleServer from "@/components/main-page/TopSaleServer";
import StructuredData from "@/components/shared/StructuredData";
import ProductDisclaimer from "@/components/shared/ProductDisclaimer";
import { Suspense } from "react";
import { Metadata } from "next";
import { BRAND } from "@/lib/brand";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calishops.com';

export const metadata: Metadata = {
  title: `CBD канабіс, HHC, THC та TAC вейпи | ${BRAND.name} — Легальні коноплі без ТГК | Доставка по Україні`,
  description: `${BRAND.name} — магазин легальних CBD канабісу, HHC, THC та TAC вейпів в Україні. CBD коноплі та канабіску з екстрактом. Широкий вибір смаків: Amnesia, OG Kush, Gelato, Lemon Haze. Всі продукти без ТГК, сертифіковані. Легальний канабіс в Україні. Доставка по Україні, Нова Пошта. Купити вейп, дудку, картридж 510.`,
  keywords: [
    "CBD магазин",
    "CBD Україна",
    "купити CBD",
    "легальний CBD",
    "CBD канабіс",
    "CBD коноплі",
    "CBD канабіску",
    "канабіс CBD",
    "коноплі CBD",
    "канабіс",
    "каннабіс",
    "коноплі",
    "канабіску",
    "канабіс Україна",
    "коноплі Україна",
    "легальний канабіс",
    "легальні коноплі",
    "технічні коноплі",
    "екстракт конопель",
    "екстракт канабісу",
    "конопляний екстракт",
    "канабіноїди",
    "канабіноїди Україна",
    "HHC Україна",
    "легальний HHC",
    "HHC канабіс",
    "HHC коноплі",
    "THC Україна",
    "ТГК Україна",
    "THC канабіс",
    "THC коноплі",
    "TAC вейп",
    "ТАС вейп",
    "ТАС вейп Україна",
    "TAC канабіс",
    "ТАС канабіс",
    "купити ТАС вейп",
    "вейп Україна",
    "купити вейп",
    "купити дудку",
    "дудка Україна",
    "CBD вейп",
    "HHC вейп",
    "THC вейп",
    "картридж 510",
    "одноразовий вейп",
    "легальний CBD",
    "без ТГК",
    "без THC",
    "THC FREE",
    "0.0% THC",
    "канабіс без ТГК",
    "коноплі без ТГК",
    "легально в Україні",
    "легальний канабіс Україна",
    "сертифіковано",
    "доставка по Україні",
    "Нова Пошта",
    "Київ",
    "Amnesia вейп",
    "OG Kush вейп",
    "Gelato вейп",
    "Lemon Haze вейп",
    BRAND.name,
  ],
  openGraph: {
    title: `CBD канабіс, HHC, THC та TAC вейпи | ${BRAND.name} — Легальні коноплі без ТГК`,
    description: `Магазин легальних CBD канабісу, HHC, THC та TAC вейпів в Україні. CBD коноплі та канабіску з екстрактом. Легальний канабіс в Україні. Широкий вибір смаків. Всі продукти без ТГК, сертифіковані. Доставка по Україні.`,
    url: baseUrl,
    siteName: BRAND.name,
    images: [
      {
        url: `${baseUrl}/images/hero-bg.png`,
        width: 1200,
        height: 630,
        alt: `${BRAND.name} — Легальні вейпи без ТГК`,
      },
    ],
    locale: "uk_UA",
    alternateLocale: ["ru_RU"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `CBD канабіс, HHC, THC та TAC вейпи | ${BRAND.name}`,
    description: `Магазин легальних CBD канабісу та конопель в Україні. Без ТГК. Доставка по Україні.`,
    images: [`${baseUrl}/images/hero-bg.png`],
  },
  alternates: {
    canonical: baseUrl,
  },
};

// Lazy load components that are below the fold
const AboutUsServer = dynamic(() => import("@/components/main-page/AboutUsServer"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />
});
const LimitedEdition = dynamic(() => import("@/components/main-page/LimitedEdition"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />
});
const FAQ = dynamic(() => import("@/components/main-page/FAQ"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />
});
const SocialMedia = dynamic(() => import("@/components/main-page/SocialMedia"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />
});
const WhyChooseUs = dynamic(() => import("@/components/main-page/WhyChooseUs"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />
});
const Reviews = dynamic(() => import("@/components/main-page/Reviews"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />
});

export const revalidate = 60; // ISR every 1 minute

export default function Home() {
  return (
    <>
      <StructuredData type="website" />
      <HeroServer />
      <ProductDisclaimer />
      <Suspense fallback={<div className="text-center py-20 text-lg">Завантаження топових товарів...</div>}>
        <TopSaleServer />
      </Suspense>
      <AboutUsServer />
      <WhyChooseUs />
      <SocialMedia />
      <LimitedEdition />
      <FAQ />
      <Reviews />
    </>
  );
}
