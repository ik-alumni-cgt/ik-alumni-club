"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Children } from "react"
import type { UseScrollAnimationOptions } from "@/hooks/use-scroll-animation"

type ScrollStaggerProps = {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
} & UseScrollAnimationOptions

function ScrollStagger({
  children,
  className = "",
  staggerDelay = 150,
  threshold,
  rootMargin,
}: ScrollStaggerProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, rootMargin })

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => (
        <div
          className={`scroll-fade-in ${isVisible ? "is-visible" : ""}`}
          style={{ transitionDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export { ScrollStagger }
