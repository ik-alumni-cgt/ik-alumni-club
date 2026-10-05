import Image from "next/image"
import Link from "next/link"
import PcFooter from "@/components/footer/PcFooter.jpg"
import SpFooter from "@/components/footer/SpFooter.jpg"

export function AnniversaryFooter() {
  return (
    <footer className="w-full">
      {/* お問い合わせ */}
      <div className="px-4 py-12 text-center text-white">
        <p
          className="text-lg md:text-xl font-bold tracking-widest"
          style={{ fontFamily: "var(--font-academy)" }}
        >
          CONTACT
        </p>
        <p className="mt-4 text-xs md:text-sm text-white/70 tracking-wider">
          このイベントに関するお問い合わせ
        </p>
        <p className="mt-3 text-sm md:text-base tracking-wider">
          <a
            href="mailto:cgt.ik.est2022@gmail.com"
            className="border-b border-white/40 hover:text-white/70 transition-colors"
          >
            cgt.ik.est2022@gmail.com
          </a>
        </p>
        <p className="mt-3 text-sm md:text-base tracking-wider">
          <Link
            href="/contact"
            className="border-b border-white/40 hover:text-white/70 transition-colors"
          >
            お問い合わせフォーム
          </Link>
        </p>
      </div>

      {/* SP用 */}
      <Image
        src={SpFooter}
        alt="IK ALUMNI CGT"
        className="w-full md:hidden"
      />
      {/* PC用 */}
      <Image
        src={PcFooter}
        alt="IK ALUMNI CGT"
        className="w-full hidden md:block"
      />
    </footer>
  )
}
