import Link from "next/link"

export function CtaSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-br from-[#00B0F0] via-[#33bff3] to-[#FF9300] text-white text-center py-16 md:py-28"
    >
      <svg viewBox="0 0 28 28" className="absolute top-[12%] left-[8%] w-10 text-white/15" aria-hidden>
        <path d="M18 0H10v10H0v8h10v10h8V18h10v-8H18V0Z" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 28 28" className="absolute bottom-[14%] right-[10%] w-12 text-white/15" aria-hidden>
        <path d="M14 0 28 14 14 28 0 14 14 0Z" fill="currentColor" />
      </svg>

      <div className="relative mx-auto w-full max-w-[1000px] px-7 md:px-8">
        <p className="leading-[1.9] font-medium text-white/95 text-[.95rem] md:text-base">
          それぞれの「応援したい」という気持ちが、団体の未来をつくっていく。
          <br className="max-md:hidden" />
          その活動が10年後、20年後も続いていくための仕組みを、YOURFLAGはつくります。
        </p>

        <h2 className="mt-8 font-[family-name:var(--font-inter)] font-black leading-[1.15] tracking-[.04em] text-[clamp(2rem,6vw,3.6rem)]">
          YOUR FLAG,
          <br className="min-[420px]:hidden" /> THEIR FUTURE.
        </h2>
        <p className="mt-4 font-bold leading-[1.7] text-[clamp(1.1rem,3vw,1.5rem)]">
          あなたの応援が、誰かの活動の未来になる。
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#0483B8] font-extrabold tracking-[.08em] px-9 py-4 rounded-full shadow-lg hover:scale-[1.03] transition-transform"
          >
            お問い合わせ・資料請求
          </Link>
          <a
            href="#about"
            className="inline-flex items-center gap-2 border-[1.5px] border-white/80 text-white font-extrabold tracking-[.08em] px-9 py-4 rounded-full hover:bg-white hover:text-[#0483B8] transition-colors"
          >
            サービスを詳しく見る
          </a>
        </div>
      </div>
    </section>
  )
}
