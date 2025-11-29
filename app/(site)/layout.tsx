import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./critical.css";
import "./globals.css";
import "./mobile-optimizations.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AppProvider } from "@/lib/GeneralProvider";
import { BasketProvider } from "@/lib/BasketProvider";
import { registerServiceWorker } from "@/lib/registerSW";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { WebVitals } from "@/components/shared/WebVitals";
import MainContent from "@/components/shared/MainContent";
import StructuredData from "@/components/shared/StructuredData";
import { BRAND } from "@/lib/brand";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  variable: "--font-inter",
  adjustFontFallback: true,
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calipuff.ua';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${BRAND.name} — Каліфорнійська затяжка 🌴 | Легальні вейпи без ТГК`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.shortDescription,
  keywords: [
    "CALIPUFF",
    "легальні вейпи",
    "вейпи без ТГК",
    "CBD вейпи",
    "COA сертифікація",
    "європейський бренд",
    "каліфорнійський стиль",
    "cartridge",
    "liquids",
    "wave lab",
    "вейп Україна",
    "легальні картриджі",
    "CBD ліквіди",
    "вейп магазин",
    "купити вейп",
    "вейп онлайн",
    "каліфорнійські вейпи",
    "безпечні вейпи",
    "якісні вейпи",
    "вейп картриджі",
    "вейп рідини",
    "CBD картриджі",
    "легальні вейп продукти",
    "вейп аксесуари",
    "каліфорнійська затяжка",
  ],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/images/light-theme/calipuff-logo-header-light.svg",
    shortcut: "/images/light-theme/calipuff-logo-header-light.svg",
    apple: "/images/light-theme/calipuff-logo-header-light.svg",
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: baseUrl,
    siteName: BRAND.name,
    title: `${BRAND.name} — Каліфорнійська затяжка 🌴 | Легальні вейпи без ТГК`,
    description: BRAND.shortDescription,
    images: [
      {
        url: `${baseUrl}/images/hero-bg.png`,
        width: 1200,
        height: 630,
        alt: `${BRAND.name} — Каліфорнійська затяжка`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Каліфорнійська затяжка 🌴`,
    description: BRAND.shortDescription,
    images: [`${baseUrl}/images/hero-bg.png`],
    creator: "@calipuff_ua",
  },
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Додайте ваші коди верифікації
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={inter.className}>
      <head>
        <meta name="cryptomus" content="64290c43" />
        {/* Mobile viewport optimization */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="language" content="ukrainian" />
        <meta name="geo.region" content="UA" />
        <meta name="geo.placename" content="Київ" />
        <meta name="geo.position" content="50.4501;30.5234" />
        <meta name="ICBM" content="50.4501, 30.5234" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="revisit-after" content="7 days" />
        <meta name="expires" content="never" />
        <meta name="coverage" content="worldwide" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta httpEquiv="content-language" content="uk" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="slurp" content="index, follow" />
        <meta name="duckduckbot" content="index, follow" />
        
        {/* Additional Open Graph Tags */}
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={BRAND.name} />
        
        {/* Additional Twitter Tags */}
        <meta name="twitter:site" content="@calipuff_ua" />
        <meta name="twitter:domain" content="calipuff.ua" />
        
        {/* Schema.org additional markup */}
        <link rel="alternate" type="application/rss+xml" title={`${BRAND.name} RSS Feed`} href={`${baseUrl}/feed.xml`} />

        {/* Favicon and App Icons */}
        <link
          rel="icon"
          type="image/svg+xml"
          href="/images/light-theme/calipuff-logo-header-light.svg"
        />
        <link
          rel="shortcut icon"
          type="image/svg+xml"
          href="/images/light-theme/calipuff-logo-header-light.svg"
        />
        <link
          rel="apple-touch-icon"
          href="/images/light-theme/calipuff-logo-header-light.svg"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content={BRAND.palette.sunset} />
        <meta name="msapplication-TileColor" content={BRAND.palette.sunset} />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/images/light-theme/calipuff-logo-header-light.svg"
          as="image"
        />
        {/* Conditional preload: image for mobile, video for desktop */}
        <link
          rel="preload"
          href="/images/Знімок екрана 2025-10-17 о 22.25.53.png"
          as="image"
          media="(max-width: 767px)"
        />
        <link
          rel="preload"
          href="/images/IMG_5831.webm"
          as="video"
          type="video/webm"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          href="/api/products/top-sale"
          as="fetch"
          crossOrigin="anonymous"
        />

        {/* Conditional preload for mobile vs desktop */}
        <link
          rel="preload"
          href="/images/IMG_0043.JPG"
          as="image"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          href="/images/IMAGE-2025-10-17_21-48-37.jpg"
          as="image"
          media="(min-width: 768px)"
        />

        {/* Mobile-specific prefetch */}
        <link rel="prefetch" href="/catalog" />
        <link rel="prefetch" href="/api/products?limit=12" />

        {/* DNS prefetch and preconnect */}
        <link rel="dns-prefetch" href="//placehold.co" />
        <link
          rel="preconnect"
          href="https://placehold.co"
          crossOrigin="anonymous"
        />

        {/* Resource hints for better performance */}
        <link rel="modulepreload" href="/_next/static/chunks/webpack.js" />
        <link rel="modulepreload" href="/_next/static/chunks/framework.js" />
        <link rel="modulepreload" href="/_next/static/chunks/main.js" />

        {/* Mobile-specific optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Apple touch icon */}
        <link
          rel="apple-touch-icon"
          href="/images/light-theme/calipuff-logo-header-light.svg"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1148656287371559');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1148656287371559&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
        
        {/* Structured Data */}
        <StructuredData type="organization" />
        <StructuredData type="website" />
      </head>
      <body>
        <ErrorBoundary>
          <AppProvider>
            <BasketProvider>
              <Header />
              <MainContent>{children}</MainContent>
              <Footer />
            </BasketProvider>
          </AppProvider>
        </ErrorBoundary>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (${registerServiceWorker.toString()})();
          `,
          }}
        />
        <WebVitals />
      </body>
    </html>
  );
}
