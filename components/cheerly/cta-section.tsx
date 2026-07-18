import Link from "next/link"

export function CtaSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-red text-white text-center py-14 md:py-24">
      <svg viewBox="0 0 28 28" className="absolute top-[12%] left-[8%] w-10 text-white/15" aria-hidden>
        <path d="M18 0H10v10H0v8h10v10h8V18h10v-8H18V0Z" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 28 28" className="absolute bottom-[14%] right-[10%] w-12 text-white/15" aria-hidden>
        <path d="M14 0 28 14 14 28 0 14 14 0Z" fill="currentColor" />
      </svg>

      <div className="mx-auto w-full max-w-[1200px] px-7 md:px-8">
        <h2 className="font-black leading-[1.5] tracking-[.06em] text-[clamp(1.6rem,4.2vw,2.5rem)]">
          まずは気軽に、ご相談ください。
        </h2>
        <p className="mt-5 leading-[1.9] font-medium">
          「うちの団体でも使える？」という段階でも大丈夫です。
          <br />
          会員管理と会費徴収の始め方を、一緒に整理します。
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-red-500 font-extrabold tracking-[.08em] px-9 py-4 rounded hover:bg-red-900 hover:text-white transition-colors"
          >
            お問い合わせ・資料請求
          </Link>
          <a
            href="#service"
            className="inline-flex items-center gap-2 border-[1.5px] border-white/70 text-white font-extrabold tracking-[.08em] px-9 py-4 rounded hover:bg-white hover:text-red-500 hover:border-white transition-colors"
          >
            サービスを詳しく見る
          </a>
        </div>
      </div>
    </section>
  )
}
