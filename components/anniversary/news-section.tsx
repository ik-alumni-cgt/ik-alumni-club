import { AnniversaryCard } from "@/components/anniversary/anniversary-card"
import { getInformations } from "@/data/information"

// 五周年ページに表示するお知らせのカテゴリー slug（管理画面で付与）
const ANNIVERSARY_CATEGORY_SLUG = "5th-anniversary"
const NEWS_LIMIT = 5

export async function NewsSection() {
  const informations = await getInformations(ANNIVERSARY_CATEGORY_SLUG)
  const items = informations.slice(0, NEWS_LIMIT)

  return (
    <div className="max-w-3xl mx-auto">
      <AnniversaryCard>
        {items.length === 0 ? (
          <p className="text-sm md:text-base text-white/80 tracking-wider py-4">
            配信までしばらくお待ちください
          </p>
        ) : (
          <>
            {/* ニュースリスト */}
            <ul className="flex flex-col">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className={index !== items.length - 1 ? "border-b border-white/30" : ""}
                >
                  <a
                    href={`/information/${item.id}`}
                    className="block py-6 text-left hover:opacity-70 transition-opacity"
                  >
                    <time className="text-xs md:text-sm text-white/60 tracking-wider">
                      {item.date.replaceAll("-", ".")}
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
                href={`/information?category=${ANNIVERSARY_CATEGORY_SLUG}`}
                className="inline-block text-sm tracking-widest text-white/80 hover:text-white transition-colors border-b border-white/40 pb-1"
              >
                VIEW MORE
              </a>
            </div>
          </>
        )}
      </AnniversaryCard>
    </div>
  )
}
