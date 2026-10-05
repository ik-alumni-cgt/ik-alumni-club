import type { Metadata } from "next"
import { LEGAL_IS_DRAFT, LEGAL_UPDATED_AT } from "@/lib/yourflag-legal-config"

export type LegalSection = { heading: string; body: React.ReactNode }

export const legalMetadata = (title: string): Metadata => ({ title: `${title} | YOURFLAG` })

/** 法的文面のページの共通の枠。仮文面のあいだは、その旨を必ず上部に出す */
export function LegalPage({ title, intro, sections }: { title: string; intro?: string; sections: LegalSection[] }) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="font-inter text-xs font-black tracking-[.3em] text-[#0483B8]">YOURFLAG</p>
        <h1 className="mt-3 text-3xl font-black">{title}</h1>

        {LEGAL_IS_DRAFT && (
          <p className="mt-6 rounded-lg bg-accent px-4 py-3 text-sm font-bold text-accent-foreground" data-testid="legal-draft">
            この文面は仮のものです。専門家（弁護士等）の確認前のため、内容が変わることがあります。
          </p>
        )}

        {intro && <p className="mt-6 text-sm leading-7 text-muted-foreground">{intro}</p>}

        <div className="mt-8 space-y-8">
          {sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="text-lg font-black">
                {i + 1}. {s.heading}
              </h2>
              <div className="mt-2 space-y-2 text-sm leading-7">{s.body}</div>
            </section>
          ))}
        </div>

        <p className="mt-12 text-xs text-muted-foreground">最終更新: {LEGAL_UPDATED_AT}</p>
      </div>
    </div>
  )
}
