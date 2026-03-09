import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata: Metadata = {
  title: "Pet Cafe - ร้านคาเฟ่สัตว์เลี้ยง",
  description: "ร้านคาเฟ่ที่มีสัตว์เลี้ยงน่ารัก พร้อมอาหารและเครื่องดื่มอร่อย",
  ...(appBaseUrl
    ? {
        metadataBase: new URL(appBaseUrl),
        openGraph: {
          title: "Pet Cafe - ร้านคาเฟ่สัตว์เลี้ยง",
          description:
            "ร้านคาเฟ่สัตว์เลี้ยงบรรยากาศอบอุ่น พร้อมสัตว์เลี้ยงน่ารัก และเมนูอาหารเครื่องดื่มหลากหลาย",
          url: appBaseUrl,
          siteName: "Pet Cafe",
          images: [
            {
              url: "/og-image.png",
              width: 1200,
              height: 630,
              alt: "Pet Cafe - ร้านคาเฟ่สัตว์เลี้ยง",
            },
          ],
          locale: "th_TH",
          type: "website",
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
