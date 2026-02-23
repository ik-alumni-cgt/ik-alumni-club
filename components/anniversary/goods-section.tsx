import Image from "next/image"
import { AnniversaryCard } from "@/components/anniversary/anniversary-card"
import blanket from "@/app/[locale]/(standalone)/feature/5th-anniversary/blanket.jpg"
import borupen from "@/app/[locale]/(standalone)/feature/5th-anniversary/borupen.jpg"
import lont from "@/app/[locale]/(standalone)/feature/5th-anniversary/lont.jpg"
import pants from "@/app/[locale]/(standalone)/feature/5th-anniversary/pants.jpg"

const GOODS_ITEMS = [
  { src: blanket, alt: "ブランケット" },
  { src: borupen, alt: "ボールペン" },
  { src: lont, alt: "ロンT" },
  { src: pants, alt: "パンツ" },
]

export function GoodsSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <AnniversaryCard>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {GOODS_ITEMS.map((item) => (
            <div key={item.alt} className="overflow-hidden rounded-md">
              <Image
                src={item.src}
                alt={item.alt}
                width={400}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </AnniversaryCard>
    </div>
  )
}
