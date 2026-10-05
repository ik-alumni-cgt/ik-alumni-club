import Image from "next/image"
import { AnniversaryFadeIn } from "@/components/anniversary/anniversary-fade-in"

export function AnniversaryHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-16">
      <h1 className="sr-only">IK ALUMNI CGT 5th Anniversary concert</h1>

      {/* メインビジュアル（ティザー完成版） */}
      <AnniversaryFadeIn>
        <Image
          src="/anniversary/hero.webp"
          alt="IK ALUMNI CGT 5th Anniversary concert 2027.2.7 SUN OPEN 14:30 START 15:30 柏市民文化会館 大ホール"
          width={1200}
          height={1606}
          priority
          sizes="(min-width: 768px) 600px, 90vw"
          className="relative z-10 w-auto h-auto max-h-[85vh] max-w-full"
        />
      </AnniversaryFadeIn>

      {/* スクロール促進の矢印 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  )
}
