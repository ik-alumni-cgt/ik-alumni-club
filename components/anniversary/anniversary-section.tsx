import { AnniversaryFadeIn } from "@/components/anniversary/anniversary-fade-in"

interface AnniversarySectionProps {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}

export function AnniversarySection({
  id,
  title,
  children,
  className = "",
}: AnniversarySectionProps) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 scroll-mt-16 ${className}`}
    >
      <div className="container mx-auto px-4">
        <AnniversaryFadeIn>
          {/* セクションタイトル */}
          <h2
            className="text-2xl md:text-4xl font-bold text-center tracking-widest mb-12 md:mb-16"
            style={{ fontFamily: "var(--font-academy)" }}
          >
            {title}
          </h2>

          {/* コンテンツ領域 */}
          {children}
        </AnniversaryFadeIn>
      </div>
    </section>
  )
}
