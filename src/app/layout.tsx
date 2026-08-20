import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
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
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
        {children}
      </body>
    </html>
  );
}
