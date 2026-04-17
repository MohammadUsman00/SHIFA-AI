import type { Metadata } from "next";
import { Noto_Naskh_Arabic, Noto_Nastaliq_Urdu, Noto_Sans_Devanagari, Inter } from "next/font/google";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import "./globals.css";

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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shifa AI — شفا اے آئی",
  description: "Professional AI-powered prescription guidance in Urdu, English, and Hindi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ur"
      translate="no"
      className={`dark scroll-smooth ${urduFont.variable} ${urduNastaliq.variable} ${hindiFont.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
