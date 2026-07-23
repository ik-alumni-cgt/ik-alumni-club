import type { Metadata } from "next"
import { Inter, Noto_Sans_JP } from "next/font/google"
import { setLocale } from "@/app/web/i18n/set-locale"
import { YourflagHeader } from "@/components/yourflag/yourflag-header"
import { YourflagHero } from "@/components/yourflag/yourflag-hero"
import { PurposeSection } from "@/components/yourflag/purpose-section"
import { AboutSection } from "@/components/yourflag/about-section"
import { TeamCanSection } from "@/components/yourflag/team-can-section"
import { SupporterFlowSection } from "@/components/yourflag/supporter-flow-section"
import { UsecaseSection } from "@/components/yourflag/usecase-section"
import { PricingSection } from "@/components/yourflag/pricing-section"
import { FaqSection } from "@/components/yourflag/faq-section"
import { CtaSection } from "@/components/yourflag/cta-section"
import { YourflagFooter } from "@/components/yourflag/yourflag-footer"
import { Reveal } from "@/components/yourflag/reveal"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto",
  display: "swap",
})

export const metadata: Metadata = {
  title: "クラブ活動支援サービス YOURFLAG（ユアフラッグ）｜継続支援プラットフォーム",
  description:
    "クラブ活動・スポーツ・文化団体と、その活動を応援する人をつなぐ継続支援プラットフォーム。団体ページ作成から会費プラン設定・オンライン決済・会員管理までこれ1つ。導入費用0円のベーシックプランから始められます。",
}

export default async function YourflagPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await setLocale(params)

  return (
    <div
      className={`${inter.variable} ${noto.variable} font-[family-name:var(--font-noto)] font-medium text-[#111] leading-[1.8] tracking-[.04em] [word-break:auto-phrase]`}
    >
      <YourflagHeader />
      <main>
        <YourflagHero />
        <Reveal>
          <PurposeSection />
        </Reveal>
        <Reveal>
          <AboutSection />
        </Reveal>
        <TeamCanSection />
        <SupporterFlowSection />
        <UsecaseSection />
        <PricingSection />
        <Reveal>
          <FaqSection />
        </Reveal>
        <Reveal>
          <CtaSection />
        </Reveal>
      </main>
      <YourflagFooter />
    </div>
  )
}
