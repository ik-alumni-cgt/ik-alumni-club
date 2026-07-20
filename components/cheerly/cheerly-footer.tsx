import Link from "next/link"

const NAV = [
  { href: "#service", label: "サービス" },
  { href: "#point", label: "選ばれる理由" },
  { href: "#flow", label: "ご利用の流れ" },
  { href: "#case", label: "活用シーン" },
  { href: "#faq", label: "よくある質問" },
  { href: "#contact", label: "お問い合わせ" },
]

const LEGAL = [
  { href: "/legal", label: "特定商取引法に基づく表記" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
  { href: "/refund", label: "返金について" },
  { href: "/contact", label: "お問い合わせ" },
]

export function CheerlyFooter() {
  return (
    <footer className="bg-[#0f1730] text-[#cbd2e0] py-12">
      <div className="mx-auto w-full max-w-[1200px] px-7 md:px-8">
        <div className="flex flex-wrap justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 font-black text-[1.5rem]">
              <span className="grid place-items-center w-8 h-8 rounded-[.55rem] bg-[#1289c9]">
                <svg viewBox="0 0 24 24" className="w-[1.15rem] h-[1.15rem]" fill="none">
                  <path
                    d="M18.3 1L10 15.4c0-3.4-4.2-7.3-8.3-11.2C1.7 1 4.6 2.5 10 .8 15.5-.9 18.3 1 18.3 1Z"
                    fill="#bfe6f5"
                  />
                  <path d="M21 1L7.5 24l2.7.1L23.7 1H21Z" fill="#fff" />
                </svg>
              </span>
              <span className="font-[family-name:var(--font-inter)] text-white">
                Cheer<span className="text-red-500">ly</span>
              </span>
            </div>
            <p className="mt-3 text-[.8rem] text-[#8b95ab]">
              クラブ・スポーツ・文化団体の活動を応援するプラットフォーム
            </p>
          </div>
          <nav>
            <ul className="flex flex-wrap gap-x-5 gap-y-3 text-[.85rem] font-semibold">
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

        <p className="mt-6 text-[.72rem] text-[#6b7690]">© Cheerly — 齋藤 遼 / 後援会支援サービス</p>
      </div>
    </footer>
  )
}
