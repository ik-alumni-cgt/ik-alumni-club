import type { ReactNode } from "react"

type Props = {
  kicker: ReactNode
  children: ReactNode
  desc?: ReactNode
  titleClassName?: string
}

export function SectionHead({ kicker, children, desc, titleClassName }: Props) {
  return (
    <div className="text-center mb-8 md:mb-12">
      <span className="inline-flex items-center justify-center gap-1 font-[family-name:var(--font-inter)] font-bold text-[#0483B8] text-base tracking-[.06em]">
        {kicker}
      </span>
      <h2
        className={`mt-2 font-black leading-[1.4] tracking-[.06em] text-[clamp(1.7rem,4.4vw,2.7rem)] ${titleClassName ?? ""}`}
      >
        {children}
      </h2>
      {desc ? <p className="mt-6 leading-[1.9] font-medium">{desc}</p> : null}
    </div>
  )
}
