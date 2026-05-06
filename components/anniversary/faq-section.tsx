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
        answer: "未就学児もご入場いただけます。",
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
          "JR常磐線・東武アーバンパークライン「柏駅」東口より東武バスをご利用の上、「市民文化会館」バス停にて下車してください。所要時間は約15分です。会場の駐車場には限りがございますので、できる限り公共交通機関をご利用ください。",
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
