import { HeroBubbles } from "./hero-bubbles"

const CHIPS = [
  "その活動を、ずっと応援したい",
  "OB・OGとして力になりたい",
  "会費をオンラインで集めたい",
  "名簿を一元管理したい",
  "現金集金をやめたい",
]

const STATS = [
  { label: "初期費用", num: "0", unit: "円" },
  { label: "月額費用", num: "0", unit: "円" },
  { label: "利用料", num: "10", unit: "%" },
]

export function YourflagHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#3ec6f5] via-[#00B0F0] to-[#0da4e6] py-12 md:py-20">
      <HeroBubbles />

      <style>{`
        @keyframes yf-hero-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        .yf-hero-rise{opacity:0;animation:yf-hero-rise .7s cubic-bezier(.22,.61,.36,1) both}
        @media (prefers-reduced-motion: reduce){.yf-hero-rise{opacity:1;animation:none}}
      `}</style>

      <div className="relative z-[2] mx-auto w-full max-w-[1200px] px-7 md:px-8 text-center">
        <span className="yf-hero-rise inline-block bg-white border border-[#00B0F0] text-[#0483B8] font-bold text-[.9rem] tracking-[.08em] rounded-full px-6 py-1.5">
          クラブ・スポーツ・文化団体と、その応援者へ
        </span>

        <h1 className="yf-hero-rise mt-6 text-white font-black leading-[1.35] tracking-[.02em] text-[clamp(1.9rem,5.4vw,3.4rem)]" style={{ animationDelay: ".1s" }}>
          クラブ活動を、
          <br />
          <span className="relative inline-block">
            <span className="relative z-[1]">ずっと応援できる</span>
            <span className="absolute inset-x-[-2%] bottom-[.08em] h-[.42em] rounded-sm bg-[#FF9300]/70" />
          </span>
          仕組み。
        </h1>

        <p className="yf-hero-rise mt-6 text-white font-bold leading-[1.9] text-[clamp(1rem,2.2vw,1.25rem)]" style={{ animationDelay: ".2s" }}>
          クラブ活動・スポーツ・文化団体と、その活動を応援する人をつなぐ。
          <br />
          一時的な支援ではなく、継続的な支援へ。
        </p>

        {/* mobile chips */}
        <div className="lg:hidden mt-6 flex gap-3 overflow-x-auto pb-1 -mx-7 px-7 snap-x [scrollbar-width:none]" aria-hidden>
          {CHIPS.map((c) => (
            <div
              key={c}
              className="shrink-0 snap-center bg-white text-[#0483B8] font-bold text-[.8rem] text-center rounded px-4 py-3 min-w-[11rem] leading-[1.5]"
            >
              {c}
            </div>
          ))}
        </div>

        <dl className="yf-hero-rise mx-auto mt-9 grid grid-cols-3 w-full max-w-[560px] rounded-[.9rem] bg-white py-4 md:py-5 shadow-[0_12px_40px_-18px_rgba(0,120,180,.5)]" style={{ animationDelay: ".32s" }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`text-center px-2 md:px-4 ${i > 0 ? "border-l border-[#e3e6ec]" : ""}`}
            >
              <dt className="font-bold text-[.9rem]">{s.label}</dt>
              <dd className="mt-2 flex items-end justify-center gap-0.5 font-bold">
                <span className="invisible" aria-hidden>
                  {s.unit}
                </span>
                <span className="font-[family-name:var(--font-inter)] font-semibold text-[#00B0F0] leading-[.9] text-[clamp(2rem,5vw,2.9rem)]">
                  {s.num}
                </span>
                <span>{s.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-center text-[.7rem] font-semibold text-white/90">
          ※ベーシックプランの場合。利用料は会費が決済されたときのみ（Stripe決済手数料込み）
        </p>
      </div>
    </section>
  )
}
