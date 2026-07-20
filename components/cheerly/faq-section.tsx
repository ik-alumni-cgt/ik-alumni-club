import { SectionHead } from "./section-head"

const QA = [
  {
    q: "導入に費用はかかりますか？",
    a: "初期費用・月額費用は無料です。会費が決済されたときに、決済額の10%（Stripe決済手数料込み）をサービス利用料としていただきます。Stripeの手数料は当社が利用料の中から負担します。",
  },
  {
    q: "どんな団体が使えますか？",
    a: "学校の部活動、地域クラブ、スポーツクラブ、文化団体など、幅広い団体にご利用いただけます。今後は他の非営利団体や地域コミュニティへも対応を広げていきます。",
  },
  {
    q: "決済方法は何に対応していますか？",
    a: "クレジットカードをはじめ、Stripe対応の各種決済・銀行振込に対応します。団体ごとにStripeのアカウントを作成し、安全に決済を管理します。",
  },
  {
    q: "会員の管理もできますか？",
    a: "会員名簿の一元管理、年会費プランの作成、入金状況の確認、CSV取込などに対応します。年会費は自動更新を基本とし、更新の約1か月前にメールでお知らせします。",
  },
  {
    q: "会員期間はどう設定できますか？",
    a: "「入会日から1年間」または「年度単位（例：4月〜翌年3月）」を団体ごとに選べます。年間を通していつでも入会を受け付けられますが、年度途中の入会でも会費の割引や日割りは行いません。",
  },
  {
    q: "申込フォームは自由に作れますか？",
    a: "団体ごとに項目を自由に設定できます。氏名・メールアドレスを基本項目に、住所・電話番号・卒業年度・続柄・応援メッセージなどを追加でき、必須設定や表示・非表示、表示順も調整できます。",
  },
  {
    q: "支援者はログインが必要ですか？返金はできますか？",
    a: "初回リリースでは支援者のログインは不要です。団体ページでプランを選び、必要事項を入力して決済するだけで入会が完了します。返金が必要な場合は、団体の管理画面から全額返金に対応できます。",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-7 md:px-8">
        <SectionHead kicker="FAQ">
          よくある<span className="text-[#1289c9]">質問</span>
        </SectionHead>

        <div className="mx-auto max-w-[820px]">
          {QA.map((item, i) => (
            <details
              key={i}
              className="group bg-white border border-[#e3e6ec] rounded-[.7rem] mb-4 overflow-hidden"
              open={i === 0}
            >
              <summary className="flex items-center gap-4 px-6 py-5 font-bold cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="font-[family-name:var(--font-inter)] font-extrabold text-[#1289c9]">Q</span>
                <span className="flex-1">{item.q}</span>
                <svg
                  viewBox="0 0 16 16"
                  className="w-5 h-5 text-[#1289c9] transition-transform group-open:rotate-180"
                  fill="none"
                >
                  <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <div className="px-6 pb-6 pl-[3.4rem] text-[.9rem] leading-[1.9] text-[#333]">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
