import { SectionHead } from "./section-head"
import { MaskIcon } from "./mask-icon"
import { Reveal } from "./reveal"

const ITEMS = [
  {
    no: "1",
    icon: "/yourflag/icons/support.svg",
    title: "団体ページ作成",
    body: "YOURFLAG内に団体専用のページを作成。URLや二次元コードを共有するだけで、支援者が簡単にアクセスできます。",
  },
  {
    no: "2",
    icon: "/yourflag/icons/fee.svg",
    title: "会費プラン設定",
    body: "団体ごとに複数のプランを設定。団体の活動に合わせて、自由に支援プランを設計できます。",
  },
  {
    no: "3",
    icon: "/yourflag/icons/pay.svg",
    title: "オンライン決済",
    body: "支援者はオンラインで簡単に入会・決済。会費の徴収にかかる団体側の負担を軽減します。",
  },
  {
    no: "4",
    icon: "/yourflag/icons/speed.svg",
    title: "会員管理",
    body: "会員情報や支払状況をオンラインで一元管理。Excelや紙での管理から脱却し、担当者が変わっても引き継ぎやすい環境をつくります。",
  },
]

export function TeamCanSection() {
  return (
    <section
      id="team"
      className="bg-[radial-gradient(#d7dbe4_1.3px,transparent_1.3px)] [background-size:18px_18px] py-14 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1100px] px-7 md:px-8">
        <Reveal>
          <SectionHead
            kicker="For Teams"
            desc="団体は、YOURFLAG上でこんなことができます。"
          >
            団体に<span className="text-[#0483B8]">できること</span>
          </SectionHead>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {ITEMS.map((it, i) => (
            <Reveal
              key={it.no}
              delay={i * 90}
              className="relative flex gap-5 h-full bg-white border border-[#e3e6ec] rounded-[.9rem] p-6 md:p-7"
            >
              <div className="shrink-0">
                <div className="grid place-items-center w-11 h-11 rounded-[.7rem] bg-[#FF9300] text-white font-[family-name:var(--font-inter)] font-extrabold text-lg">
                  {it.no}
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <MaskIcon src={it.icon} className="w-6 h-6 text-[#00B0F0] shrink-0" />
                  <h4 className="font-black text-[1.15rem] leading-[1.4]">{it.title}</h4>
                </div>
                <p className="mt-2 text-[.88rem] leading-[1.9] text-[#333]">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
