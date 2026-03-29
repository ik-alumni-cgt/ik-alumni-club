import { AnniversaryCard } from "@/components/anniversary/anniversary-card"

export function GoodsSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <AnniversaryCard>
        <p
          className="text-2xl md:text-4xl font-bold tracking-widest text-white py-8"
          style={{ fontFamily: "var(--font-academy)" }}
        >
          Coming Soon
        </p>
      </AnniversaryCard>
    </div>
  )
}
