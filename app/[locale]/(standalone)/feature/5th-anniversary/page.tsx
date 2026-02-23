import Image from "next/image"
import { setLocale } from "@/app/web/i18n/set-locale"
import { AnniversaryNav } from "@/components/anniversary/anniversary-nav"
import { AnniversaryHero } from "@/components/anniversary/anniversary-hero"
import { AnniversarySection } from "@/components/anniversary/anniversary-section"
import { AnniversaryFooter } from "@/components/anniversary/anniversary-footer"
import { AnniversaryScrollToTop } from "@/components/anniversary/anniversary-scroll-to-top"
import { ConceptSection } from "@/components/anniversary/concept-section"
import { NewsSection } from "@/components/anniversary/news-section"
import { ScheduleSection } from "@/components/anniversary/schedule-section"
import { GoodsSection } from "@/components/anniversary/goods-section"
import { FaqSection } from "@/components/anniversary/faq-section"
import bgImage from "./5th-anniversary-back-graund.png"

// セクション定義 - 追加・削除・並べ替えはここで管理
const SECTIONS = [
  { id: "concept", label: "CONCEPT" },
  { id: "news", label: "NEWS" },
  { id: "schedule", label: "SCHEDULE" },
  { id: "goods", label: "GOODS" },
  { id: "faq", label: "FAQ" },
] as const

export default async function AnniversaryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await setLocale(params)

  return (
    <div className="min-h-screen text-white">
      {/* 固定背景画像 */}
      <div className="fixed inset-0 z-0">
        <Image
          src={bgImage}
          alt=""
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10">
      {/* 固定ナビゲーション */}
      <AnniversaryNav sections={SECTIONS} />

      {/* ヒーロー */}
      <AnniversaryHero />

      {/* CONCEPT */}
      <AnniversarySection id="concept" title="CONCEPT">
        <ConceptSection />
      </AnniversarySection>

      {/* NEWS */}
      <AnniversarySection id="news" title="NEWS">
        <NewsSection />
      </AnniversarySection>

      {/* SCHEDULE */}
      <AnniversarySection id="schedule" title="SCHEDULE">
        <ScheduleSection />
      </AnniversarySection>

      {/* GOODS */}
      <AnniversarySection id="goods" title="GOODS">
        <GoodsSection />
      </AnniversarySection>

      {/* FAQ */}
      <AnniversarySection id="faq" title="FAQ">
        <FaqSection />
      </AnniversarySection>

      {/* フッター */}
      <AnniversaryFooter />

      {/* トップに戻るボタン */}
      <AnniversaryScrollToTop />
      </div>
    </div>
  )
}
