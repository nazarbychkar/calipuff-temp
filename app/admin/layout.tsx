// /app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import { SidebarProvider } from "@/lib/SidebarContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import ClientLayoutShell from "@/components/admin/ClientLayoutShell";
import { BRAND } from "@/lib/brand";

const outfit = Roboto({
  subsets: ["cyrillic"],
});

export const metadata: Metadata = {
  title: `${BRAND.name} — Admin Panel`,
  icons: {
    icon: "/images/light-theme/calipuff-logo-header-light.svg",
    shortcut: "/images/light-theme/calipuff-logo-header-light.svg",
    apple: "/images/light-theme/calipuff-logo-header-light.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        {/* Additional favicon for compatibility */}
        <link rel="icon" type="image/svg+xml" href="/images/light-theme/calipuff-logo-header-light.svg" />
        <link rel="shortcut icon" type="image/svg+xml" href="/images/light-theme/calipuff-logo-header-light.svg" />
        <link rel="apple-touch-icon" href="/images/light-theme/calipuff-logo-header-light.svg" />
      </head>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <ClientLayoutShell>{children}</ClientLayoutShell>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
