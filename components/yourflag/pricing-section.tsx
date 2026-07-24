import { SectionHead } from "./section-head"
import { Reveal } from "./reveal"

type Plan = {
  name: string
  note: string
  recommended?: boolean
  accent: "gray" | "blue" | "orange"
  init: string
  initUnit?: string
  monthly: string
  monthlyUnit?: string
  rate: string
  features: { label: string; on: boolean }[]
}

const PLANS: Plan[] = [
  {
    name: "ベーシックプラン",
    note: "基本料0円・決済手数料のみで気軽に始められるプラン",
    accent: "gray",
    init: "0",
    initUnit: "円",
    monthly: "0",
    monthlyUnit: "円",
    rate: "10",
    features: [
      { label: "基本機能", on: true },
      { label: "年会費の自動更新", on: true },
      { label: "名簿をオンラインで管理", on: true },
      { label: "グッズ販売・単発寄付", on: false },
      { label: "デジタルコンテンツの配信", on: false },
      { label: "CS担当によるサポート", on: false },
    ],
  },
  {
    name: "プレミアムプラン",
    note: "メンバーが50人以上の団体様におすすめ。急な寄付等にも対応できるプラン",
    recommended: true,
    accent: "blue",
    init: "10,000",
    initUnit: "円",
    monthly: "990",
    monthlyUnit: "円",
    rate: "10",
    features: [
      { label: "基本機能", on: true },
      { label: "年会費の自動更新", on: true },
      { label: "名簿をオンラインで管理", on: true },
      { label: "グッズ販売・単発寄付", on: true },
      { label: "デジタルコンテンツの配信", on: true },
      { label: "CS担当によるサポート", on: true },
    ],
  },
  {
    name: "エンタープライズプラン",
    note: "オリジナルHPや分析まで、団体運営を丸ごと支えるプラン",
    accent: "orange",
    init: "別途お見積もり",
    monthly: "2,980",
    monthlyUnit: "円",
    rate: "10",
    features: [
      { label: "プレミアムプランの機能", on: true },
      { label: "オリジナルHP作成", on: true },
      { label: "紹介動画作成", on: true },
      { label: "顧客分析ダッシュボード", on: true },
    ],
  },
]

const HEAD = {
  gray: "bg-[#8a8f99]",
  blue: "bg-[#00B0F0]",
  orange: "bg-[#FF9300]",
} as const

const BODY = {
  gray: "bg-white",
  blue: "bg-[#EAF8FE]",
  orange: "bg-[#FFF6EC]",
} as const

const CARD = {
  gray: "border-[#e3e6ec]",
  blue: "border-[#00B0F0]",
  orange: "border-[#FF9300]/60",
} as const

function Check({ on }: { on: boolean }) {
  return on ? (
    <svg viewBox="0 0 16 16" className="w-4 h-4 text-[#00B0F0] shrink-0" fill="none">
      <path d="m3 8.5 3 3 7-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" className="w-4 h-4 text-[#c2c7cf] shrink-0" fill="none">
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function PricingSection() {
  return (
    <section
      id="price"
      className="bg-[radial-gradient(#d7dbe4_1.3px,transparent_1.3px)] [background-size:18px_18px] py-14 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1120px] px-7 md:px-8">
        <Reveal>
          <SectionHead
            kicker="Price"
            desc="様々な用途に合ったプランをご用意。導入リスクはゼロ、支援が集まったときだけ利用料をいただきます。"
          >
            料金<span className="text-[#0483B8]">プラン</span>
          </SectionHead>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {PLANS.map((p, i) => (
            <Reveal
              key={p.name}
              delay={i * 100}
              className={`relative flex flex-col rounded-[1rem] border-2 overflow-hidden ${CARD[p.accent]} ${
                p.recommended ? "md:-mt-3 md:mb-3 shadow-[0_24px_60px_-30px_rgba(0,120,180,.6)]" : ""
              }`}
            >
              {p.recommended ? (
                <span className="absolute top-0 right-0 bg-[#FF9300] text-white font-bold text-[.7rem] tracking-[.08em] px-4 py-1 rounded-bl-[.7rem]">
                  おすすめ
                </span>
              ) : null}

              <div className={`${HEAD[p.accent]} text-white px-6 py-6 text-center`}>
                <h3 className="font-black text-[1.25rem]">{p.name}</h3>
                <p className="mt-2 text-[.75rem] leading-[1.6] text-white/90">{p.note}</p>
              </div>

              <div className={`${BODY[p.accent]} flex-1 px-6 py-7`}>
                <dl className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <dt className="font-bold text-[.9rem]">初期費用</dt>
                    <dd className="font-[family-name:var(--font-inter)] font-bold text-[#111]">
                      {p.initUnit ? (
                        <>
                          <span className="text-[1.9rem] leading-none text-[#0483B8]">{p.init}</span>
                          <span className="text-sm ml-0.5">{p.initUnit}</span>
                        </>
                      ) : (
                        <span className="text-[1.05rem]">{p.init}</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="font-bold text-[.9rem]">月額費用</dt>
                    <dd className="font-[family-name:var(--font-inter)] font-bold">
                      <span className="text-[1.9rem] leading-none text-[#0483B8]">{p.monthly}</span>
                      <span className="text-sm ml-0.5">{p.monthlyUnit}</span>
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="font-bold text-[.9rem]">利用料</dt>
                    <dd className="font-[family-name:var(--font-inter)] font-bold">
                      <span className="text-[1.9rem] leading-none text-[#0483B8]">{p.rate}</span>
                      <span className="text-sm ml-0.5">%</span>
                    </dd>
                  </div>
                </dl>
                <p className="mt-2 text-[.68rem] leading-[1.6] text-[#6b7280]">
                  ※利用料は会費が決済されたときのみ（Stripe決済手数料もサービス側が負担します）
                </p>

                <ul className="mt-5 pt-5 border-t border-black/10 space-y-2.5">
                  {p.features.map((f) => (
                    <li
                      key={f.label}
                      className={`flex items-center gap-2 text-[.85rem] ${
                        f.on ? "font-medium" : "text-[#9aa1ad]"
                      }`}
                    >
                      <Check on={f.on} />
                      {f.label}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-[.8rem] leading-[1.8] text-[#6b7280]">
          ※料率・条件は導入内容により調整する場合があります。まずはお気軽にご相談ください。
        </p>
      </div>
    </section>
  )
}
