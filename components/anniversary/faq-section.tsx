"use client"

import { AnniversaryCard } from "@/components/anniversary/anniversary-card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

/** FAQカテゴリ定義 */
const FAQ_CATEGORIES = [
  {
    title: "公演について",
    items: [
      {
        question: "未就学児は入場できますか？",
        answer: "小学生以上のお客様がご入場いただけます。未就学児のご入場はお断りしております。",
      },
      {
        question: "公演の終了時刻は何時頃ですか？",
        answer: "終演時刻は決まり次第お知らせいたします。",
      },
      {
        question: "途中入場・途中退場はできますか？",
        answer:
          "途中入場・途中退場は可能ですが、他のお客様のご迷惑にならないようスタッフの指示に従ってください。",
      },
      {
        question: "公演中の撮影・録音はできますか？",
        answer:
          "公演中の写真撮影・動画撮影・録音は一切禁止となっております。ご了承ください。",
      },
    ],
  },
  {
    title: "会場について",
    items: [
      {
        question: "会場へのアクセス方法を教えてください。",
        answer:
          "柏市民文化会館へのアクセスについては、決まり次第お知らせいたします。",
      },
      {
        question: "駐車場はありますか？",
        answer:
          "会場の駐車場には限りがございますので、公共交通機関のご利用をお願いいたします。",
      },
    ],
  },
]

export function FaqSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <AnniversaryCard className="text-left">
        <div className="flex flex-col gap-10">
          {FAQ_CATEGORIES.map((category) => (
            <div key={category.title}>
              {/* カテゴリタイトル */}
              <h3 className="text-sm md:text-base font-bold text-white mb-4 tracking-wider">
                {category.title}
              </h3>

              {/* アコーディオン */}
              <Accordion type="multiple">
                {category.items.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`${category.title}-${index}`}
                    className="border-white/30"
                  >
                    <AccordionTrigger className="text-white hover:no-underline hover:text-white/70 [&>svg]:text-white/60">
                      <span className="flex gap-3">
                        <span className="text-red-300 font-bold shrink-0">Q</span>
                        <span>{item.question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-white/70">
                      <span className="flex gap-3">
                        <span className="text-red-300 font-bold shrink-0">A</span>
                        <span>{item.answer}</span>
                      </span>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </AnniversaryCard>
    </div>
  )
}
