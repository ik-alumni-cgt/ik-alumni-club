import { SectionHead } from "./section-head"
import { FlagMark } from "./flag-mark"

function HandshakeIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-16 h-16 md:w-20 md:h-20" fill="none" aria-hidden>
      <path d="M6 22h14l6 5-5 5a4 4 0 0 1-6 0l-3-3H6V22Z" fill="#FF9300" />
      <path d="M58 22H44l-9 8a4 4 0 0 0 0 6l2 2a4 4 0 0 0 6 0l3-3 3 3a3.5 3.5 0 0 0 5-5 3.5 3.5 0 0 0 4-5 3.5 3.5 0 0 0 0-4l-3-3Z" fill="#00B0F0" />
      <path d="M32 24l-6 5 4 4 6-5-4-4Z" fill="#FF9300" opacity=".85" />
    </svg>
  )
}

function Party({
  side,
  title,
  who,
  wish,
}: {
  side: "org" | "supporter"
  title: string
  who: string[]
  wish: string
}) {
  const org = side === "org"
  return (
    <div
      className={`flex-1 rounded-[1.2rem] border-2 px-6 py-8 text-center ${
        org ? "border-[#FF9300]/40 bg-[#FFF6EC]" : "border-[#00B0F0]/40 bg-[#EAF8FE]"
      }`}
    >
      <h3
        className={`font-black text-[clamp(1.4rem,4vw,1.8rem)] ${
          org ? "text-[#E67E00]" : "text-[#0483B8]"
        }`}
      >
        {title}
      </h3>
      <ul className="mt-4 space-y-1 text-[.9rem] font-medium leading-[1.7]">
        {who.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      <p
        className={`mt-5 font-bold leading-[1.6] text-[.95rem] ${
          org ? "text-[#E67E00]" : "text-[#0483B8]"
        }`}
      >
        {wish}
      </p>
    </div>
  )
}

export function AboutSection() {
  return (
    <section id="about" className="py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px] px-7 md:px-8">
        <SectionHead
          kicker={
            <>
              About <FlagMark className="w-6 h-5" />
            </>
          }
          desc={
            <>
              YOURFLAGは、クラブ活動・スポーツ・文化団体と、その活動を応援する人をつなぐ
              <br className="max-md:hidden" />
              <strong className="font-bold">継続支援プラットフォーム</strong>です。
            </>
          }
        >
          <span className="font-[family-name:var(--font-inter)] text-[#00B0F0]">YOURFLAG</span>とは
        </SectionHead>

        <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-2">
          <Party
            side="org"
            title="団体"
            who={["地域移行した部活動", "スポーツ・文化団体", "社会人チーム 等"]}
            wish="活動に必要不可欠な、安定した資金を集めたい"
          />
          <div className="grid place-items-center py-2 md:px-2 max-md:rotate-90">
            <HandshakeIcon />
          </div>
          <Party
            side="supporter"
            title="支援者"
            who={["OB・OG", "親族・地域の方々", "応援してくれるファン 等"]}
            wish="活動が不自由なくできるように応援したい"
          />
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <p className="text-[.95rem] md:text-base leading-[1.9]">
            YOURFLAGが目指すのは、一時的に資金を集めることではありません。
          </p>
          <p className="mt-4 inline-block font-black leading-[1.5] tracking-[.04em] text-[clamp(1.3rem,3.8vw,2.1rem)]">
            <span className="relative inline-block">
              <span className="relative z-[1]">
                活動を続けるための「応援の輪」を、長期的に育てていくこと。
              </span>
              <span className="absolute inset-x-[-1%] bottom-[.05em] h-[.4em] bg-[#FF9300]/45" />
            </span>
          </p>
          <p className="mt-5 font-bold text-[.95rem] md:text-base">
            それが<span className="font-[family-name:var(--font-inter)] text-[#00B0F0]">YOURFLAG</span>です。
          </p>
        </div>
      </div>
    </section>
  )
}
