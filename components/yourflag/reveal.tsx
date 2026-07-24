"use client"

import { type ReactNode } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

type Props = {
  children: ReactNode
  className?: string
  /** 表示開始までの遅延（ms）。カードのスタッガーに使う。 */
  delay?: number
  /** 立ち上がりの移動量（px）。デフォルトは下から。 */
  y?: number
}

// スクロールで一度だけふわっと表示する簡易リビール。
// 交差判定と prefers-reduced-motion の考慮は共通フック useScrollAnimation に委譲する。
export function Reveal({ children, className, delay = 0, y = 24 }: Props) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : `translateY(${y}px)`,
        transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.22,.61,.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  )
}
