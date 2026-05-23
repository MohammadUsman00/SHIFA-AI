import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Noto_Naskh_Arabic,
  Noto_Nastaliq_Urdu,
  Noto_Sans_Devanagari,
  Source_Sans_3,
} from "next/font/google";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sansFont = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const urduFont = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-urdu",
  display: "swap",
});

const urduNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-urdu-nastaliq",
  display: "swap",
});

const hindiFont = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hindi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shifa AI — Prescription clarity for every family",
  description:
    "A patient-first health companion that helps you understand prescriptions and medicines in Urdu, English, and Hindi.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  appleWebApp: { capable: true, title: "Shifa AI" },
};

export const viewport: Viewport = {
  themeColor: "#0f1c2e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      translate="no"
      className={`scroll-smooth ${displayFont.variable} ${sansFont.variable} ${urduFont.variable} ${urduNastaliq.variable} ${hindiFont.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
