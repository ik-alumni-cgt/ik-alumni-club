import { AnniversaryCard } from "@/components/anniversary/anniversary-card"

const PROGRAMS = ["The Greatest Show", "ALUMNI Philher Magic"]

const CASTS = ["IK ALUMNI CGT"]

export function ProgramSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <AnniversaryCard>
        {/* プログラム */}
        <h3 className="text-sm md:text-base font-bold tracking-widest text-white/60">
          PROGRAM
        </h3>
        <ul className="mt-4 flex flex-col gap-2 text-base md:text-lg tracking-wider text-white">
          {PROGRAMS.map((program) => (
            <li key={program}>{program}</li>
          ))}
          <li className="text-sm md:text-base text-white/70">その他</li>
        </ul>

        {/* 出演者 */}
        <h3 className="mt-10 text-sm md:text-base font-bold tracking-widest text-white/60">
          CAST
        </h3>
        <ul className="mt-4 flex flex-col gap-2 text-base md:text-lg tracking-wider text-white">
          {CASTS.map((cast) => (
            <li key={cast}>{cast}</li>
          ))}
        </ul>

        {/* 区切り線 */}
        <div className="border-t border-white/30 my-8" />

        {/* みどころ */}
        <h3 className="text-sm md:text-base font-bold tracking-widest text-white/60">
          HIGHLIGHT
        </h3>
        <p className="mt-4 text-sm md:text-base leading-[2.5] tracking-widest text-white">
          カラーガードのみで構成されるパフォーマンス。
          <br />
          美しいショーから、クスッと笑えるショーまで、
          <br />
          幅広い年代の方々に楽しんでいただける
          <br />
          演目をご用意しております！
        </p>
      </AnniversaryCard>
    </div>
  )
}
