"use client"

import { useState } from "react"
import Link from "next/link"

const NAV = [
  { href: "#service", label: "サービス" },
  { href: "#point", label: "選ばれる4つの理由" },
  { href: "#flow", label: "ご利用の流れ" },
  { href: "#case", label: "活用シーン" },
  { href: "#faq", label: "よくある質問" },
]

function LogoMark() {
  return (
    <span className="grid place-items-center w-8 h-8 rounded-[0.55rem] bg-[#1289c9] shrink-0">
      <svg viewBox="0 0 24 24" className="w-[1.15rem] h-[1.15rem]" fill="none">
        <path
          d="M18.3 1L10 15.4c0-3.4-4.2-7.3-8.3-11.2C1.7 1 4.6 2.5 10 .8 15.5-.9 18.3 1 18.3 1Z"
          fill="#bfe6f5"
        />
        <path d="M21 1L7.5 24l2.7.1L23.7 1H21Z" fill="#fff" />
      </svg>
    </span>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path
        d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="m3 7 9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function CheerlyHeader() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 left-0 z-[100] flex items-center justify-between bg-white px-5 md:px-9 py-3 w-full shadow-[0_1px_0_rgba(17,17,17,.06)]">
      <a href="#" className="flex items-center gap-2 font-black text-[1.6rem] tracking-[.02em]" aria-label="Cheerly トップ">
        <LogoMark />
        <span className="font-[family-name:var(--font-inter)]">
          Cheer<span className="text-[#1289c9]">ly</span>
        </span>
      </a>

      {/* desktop nav */}
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
        <ul className="flex items-center gap-5 xl:gap-7">
          {NAV.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                className="text-[.82rem] font-bold tracking-[.1em] hover:text-[#1289c9] transition-colors"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 bg-[#111] text-white font-bold text-[.82rem] tracking-[.1em] rounded px-6 py-3 hover:bg-[#1289c9] transition-colors"
        >
          <MailIcon />
          お問い合わせ
        </a>
        <Link
          href="/legal"
          className="text-[.6rem] text-[#9aa1ad] font-bold tracking-[.12em] border border-[#e3e6ec] px-2 py-1.5 rounded-[.35rem] hover:text-[#1289c9] transition-colors"
        >
          特定商取引法に基づく表記
        </Link>
      </nav>

      {/* mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden relative w-10 h-4 shrink-0"
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={open}
        aria-controls="cheerly-mobile-nav"
      >
        <span
          className={`absolute left-0 h-0.5 w-full rounded bg-[#111] transition-all ${open ? "top-1/2 -translate-y-1/2 rotate-[28deg]" : "top-0"}`}
        />
        <span
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full rounded bg-[#111] transition-opacity ${open ? "opacity-0" : "opacity-100"}`}
        />
        <span
          className={`absolute left-0 h-0.5 w-full rounded bg-[#111] transition-all ${open ? "top-1/2 -translate-y-1/2 -rotate-[28deg]" : "bottom-0"}`}
        />
      </button>

      {/* mobile panel */}
      <nav
        id="cheerly-mobile-nav"
        className={`lg:hidden fixed inset-x-0 top-[3.4rem] bottom-0 bg-white overflow-y-auto px-7 pt-6 pb-12 shadow-[-10px_0_30px_rgba(0,0,0,.08)] transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <ul className="flex flex-col">
          {NAV.map((n) => (
            <li key={n.href} className="border-b border-[#e3e6ec]">
              <a href={n.href} onClick={close} className="block py-5 px-1 text-base font-bold tracking-[.08em]">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          onClick={close}
          className="mt-8 flex items-center justify-center gap-2 bg-[#111] text-white font-bold text-base rounded h-14 tracking-[.08em]"
        >
          <MailIcon />
          お問い合わせ
        </a>
        <Link
          href="/legal"
          className="mt-6 block text-center text-xs text-[#9aa1ad] font-bold tracking-[.12em]"
        >
          特定商取引法に基づく表記
        </Link>
      </nav>
    </header>
  )
}
