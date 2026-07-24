import Link from "next/link"
import { FlagMark } from "./flag-mark"

const NAV = [
  { href: "#purpose", label: "私たちの目的" },
  { href: "#about", label: "YOURFLAGとは" },
  { href: "#team", label: "団体にできること" },
  { href: "#supporter", label: "支援者の流れ" },
  { href: "#price", label: "料金プラン" },
  { href: "#faq", label: "よくある質問" },
]

const LEGAL = [
  { href: "/legal", label: "特定商取引法に基づく表記" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
  { href: "/refund", label: "返金について" },
  { href: "/contact", label: "お問い合わせ" },
]

export function YourflagFooter() {
  return (
    <footer className="bg-[#0f1730] text-[#cbd2e0] py-12">
      <div className="mx-auto w-full max-w-[1200px] px-7 md:px-8">
        <div className="flex flex-wrap justify-between gap-8">
          <div className="max-w-[22rem]">
            <div className="flex items-center gap-2 font-black text-[1.4rem]">
              <FlagMark className="w-8 h-7" />
              <span className="font-[family-name:var(--font-inter)] text-white">
                YOUR<span className="text-[#00B0F0]">FLAG</span>
              </span>
            </div>
            <p className="mt-3 text-[.8rem] leading-[1.7] text-[#8b95ab]">
              クラブ活動・スポーツ・文化団体と、その活動を応援する人をつなぐ継続支援プラットフォーム
            </p>
            <div className="mt-5 text-[.8rem] leading-[1.9] text-[#aab2c5]">
              <p className="font-bold text-white tracking-[.06em]">IK ALUMNI CGT</p>
              <p>細沼 笙 / 齋藤 遼</p>
              <p>
                <a
                  href="mailto:cgt.ik.est2022@gmail.com"
                  className="hover:text-white transition-colors break-all"
                >
                  cgt.ik.est2022@gmail.com
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
                <Link href={l.href} className="text-[#aab2c5] hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-6 text-[.72rem] text-[#6b7690]">
          © YOURFLAG — IK ALUMNI CGT / クラブ活動支援サービス
        </p>
      </div>
    </footer>
  )
}
