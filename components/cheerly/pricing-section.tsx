import { SectionHead } from "./section-head"

const FUTURE = [
  "月額会費",
  "単発寄付",
  "イベント管理",
  "グッズ販売",
  "活動報告",
  "お知らせ配信",
  "支援者マイページ",
  "デジタル会員証",
  "複数団体への支援",
]

export function PricingSection() {
  return (
    <section
      id="price"
      className="bg-[radial-gradient(#d7dbe4_1.3px,transparent_1.3px)] [background-size:18px_18px] py-14 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px] px-7 md:px-8">
        <SectionHead
          kicker="Price"
          desc="導入リスクはゼロ。支援が集まったときだけ、その一部をいただきます。"
        >
          料金<span className="text-[#1289c9]">プラン</span>
        </SectionHead>

        <div className="mx-auto max-w-[760px] bg-white border-2 border-[#1289c9] rounded-2xl px-8 md:px-12 py-8 md:py-12 text-center shadow-[0_20px_60px_-30px_rgba(18,137,201,.45)]">
          <span className="inline-block bg-[#1289c9] text-white font-bold text-[.8rem] rounded-full px-5 py-1.5">
            団体側の費用
          </span>
          <div className="mt-7 flex flex-wrap justify-center gap-4 md:gap-12">
            {[
              { k: "初期費用", v: "0", u: "円" },
              { k: "月額費用", v: "0", u: "円" },
            ].map((p) => (
              <div key={p.k}>
                <div className="font-bold text-[.9rem]">{p.k}</div>
                <div className="font-[family-name:var(--font-inter)] font-bold text-[#1289c9] text-[2.4rem] leading-[1.1]">
                  {p.v}
                  <span className="text-base text-[#111]">{p.u}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-7 font-bold text-[1.05rem]">
            サービス利用料は決済額の{" "}
            <b className="font-[family-name:var(--font-inter)] text-[#1289c9] text-[1.6rem]">10</b>%（Stripe決済手数料込み）
          </p>
          <p className="mt-3 text-[.82rem] leading-[1.8] text-[#6b7280]">
            ※Stripeの決済手数料は、利用料の中から当社が負担します。
            <br />
            ※料率・条件は導入内容により調整する場合があります。
          </p>
        </div>

        <div className="mx-auto max-w-[900px] mt-10 md:mt-14 text-center">
          <p className="font-black leading-[1.5] tracking-[.05em] text-[clamp(1.2rem,3vw,1.6rem)]">
            将来は、団体運営全体を支えるプラットフォームへ。
          </p>
          <p className="mt-3 text-[.85rem] leading-[1.8] text-[#6b7280]">
            初回リリースは「会員管理」と「年会費徴収」に集中。以下は今後の追加を予定している機能です。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {FUTURE.map((f) => (
              <span
                key={f}
                className="bg-white border border-dashed border-[#e3e6ec] text-[#6b7280] font-bold text-[.85rem] px-5 py-3 rounded-[.5rem]"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
