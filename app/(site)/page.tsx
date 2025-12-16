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
  title: `${BRAND.name} — Каліфорнійська хвиля свободи 🌴 | Ароматичні девайси 18+`,
  description: BRAND.shortDescription,
  openGraph: {
    title: `${BRAND.name} — Каліфорнійська хвиля свободи 🌴`,
    description: BRAND.shortDescription,
    url: baseUrl,
    siteName: BRAND.name,
    images: [
      {
        url: `${baseUrl}/images/hero-bg.png`,
        width: 1200,
        height: 630,
        alt: `${BRAND.name} — Каліфорнійська хвиля свободи`,
      },
    ],
    locale: "uk_UA",
    type: "website",
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
