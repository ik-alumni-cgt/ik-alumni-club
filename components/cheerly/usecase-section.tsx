import { SectionHead } from "./section-head"

const CASES = [
  {
    tag: "吹奏楽部",
    ph: "bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500",
    cat: "吹奏楽部 / 保護者会費",
    title: "保護者会の年会費をオンライン徴収に",
    body: "現金で集めていた保護者会費をカード決済に。名簿と入金状況を一元管理でき、集金と確認の手間を減らせます。",
  },
  {
    tag: "スポーツクラブ",
    ph: "bg-gradient-red",
    cat: "地域スポーツクラブ / 会費",
    title: "現金集金をやめ、入金確認をゼロに",
    body: "地域移行したチームの会費をオンライン化。誰が支払ったかがひと目で分かり、督促や記帳の手間を減らせます。",
  },
  {
    tag: "文化団体",
    ph: "bg-gradient-to-br from-cyan-600 to-cyan-400",
    cat: "文化団体 / OB・OG会費",
    title: "OB・OG会費をQRコードで募集",
    body: "紙とExcelの名簿を一本化。QRコードで会員を募り、年会費は自動更新。毎年の徴収作業を軽くできます。",
  },
]

export function UsecaseSection() {
  return (
    <section id="case" className="py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-7 md:px-8">
        <SectionHead
          kicker="Use Case"
          desc="サービス開始に向けて想定している活用シーンです。"
        >
          こんな<span className="text-[#1289c9]">シーン</span>で使えます
        </SectionHead>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {CASES.map((c) => (
            <div key={c.tag} className="bg-white border border-[#e3e6ec] rounded-[.9rem] overflow-hidden">
              <div
                className={`aspect-[16/10] grid place-items-center text-white font-extrabold tracking-[.1em] ${c.ph}`}
              >
                {c.tag}
              </div>
              <div className="p-6">
                <p className="text-[.72rem] font-bold text-[#1289c9] tracking-[.08em]">{c.cat}</p>
                <h4 className="mt-2 font-black text-[1.05rem] leading-[1.5]">{c.title}</h4>
                <p className="mt-3 text-[.83rem] leading-[1.8] text-[#444]">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
