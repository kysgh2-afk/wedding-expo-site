import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { SEO_HOME, getSiteUrl } from "@/lib/regions";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SEO_HOME.title,
    template: "%s",
  },
  description: SEO_HOME.description,
  keywords: SEO_HOME.keywords,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "웨딩박람회 일정 모음",
    title: SEO_HOME.title,
    description: SEO_HOME.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
