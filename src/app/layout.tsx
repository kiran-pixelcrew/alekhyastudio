import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { ProtectImages } from "@/components/shared/ProtectImages";
import { site } from "@/data/site";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.displayName} | Dance Photography, Invitation Design & Artist Portfolio Websites`,
    template: `%s · ${site.displayName}`,
  },
  description: site.description,
  keywords: [
    "dance photography India",
    "dance photography Bangalore",
    "Bharatanatyam photographer",
    "Kathak performance photographer",
    "arangetram photography",
    "arangetram invitation design",
    "dance event poster design",
    "portfolio website for dancers",
    "website design for performing artists",
    "choreographer portfolio website",
    "dance academy website design",
  ],
  openGraph: {
    title: site.displayName,
    description: site.description,
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="grain-overlay relative min-h-full flex flex-col antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Analytics />
        <ProtectImages />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
