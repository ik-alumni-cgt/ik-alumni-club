import { HeroBubbles } from "./hero-bubbles"

const CHIPS = [
  "会費をオンラインで集めたい",
  "名簿を一元管理したい",
  "入金確認の手作業をなくしたい",
  "現金集金をやめたい",
  "申込をフォーム化したい",
]

const STATS = [
  { label: "初期費用", num: "0", unit: "円" },
  { label: "月額費用", num: "0", unit: "円" },
  { label: "利用料", num: "10", unit: "%" },
]

export function CheerlyHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500 py-12 md:py-20">
      <HeroBubbles />

      <div className="relative z-[2] mx-auto w-full max-w-[1200px] px-7 md:px-8 text-center">
        <span className="inline-block bg-white border border-[#1289c9] text-[#1289c9] font-bold text-[.9rem] tracking-[.12em] rounded-full px-6 py-1.5">
          クラブ・スポーツ・文化団体の運営者さまへ
        </span>

        <h1 className="mt-6 text-white font-black leading-[1.35] tracking-[.02em] text-[clamp(1.9rem,5.4vw,3.4rem)]">
          会員管理と会費徴収を、
          <br />
          <span className="relative inline-block">
            <span className="relative z-[1]">まるごとオンライン</span>
            <span className="absolute inset-x-[-2%] bottom-[.08em] h-[.42em] rounded-sm bg-white/[.34]" />
          </span>
          に。
        </h1>

        <p className="mt-6 text-white font-bold leading-[1.9] text-[clamp(1rem,2.2vw,1.25rem)]">
          現金・Excel・手作業の運営から卒業。
          <br />
          会員名簿から年会費の集金まで、これ1つで。
        </p>

        {/* mobile chips */}
        <div className="lg:hidden mt-6 flex gap-3 overflow-x-auto pb-1 -mx-7 px-7 snap-x [scrollbar-width:none]" aria-hidden>
          {CHIPS.map((c) => (
            <div
              key={c}
              className="shrink-0 snap-center bg-white text-[#1289c9] font-bold text-[.8rem] text-center rounded px-4 py-3 min-w-[11rem] leading-[1.5]"
            >
              {c}
            </div>
          ))}
        </div>

        <dl className="mx-auto mt-9 flex w-fit max-md:w-full items-stretch gap-6 md:gap-9 rounded-[.9rem] bg-white px-6 md:px-10 py-4 md:py-5 shadow-[0_12px_40px_-18px_rgba(27,80,224,.5)] max-[560px]:flex-col">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex-1 text-center px-2 ${i > 0 ? "border-l border-[#e3e6ec] max-[560px]:border-l-0 max-[560px]:border-t max-[560px]:pt-4" : ""}`}
            >
              <dt className="font-bold text-[.9rem]">{s.label}</dt>
              <dd className="mt-2 flex items-end justify-center gap-0.5 font-bold">
                <span className="font-[family-name:var(--font-inter)] font-semibold text-[#1289c9] leading-[.9] text-[clamp(2rem,5vw,2.9rem)]">
                  {s.num}
                </span>
                <span>{s.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-center text-[.7rem] font-semibold text-white/90">
          ※利用料は会費が決済されたときのみ（Stripe決済手数料込み）
        </p>
      </div>
    </section>
  )
}
