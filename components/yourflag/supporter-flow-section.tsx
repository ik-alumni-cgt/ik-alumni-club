import Image from "next/image"
import { SectionHead } from "./section-head"
import { Reveal } from "./reveal"

const STEPS = [
  { no: "01", title: "団体ページへアクセス" },
  { no: "02", title: "応援したいプランを選択" },
  { no: "03", title: "必要事項を入力" },
  { no: "04", title: "オンラインで決済" },
  { no: "05", title: "支援スタート" },
]

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
        <Reveal className="mx-auto max-w-[820px] mt-10">
          <p className="text-center font-bold text-[.95rem] mb-6">《 各種決済方法にも対応 》</p>
          <Image
            src="/yourflag/logo/payment-methods.png"
            alt="対応決済方法。クレジット決済（VISA、JCB、Mastercard、American Express）、モバイル決済（Apple Pay、Google Pay）、または銀行振込・コンビニ決済（コンビニ決済は順次スタート）"
            width={1640}
            height={238}
            className="w-full h-auto"
          />
        </Reveal>
      </div>
    </section>
  )
}
