import Image from "next/image";
import PcFooter from "@/components/footer/PcFooter.jpg";
import SpFooter from "@/components/footer/SpFooter.jpg";

export default function GoodsThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* ヘッダーなし */}
      {children}
      {/* フッター（リンクなし、画像のみ） */}
      <footer className="w-full border-t bg-background">
        <div className="w-full">
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
        </div>
      </footer>
    </>
  );
}
