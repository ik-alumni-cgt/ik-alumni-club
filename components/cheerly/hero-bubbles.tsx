"use client"

import { useEffect, useRef } from "react"

const WISHES = [
  "会費をオンラインで集めたい",
  "名簿を一元管理したい",
  "入金確認の手作業をなくしたい",
  "現金集金をやめたい",
  "申込をフォーム化したい",
  "引き継ぎを楽にしたい",
  "年会費を自動更新したい",
  "QRコードで会員を募りたい",
  "会員データを安全に守りたい",
  "応援者との接点を増やしたい",
]

// 6つのバブルの初期表示と配置
const BUBBLES = [
  { text: WISHES[0], pos: "top-[8%] left-[2%]", delay: "0s" },
  { text: WISHES[1], pos: "top-[4%] right-[3%]", delay: ".6s" },
  { text: WISHES[2], pos: "top-[34%] left-[-1%]", delay: "1.1s" },
  { text: WISHES[3], pos: "top-[30%] right-[-1%]", delay: "1.6s" },
  { text: WISHES[4], pos: "bottom-[16%] left-[3%]", delay: ".9s" },
  { text: WISHES[5], pos: "bottom-[12%] right-[4%]", delay: "1.4s" },
]

const DECOS = [
  { pos: "top-[6%] left-[22%] w-[26px]", d: "M18 0H10v10H0v8h10v10h8V18h10v-8H18V0Z" },
  { pos: "bottom-[10%] left-[28%] w-[24px]", d: "M14 0 28 14 14 28 0 14 14 0Z" },
  { pos: "bottom-[16%] right-[26%] w-[24px]", d: "M18 0H10v10H0v8h10v10h8V18h10v-8H18V0Z" },
]

export function HeroBubbles() {
  const refs = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    const timers = refs.current.map((el, i) => {
      if (!el) return null
      let idx = BUBBLES.length + i
      return window.setInterval(() => {
        el.style.opacity = "0"
        window.setTimeout(() => {
          el.textContent = WISHES[idx % WISHES.length]
          el.style.opacity = "1"
          idx += 1
        }, 500)
      }, 4200 + i * 700)
    })
    return () => timers.forEach((t) => t && window.clearInterval(t))
  }, [])

  return (
    <div className="hidden lg:block absolute inset-0 z-[1] pointer-events-none" aria-hidden>
      <style>{"@keyframes cheerly-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}"}</style>
      {BUBBLES.map((b, i) => (
        <div
          key={i}
          className={`absolute ${b.pos} bg-white rounded-[.7rem] px-[1.2rem] py-[.7rem] shadow-[0_10px_30px_-12px_rgba(27,80,224,.4)]`}
          style={{ animation: `cheerly-float 5s ease-in-out ${b.delay} infinite` }}
        >
          <span
            ref={(el) => {
              refs.current[i] = el
            }}
            className="block text-[#1289c9] font-bold text-[.9rem] leading-[1.5] text-center transition-opacity duration-500"
          >
            {b.text}
          </span>
        </div>
      ))}
      {DECOS.map((d, i) => (
        <svg key={`d${i}`} viewBox="0 0 28 28" className={`absolute ${d.pos} text-white/85`}>
          <path d={d.d} fill="currentColor" />
        </svg>
      ))}
    </div>
  )
}
