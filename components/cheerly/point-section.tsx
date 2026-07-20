import { SectionHead } from "./section-head"
import { MaskIcon } from "./mask-icon"

const POINTS = [
  {
    no: "01",
    icon: "/cheerly/icons/fee.svg",
    title: "導入費用・月額 0円",
    body: "初期費用も月額も無料。かかるのは会費が決済されたときの利用料（決済額の10%）だけ。Stripeの決済手数料もこの中に含まれます。",
  },
  {
    no: "02",
    icon: "/cheerly/icons/speed.svg",
    title: "会員期間の管理と自動更新",
    body: "「入会日から1年」または「年度単位」を団体ごとに選択。年会費は自動更新で、更新の約1か月前にメールでお知らせします。",
  },
  {
    no: "03",
    icon: "/cheerly/icons/pay.svg",
    title: "Stripe Connectで安全な決済",
    body: "クレジットカードやStripe対応の決済・銀行振込に対応。団体ごとにStripe Connectアカウントを作成し、安全に集金・管理できます。",
  },
  {
    no: "04",
    icon: "/cheerly/icons/support.svg",
    title: "支援者はログイン不要で入会",
    body: "支援者はページからプランを選び、必要事項を入力して決済するだけ。ログイン不要で、保護者やOB・OG、地域の応援者がすぐ支援できます。",
  },
]

export function PointSection() {
  return (
    <section id="point" className="py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-7 md:px-8">
        <SectionHead kicker="Point">
          選ばれる<span className="text-[#1289c9]">4つの理由</span>
        </SectionHead>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {POINTS.map((p) => (
            <div
              key={p.no}
              className="relative overflow-hidden bg-white border border-[#e3e6ec] rounded-[.9rem] p-8"
            >
              <MaskIcon
                src={p.icon}
                className="absolute top-6 right-6 w-14 h-14 text-[#1289c9]"
              />
              <div className="font-[family-name:var(--font-inter)] font-extrabold text-red-500 text-[3.4rem] leading-[.8] tracking-[.02em]">
                {p.no}
              </div>
              <h4 className="mt-3 font-black text-[1.2rem] leading-[1.5]">{p.title}</h4>
              <p className="mt-3 text-[.88rem] leading-[1.9] text-[#333]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
