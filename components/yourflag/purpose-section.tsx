import { SectionHead } from "./section-head"

export function PurposeSection() {
  return (
    <section
      id="purpose"
      className="bg-[radial-gradient(#d7dbe4_1.3px,transparent_1.3px)] [background-size:18px_18px] py-14 md:py-24"
    >
      <div className="mx-auto w-full max-w-[900px] px-7 md:px-8">
        <SectionHead kicker="Purpose">
          私たちの<span className="text-[#0483B8]">目的</span>
        </SectionHead>

        <div className="space-y-6 text-center leading-[1.95] text-[.95rem] md:text-base">
          <p>
            近年、文化庁のガイドライン等を背景に、学校における部活動の活動時間が見直され、
            休日の学校部活動を地域のクラブ活動等へ段階的に移行する
            <strong className="font-bold">「部活動改革」</strong>が進められています。
            地域移行の進展に伴い、学校から地域へ完全に移行する活動も増えています。
          </p>
          <p>
            これまで学校からの補助や支援を受けて活動していた部活動も、地域移行によって
            <strong className="font-bold">活動に必要な費用を自ら確保しなければならないケース</strong>
            が増えています。
          </p>
        </div>

        <p className="mt-10 text-center font-black leading-[1.5] tracking-[.04em] text-[clamp(1.3rem,3.6vw,2rem)] text-[#0483B8] underline decoration-[#00B0F0]/40 decoration-[3px] underline-offset-[8px]">
          そこで私たちは、新たな活動資金の集め方を提案します。
        </p>

        <div className="mt-10 space-y-6 text-center leading-[1.95] text-[.95rem] md:text-base">
          <p>卒業生、地域住民、ファン、企業など、その活動を応援したい人はたくさんいます。</p>
          <p>
            YOURFLAGは、そんな「応援したい」という想いを、
            一時的な支援ではなく、<strong className="font-bold">継続的な支援</strong>へとつなげるサービスです。
          </p>
        </div>

        <div className="mt-10 rounded-[1rem] bg-white border border-[#e3e6ec] px-6 md:px-10 py-8 text-center shadow-[0_16px_50px_-30px_rgba(0,120,180,.4)]">
          <p className="font-black leading-[1.6] tracking-[.04em] text-[clamp(1.2rem,3.4vw,1.8rem)]">
            <span className="text-[#FF9300]">活動する人</span>と、
            <span className="text-[#00B0F0]">応援する人</span>をつなぐ。
            <br className="max-md:hidden" />
            <span className="font-[family-name:var(--font-inter)]">YOURFLAG</span>が、新しい支援のカタチをつくります。
          </p>
        </div>
      </div>
    </section>
  )
}
