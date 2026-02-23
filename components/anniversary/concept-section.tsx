import { AnniversaryCard } from "@/components/anniversary/anniversary-card"

export function ConceptSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <AnniversaryCard>
        <p className="text-sm md:text-base leading-[2.5] tracking-widest text-white">
          私たちIK ALUMNI COLOR GUARD TEAMは、
          <br />
          2022年の発足から五周年を迎えます。
        </p>

        <p className="text-sm md:text-base leading-[2.5] tracking-widest text-white mt-8">
          これまでの活動を支えてくださった全ての皆さまへの感謝を込めて、
          <br />
          五周年記念コンサートを開催いたします。
        </p>

        <p className="text-sm md:text-base leading-[2.5] tracking-widest text-white mt-8">
          カラーガードの美しさ、音楽との調和、
          <br />
          そしてメンバー一人ひとりの想いが織りなす
          <br />
          特別なステージをお届けします。
        </p>
      </AnniversaryCard>
    </div>
  )
}
