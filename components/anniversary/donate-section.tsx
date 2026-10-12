import { AnniversaryCard } from "@/components/anniversary/anniversary-card"

// 外部クラウドファンディングの URL が決まったらここに設定する（null の間は Coming Soon を表示）
const DONATE_URL: string | null = null

export function DonateSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <AnniversaryCard>
        {DONATE_URL ? (
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-base md:text-lg tracking-widest text-white border border-[#c9a227] rounded-full px-10 py-4 hover:bg-white/10 transition-colors"
          >
            支援する
          </a>
        ) : (
          <p
            className="text-2xl md:text-4xl font-bold tracking-widest text-white py-8"
            style={{ fontFamily: "var(--font-academy)" }}
          >
            Coming Soon
          </p>
        )}
      </AnniversaryCard>
    </div>
  )
}
