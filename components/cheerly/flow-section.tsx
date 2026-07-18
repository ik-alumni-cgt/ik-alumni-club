import { SectionHead } from "./section-head"

const STEPS = [
  {
    no: "1",
    title: "お問い合わせ",
    body: "フォームからご連絡ください。やりたいことをヒアリングし、最適なプランをご提案します。",
  },
  {
    no: "2",
    title: "ページ・会費プラン・フォーム設定",
    body: "団体ページ・年会費プラン・申込フォームを設定。募集項目や必須設定は自由にカスタマイズできます。",
  },
  {
    no: "3",
    title: "公開・会費の受付開始",
    body: "URL・QRコードを発行してすぐに共有。オンラインで会費・入会の受付を開始できます。",
  },
]

export function FlowSection() {
  return (
    <section
      id="flow"
      className="bg-[radial-gradient(#d7dbe4_1.3px,transparent_1.3px)] [background-size:18px_18px] py-14 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px] px-7 md:px-8">
        <SectionHead
          kicker="Flow"
          desc="お問い合わせから公開まで、難しい設定はいりません。"
        >
          ご利用の<span className="text-[#1289c9]">流れ</span>
        </SectionHead>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {STEPS.map((s) => (
            <div key={s.no} className="relative bg-[#f4f5f7] rounded-[.9rem] px-6 py-8 text-center">
              <div className="grid place-items-center w-10 h-10 mx-auto rounded-full bg-[#1289c9] text-white font-[family-name:var(--font-inter)] font-extrabold">
                {s.no}
              </div>
              <h4 className="mt-4 font-black text-[1.05rem]">{s.title}</h4>
              <p className="mt-3 text-[.85rem] leading-[1.8] text-[#333]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
