import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import { getBaseURL } from "@/lib/get-base-url";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/app/web/i18n/routing";
import { setLocale } from "@/app/web/i18n/set-locale";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const senobiGothic = localFont({
  src: [
    {
      path: "../fonts/Senobi-Gothic-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Senobi-Gothic-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Senobi-Gothic-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-senobi-gothic",
  display: "swap",
});

const academy = localFont({
  src: [
    {
      path: "../fonts/Academy.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/AcademyFilled3D.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-academy",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    template: "%s | IK Alumni Club",
    default: "IK Alumni Club",
  },
  description:
    "2022年に発足した、千葉県内唯一の一般カラーガードチーム。柏市立柏高等学校の卒業生で構成され、地元柏市でのイベント出演や年度末の自主公演に向けて日々活動しています。",
  metadataBase: new URL(getBaseURL()),
  openGraph: {
    siteName: "IK Alumni Club",
    url: getBaseURL(),
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = await setLocale(params);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${senobiGothic.variable} ${academy.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <NuqsAdapter>
            {children}
            <Toaster />
            <Analytics />
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
