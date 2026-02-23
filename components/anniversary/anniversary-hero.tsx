import Image from "next/image"
import logo from "@/components/header/logo_main.png"
import { AnniversaryFadeIn } from "@/components/anniversary/anniversary-fade-in"

export function AnniversaryHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* メインコンテンツ */}
      <AnniversaryFadeIn>
        <div className="relative z-10 text-center flex flex-col items-center">
          <Image
            src={logo}
            alt="IK ALUMNI COLOR GUARD TEAM"
            width={150}
            height={150}
            className="mb-6"
          />
          <h1
            className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-widest mb-4"
            style={{ fontFamily: "var(--font-academy)" }}
          >
            5th ANNIVERSARY
          </h1>
          <p className="text-sm md:text-lg text-white/70 tracking-wider">
            五周年記念コンサート
          </p>
        </div>
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
