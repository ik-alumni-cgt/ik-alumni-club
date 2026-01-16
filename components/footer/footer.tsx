"use client";

import Link from "next/link";
import Image from "next/image";
import PcFooter from "./PcFooter.jpg";
import SpFooter from "./SpFooter.jpg";

export function Footer() {
  const links = [
    { label: "お問い合わせ", href: "/contact" },
    { label: "利用規約", href: "/terms" },
  ];

  return (
    <footer className="w-full border-t bg-background">
      <div className="pt-8 md:pt-[50px]">
        {/* リンク */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-start md:items-center justify-start px-4 md:px-[92px] mb-8 md:mb-[50px]">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-sm md:text-base font-[family-name:var(--font-senobi-gothic)] whitespace-nowrap hover:underline transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Footer画像 */}
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
      </div>
    </footer>
  );
}
