import { AnniversaryCard } from "@/components/anniversary/anniversary-card"

const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("柏市民文化会館")

export function ScheduleSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <AnniversaryCard>
        {/* 日付 */}
        <p
          className="text-2xl md:text-3xl font-bold tracking-widest text-white"
          style={{ fontFamily: "var(--font-academy)" }}
        >
          2027.2.7<span className="text-base md:text-lg ml-1">Sun</span>
        </p>

        {/* 会場 */}
        <p className="text-base md:text-lg text-white mt-6 tracking-wider">
          柏市民文化会館 大ホール
        </p>
        <a
          href={MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-xs md:text-sm tracking-widest text-white/80 hover:text-white transition-colors border-b border-white/40 pb-1"
        >
          地図を見る
        </a>

        {/* 時間 */}
        <div className="flex justify-center gap-6 md:gap-10 mt-6 text-sm md:text-base text-white/80 tracking-wider">
          <div>
            <span className="text-white/50 mr-2">OPEN</span>
            <span>14:30</span>
          </div>
          <div>
            <span className="text-white/50 mr-2">START</span>
            <span>15:30</span>
          </div>
          <div>
            <span className="text-white/50 mr-2">END</span>
            <span>18:00</span>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t border-white/30 my-8" />

        {/* 入場について */}
        <div className="text-xs md:text-sm text-white/60 leading-relaxed tracking-wider">
          <p>入場無料・指定席</p>
          <p className="mt-2">
            チケットの販売開始は決まり次第お知らせいたします。
          </p>
        </div>
      </AnniversaryCard>
    </div>
  )
}
