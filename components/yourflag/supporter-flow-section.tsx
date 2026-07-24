import { SectionHead } from "./section-head"
import { Reveal } from "./reveal"

const STEPS = [
  { no: "01", title: "団体ページへアクセス" },
  { no: "02", title: "応援したいプランを選択" },
  { no: "03", title: "必要事項を入力" },
  { no: "04", title: "オンラインで決済" },
  { no: "05", title: "支援スタート" },
]

const CARD = ["VISA", "JCB", "Mastercard", "AMEX"]
const MOBILE = ["Apple Pay", "Google Pay"]

export function SupporterFlowSection() {
  return (
    <section id="supporter" className="py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px] px-7 md:px-8">
        <Reveal>
          <SectionHead
            kicker="For Supporters"
            desc="YOURFLAGなら、支援者はスマートフォンから簡単に活動を応援できます。"
          >
            応援したい気持ちを、<span className="text-[#0483B8]">もっと簡単に</span>
          </SectionHead>
        </Reveal>

        {/* 5 steps */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.no} delay={i * 110} className="relative text-center">
                <div className="mx-auto grid place-items-center w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full bg-[#00B0F0] text-white shadow-[0_10px_24px_-12px_rgba(0,120,180,.7)]">
                  <span className="font-[family-name:var(--font-inter)] font-extrabold text-lg">
                    {s.no}
                  </span>
                </div>
                <p className="mt-3 font-bold text-[.82rem] leading-[1.5]">{s.title}</p>
                {i < STEPS.length - 1 ? (
                  <span
                    className="hidden md:block absolute top-8 left-[calc(50%+2.4rem)] right-[-1.1rem] h-[3px] bg-[#00B0F0]/30"
                    aria-hidden
                  />
                ) : null}
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <p className="mt-10 text-center font-black text-[#0483B8] leading-[1.5] text-[clamp(1.2rem,3.2vw,1.7rem)]">
            かんたん5ステップ。最短5分で支援できる流れ。
          </p>
        </Reveal>

        {/* payment methods */}
        <Reveal className="mx-auto max-w-[820px] mt-10 rounded-[1rem] border border-[#e3e6ec] bg-white px-6 md:px-8 py-7">
          <p className="text-center font-bold text-[.95rem] mb-6">《 各種決済方法にも対応 》</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-4">
            <div className="text-center">
              <p className="text-[.68rem] font-bold text-[#6b7280] tracking-[.08em] mb-2">
                クレジット決済
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {CARD.map((c) => (
                  <span
                    key={c}
                    className="font-[family-name:var(--font-inter)] font-bold text-[.72rem] text-[#333] border border-[#e3e6ec] rounded-[.4rem] px-3 py-2"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <span className="hidden md:block w-px self-stretch bg-[#e3e6ec]" aria-hidden />
            <div className="text-center">
              <p className="text-[.68rem] font-bold text-[#6b7280] tracking-[.08em] mb-2">
                モバイル決済
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {MOBILE.map((m) => (
                  <span
                    key={m}
                    className="font-[family-name:var(--font-inter)] font-bold text-[.72rem] text-[#333] border border-[#e3e6ec] rounded-[.4rem] px-3 py-2"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <span className="hidden md:block w-px self-stretch bg-[#e3e6ec]" aria-hidden />
            <div className="text-center">
              <p className="text-[.68rem] font-bold text-[#6b7280] tracking-[.08em] mb-2">または</p>
              <p className="font-bold text-[.85rem] leading-[1.6]">
                銀行振込
                <br />
                コンビニ決済
              </p>
              <p className="text-[.62rem] text-[#9aa1ad] mt-1">※コンビニ決済は順次スタート</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
