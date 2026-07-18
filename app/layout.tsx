import type { Metadata } from "next";
import { Spectral, Work_Sans, Abril_Fatface } from "next/font/google";
import { SiteNav } from "@/components/SiteNav";
import { BackgroundDecor } from "@/components/BackgroundDecor";
import "./globals.css";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-spectral",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Legacy Book",
  description: "A send-off for our graduating class.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spectral.variable} ${workSans.variable} ${abrilFatface.variable}`}>
      <body className="font-body relative">
        <BackgroundDecor />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
