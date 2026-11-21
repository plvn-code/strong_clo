import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { Suspense } from "react";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/Header";
import { BagDrawer } from "@/components/BagDrawer";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";
import "./globals.css";

// onebyone.ua typography: a clean geometric grotesk (they pair TT Norms Pro with Manrope) —
// Manrope covers Cyrillic and every weight we need, from the light masthead to bold labels.
const sans = Manrope({ subsets: ["latin", "cyrillic"], weight: ["200", "300", "400", "500", "600", "700"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "STRONG — український бренд жіночого одягу", template: "%s — STRONG" },
  description: site.description,
  openGraph: { title: "STRONG", description: site.description, locale: "uk_UA", type: "website" },
  robots: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={sans.variable}>
      <body>
        <StoreProvider>
          <a href="#main" className="skip">
            До змісту
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <BagDrawer />
          <Suspense>
            <Reveal />
          </Suspense>
        </StoreProvider>
      </body>
    </html>
  );
}
