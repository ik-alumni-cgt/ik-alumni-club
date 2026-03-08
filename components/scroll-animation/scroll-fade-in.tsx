"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import type { UseScrollAnimationOptions } from "@/hooks/use-scroll-animation"

type ScrollFadeInProps = {
  children: React.ReactNode
  className?: string
  delay?: number
} & UseScrollAnimationOptions

function ScrollFadeIn({
  children,
  className = "",
  delay = 0,
  threshold,
  rootMargin,
}: ScrollFadeInProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, rootMargin })

  return (
    <div
      ref={ref}
      className={`scroll-fade-in ${isVisible ? "is-visible" : ""} ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

export { ScrollFadeIn }
