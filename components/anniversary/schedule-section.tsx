import { AnniversaryCard } from "@/components/anniversary/anniversary-card"

export function ScheduleSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <AnniversaryCard>
        {/* 日付 */}
        <p
          className="text-2xl md:text-3xl font-bold tracking-widest text-white"
          style={{ fontFamily: "var(--font-academy)" }}
        >
          2027.2.3<span className="text-base md:text-lg ml-1">Wed</span>
        </p>

        {/* 会場 */}
        <p className="text-base md:text-lg text-white mt-6 tracking-wider">
          柏市民文化会館
        </p>

        {/* 時間 */}
        <div className="flex justify-center gap-8 md:gap-12 mt-6 text-sm md:text-base text-white/80 tracking-wider">
          <div>
            <span className="text-white/50 mr-2">OPEN</span>
            <span>17:00</span>
          </div>
          <div>
            <span className="text-white/50 mr-2">START</span>
            <span>18:00</span>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t border-white/30 my-8" />

        {/* お問い合わせ */}
        <div className="text-xs md:text-sm text-white/60 leading-relaxed tracking-wider">
          <p>詳細は決まり次第お知らせいたします。</p>
        </div>
      </AnniversaryCard>
    </div>
  )
}
