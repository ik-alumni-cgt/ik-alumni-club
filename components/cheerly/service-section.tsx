import { SectionHead } from "./section-head"

const TAGS = [
  { label: "名簿をオンライン管理", on: true },
  { label: "会費をカード決済で", on: false },
  { label: "入金確認の手作業ゼロ", on: true },
  { label: "申込フォームを自由設定", on: false },
  { label: "年会費を自動更新", on: true },
  { label: "QRコードで会員募集", on: false },
  { label: "現金集金をやめる", on: true },
  { label: "引き継ぎもスムーズ", on: false },
]

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M21 1L7.5 24l2.7.1L23.7 1H21Z" fill="#1289c9" />
      <path
        d="M18.3 1L10 15.4c0-3.4-4.2-7.3-8.3-11.2C1.7 1 4.6 2.5 10 .8 15.5-.9 18.3 1 18.3 1Z"
        fill="#ef4444"
      />
    </svg>
  )
}

function Pillar({ cap, badge, body }: { cap: string; badge: string; body: string }) {
  return (
    <div className="bg-[#f4f5f7] rounded-[.9rem] px-6 md:px-10 py-9 text-center">
      <p className="font-medium text-base leading-[1.8]">
        {cap}
        <span className="inline-block bg-[#1289c9] text-white font-bold text-[clamp(1.25rem,3vw,1.7rem)] rounded-[.6rem] px-6 py-2 mt-3 tracking-[.05em]">
          {badge}
        </span>
      </p>
      <p className="mt-6 text-left text-[.9rem] leading-[1.9]">{body}</p>
    </div>
  )
}

export function ServiceSection() {
  return (
    <section
      id="service"
      className="bg-[radial-gradient(#d7dbe4_1.3px,transparent_1.3px)] [background-size:18px_18px] py-14 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px] px-7 md:px-8">
        <SectionHead
          kicker={
            <>
              Service <FlagIcon />
            </>
          }
          titleClassName="text-[#1289c9]"
          desc={
            <>
              Cheerlyは、会員名簿をオンライン化する<strong className="font-bold">「会員管理」</strong>と、
              <br className="max-md:hidden" />
              年会費をオンラインで集める<strong className="font-bold">「会費徴収」</strong>を核にしたサービスです。
              <br className="max-md:hidden" />
              会費徴収システムにとどまらず、<strong className="font-bold">将来は団体運営全体を支えるプラットフォーム</strong>を目指します。
            </>
          }
        >
          どんなサービス？
        </SectionHead>

        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-7">
          <Pillar
            cap="名簿も入退会もオンラインで"
            badge="会員管理"
            body="会員名簿をオンラインで一元管理。CSV取込にも対応し、担当者が変わっても引き継ぎ簡単。入金状況もひと目で分かります。"
          />
          <div className="relative w-10 h-10 mx-auto max-md:rotate-90" aria-hidden>
            <span className="absolute inset-0 m-auto w-full h-1.5 rounded-full bg-[#1289c9] rotate-45" />
            <span className="absolute inset-0 m-auto w-full h-1.5 rounded-full bg-[#1289c9] -rotate-45" />
          </div>
          <Pillar
            cap="カード決済で会費をかんたんに"
            badge="年会費徴収"
            body="年会費プランを自由に作成し、オンライン決済で集金。現金や振込の入金確認、手作業の突き合わせから解放されます。"
          />
        </div>

        <div className="mt-12 md:mt-20 text-center">
          <h3 className="font-black leading-[1.5] tracking-[.06em] text-[clamp(1.4rem,3.6vw,2.2rem)]">
            <span className="font-[family-name:var(--font-inter)]">Cheerly</span>で、こんなことが実現できます。
          </h3>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {TAGS.map((t) => (
              <span
                key={t.label}
                className={`font-bold text-[.85rem] px-5 py-3 rounded-[.5rem] border ${
                  t.on
                    ? "bg-[#1289c9] text-white border-[#1289c9]"
                    : "bg-white text-[#6b7280] border-dashed border-[#e3e6ec]"
                }`}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
