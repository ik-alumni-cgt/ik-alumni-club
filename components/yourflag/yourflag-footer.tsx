import Image from "next/image"

const NAV = [
  { href: "#purpose", label: "私たちの目的" },
  { href: "#about", label: "YOURFLAGとは" },
  { href: "#team", label: "団体にできること" },
  { href: "#supporter", label: "支援者の流れ" },
  { href: "#price", label: "料金プラン" },
  { href: "#faq", label: "よくある質問" },
]

// 法的文面は YOURFLAG 専用ページ（ドメイン取得までは LP と同じドメイン上に置く）
const LEGAL = [
  { href: "/yourflag/tokushoho", label: "特定商取引法に基づく表記" },
  { href: "/yourflag/privacy", label: "プライバシーポリシー" },
  { href: "/yourflag/terms", label: "会員規約" },
]

export function YourflagFooter() {
  return (
    <footer className="bg-[#0f1730] text-[#cbd2e0] py-12">
      <div className="mx-auto w-full max-w-[1200px] px-7 md:px-8">
        <div className="flex flex-wrap justify-between gap-8">
          <div className="max-w-[22rem]">
            <Image
              src="/yourflag/logo/logo-horizontal.png"
              alt="YOURFLAG クラブ活動支援サービス"
              width={1150}
              height={240}
              className="h-9 w-auto"
            />
            <p className="mt-3 text-[.8rem] leading-[1.7] text-[#8b95ab]">
              クラブ活動・スポーツ・文化団体と、その活動を応援する人をつなぐ継続支援プラットフォーム
            </p>
            <div className="mt-5 text-[.8rem] leading-[1.9] text-[#aab2c5]">
              <p className="font-bold text-white tracking-[.06em]">運営: 細沼 笙</p>
              <p>
                <a
                  href="mailto:yourflag.est2026@gmail.com"
                  className="hover:text-white transition-colors break-all"
                >
                  yourflag.est2026@gmail.com
                </a>
              </p>
            </div>
          </div>
          <nav>
            <ul className="flex flex-col gap-3 text-[.85rem] font-semibold">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-white transition-colors">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <nav className="mt-8 pt-6 border-t border-white/10">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[.78rem] font-semibold">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-[#aab2c5] hover:text-white transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-6 text-[.72rem] text-[#6b7690]">
          © YOURFLAG / 運営 細沼 笙
        </p>
      </div>
    </footer>
  )
}
