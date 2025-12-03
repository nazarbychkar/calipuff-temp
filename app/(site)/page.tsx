import dynamic from "next/dynamic";
import Hero from "@/components/main-page/Hero";
import TopSaleServer from "@/components/main-page/TopSaleServer";
import StructuredData from "@/components/shared/StructuredData";
import DisclaimerPopup from "@/components/shared/DisclaimerPopup";
import { Suspense } from "react";
import { Metadata } from "next";
import { BRAND } from "@/lib/brand";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calipuff.ua';

export const metadata: Metadata = {
  title: `${BRAND.name} — Каліфорнійська затяжка 🌴 | Легальні вейпи без ТГК`,
  description: BRAND.shortDescription,
  openGraph: {
    title: `${BRAND.name} — Каліфорнійська затяжка 🌴`,
    description: BRAND.shortDescription,
    url: baseUrl,
    siteName: BRAND.name,
    images: [
      {
        url: `${baseUrl}/images/hero-bg.png`,
        width: 1200,
        height: 630,
        alt: `${BRAND.name} — Каліфорнійська затяжка`,
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
const AboutUs = dynamic(() => import("@/components/main-page/AboutUs"), {
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

export const revalidate = 300; // ISR every 5 minutes

export default function Home() {
  return (
    <>
      <StructuredData type="website" />
      <Hero />
      <Suspense fallback={<div className="text-center py-20 text-lg">Завантаження топових товарів...</div>}>
        <TopSaleServer />
      </Suspense>
      <AboutUs />
      <WhyChooseUs />
      <SocialMedia />
      <LimitedEdition />
      <FAQ />
      <Reviews />
      <DisclaimerPopup />
    </>
  );
}
