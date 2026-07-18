import type { Metadata } from "next"
import { Inter, Noto_Sans_JP } from "next/font/google"
import { setLocale } from "@/app/web/i18n/set-locale"
import { CheerlyHeader } from "@/components/cheerly/cheerly-header"
import { CheerlyHero } from "@/components/cheerly/cheerly-hero"
import { ServiceSection } from "@/components/cheerly/service-section"
import { PointSection } from "@/components/cheerly/point-section"
import { FlowSection } from "@/components/cheerly/flow-section"
import { UsecaseSection } from "@/components/cheerly/usecase-section"
import { PricingSection } from "@/components/cheerly/pricing-section"
import { FaqSection } from "@/components/cheerly/faq-section"
import { CtaSection } from "@/components/cheerly/cta-section"
import { CheerlyFooter } from "@/components/cheerly/cheerly-footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto",
  display: "swap",
})

export const metadata: Metadata = {
  title: "クラブ・スポーツ・文化団体の会員管理＆会費徴収 Cheerly（チアリー）",
  description:
    "クラブ・スポーツ・文化団体のための会員管理＆年会費徴収サービス。会員名簿から会費のオンライン決済・入金管理までこれ1つ。導入費用0円で始められます。",
}

export default async function CheerlyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await setLocale(params)

  return (
    <div
      className={`${inter.variable} ${noto.variable} font-[family-name:var(--font-noto)] font-medium text-[#111] leading-[1.8] tracking-[.04em] [word-break:auto-phrase]`}
    >
      <CheerlyHeader />
      <main>
        <CheerlyHero />
        <ServiceSection />
        <PointSection />
        <FlowSection />
        <UsecaseSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <CheerlyFooter />
    </div>
  )
}
