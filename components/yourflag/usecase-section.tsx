import { SectionHead } from "./section-head"
import { Reveal } from "./reveal"

const CASES = [
  {
    tag: "吹奏楽部",
    ph: "bg-gradient-to-br from-[#3ec6f5] via-[#00B0F0] to-[#0da4e6]",
    cat: "吹奏楽部 / 保護者・OBOG支援",
    title: "卒業生や保護者の応援を、継続的な支援に",
    body: "現金で集めていた会費や差し入れをオンライン化。応援したいOB・OGや保護者が、いつでも継続的に支援できる仕組みに。",
  },
  {
    tag: "スポーツクラブ",
    ph: "bg-gradient-to-br from-[#ffb347] via-[#FF9300] to-[#f57c00]",
    cat: "地域移行したスポーツクラブ",
    title: "地域移行で必要になった資金を安定確保",
    body: "地域移行で自ら資金を確保する必要が生じたチームへ。地域住民やファンからの支援を集め、活動を止めない土台をつくります。",
  },
  {
    tag: "文化団体",
    ph: "bg-gradient-to-br from-[#0da4e6] to-[#00B0F0]",
    cat: "文化団体 / OB・OG会",
    title: "OB・OGの応援をQRコードで募集",
    body: "紙とExcelの名簿を一本化。QRコードで支援者を募り、年会費は自動更新。毎年の徴収作業を軽くしながら応援の輪を広げます。",
  },
]

export function UsecaseSection() {
  return (
    <section id="case" className="py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px] px-7 md:px-8">
        <Reveal>
          <SectionHead
            kicker="Use Case"
            desc="サービス開始に向けて想定している活用シーンです。"
          >
            こんな<span className="text-[#0483B8]">シーン</span>で使えます
          </SectionHead>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {CASES.map((c, i) => (
            <Reveal
              key={c.tag}
              delay={i * 90}
              className="h-full bg-white border border-[#e3e6ec] rounded-[.9rem] overflow-hidden"
            >
              <div
                className={`aspect-[16/10] grid place-items-center text-white font-extrabold tracking-[.1em] ${c.ph}`}
              >
                {c.tag}
              </div>
              <div className="p-6">
                <p className="text-[.72rem] font-bold text-[#0483B8] tracking-[.08em]">{c.cat}</p>
                <h4 className="mt-2 font-black text-[1.05rem] leading-[1.5]">{c.title}</h4>
                <p className="mt-3 text-[.83rem] leading-[1.8] text-[#444]">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
