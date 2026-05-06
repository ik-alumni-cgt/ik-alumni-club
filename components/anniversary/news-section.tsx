import { AnniversaryCard } from "@/components/anniversary/anniversary-card"

/** ニュースデータ */
const NEWS_ITEMS = [
  {
    date: "2026.05.07",
    title: "五周年記念コンサート 開催決定のお知らせ",
    href: "#",
  },
]

export function NewsSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <AnniversaryCard>
        {/* ニュースリスト */}
        <ul className="flex flex-col">
          {NEWS_ITEMS.map((item, index) => (
            <li
              key={index}
              className={`${index !== NEWS_ITEMS.length - 1 ? "border-b border-white/30" : ""}`}
            >
              <a
                href={item.href}
                className="block py-6 text-left hover:opacity-70 transition-opacity"
              >
                <time className="text-xs md:text-sm text-white/60 tracking-wider">
                  {item.date}
                </time>
                <p className="text-sm md:text-base text-white mt-2 leading-relaxed">
                  {item.title}
                </p>
              </a>
            </li>
          ))}
        </ul>

        {/* VIEW MORE */}
        <div className="mt-8">
          <a
            href="#"
            className="inline-block text-sm tracking-widest text-white/80 hover:text-white transition-colors border-b border-white/40 pb-1"
          >
            VIEW MORE
          </a>
        </div>
      </AnniversaryCard>
    </div>
  )
}
