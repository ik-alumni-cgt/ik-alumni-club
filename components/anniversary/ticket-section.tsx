import { AnniversaryCard } from "@/components/anniversary/anniversary-card"

// 外部チケットサービスの URL（null にすると Coming Soon を表示）
const TICKET_URL: string | null = "https://teket.jp/17750/67443"

export function TicketSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <AnniversaryCard>
        {TICKET_URL ? (
          <div className="space-y-8">
            <ul className="space-y-2 text-base md:text-lg tracking-widest text-white">
              <li>無料・指定席</li>
              <li>チケット販売中！</li>
            </ul>
            <a
              href={TICKET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-base md:text-lg tracking-widest text-white border border-[#c9a227] rounded-full px-10 py-4 hover:bg-white/10 transition-colors"
            >
              チケットを申し込む
            </a>
          </div>
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
