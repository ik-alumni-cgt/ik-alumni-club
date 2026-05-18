"use client"

import { useRef, useEffect, useState, type RefObject } from "react"

type UseScrollAnimationOptions = {
  threshold?: number
  rootMargin?: string
}

function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
): { ref: RefObject<T | null>; isVisible: boolean } {
  // threshold は 0 にする。観測対象が画面より大幅に高い（スマホの縦長グリッド等）と
  // 交差率が threshold に到達せず発火しないため。0 なら要素の高さに関係なく発火する。
  const { threshold = 0, rootMargin = "0px 0px -50px 0px" } = options
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mediaQuery.matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isVisible }
}

export { useScrollAnimation }
export type { UseScrollAnimationOptions }
