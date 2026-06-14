import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import clubIcon from "./supporters-club-icon.png";
import menuIcon from "./supporters-menu-icon.png";

export async function SupportersFloatingButton() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isLoggedIn = !!session?.user;

  const { href, src, alt } = isLoggedIn
    ? {
        href: "#supporters-section",
        src: menuIcon,
        alt: "サポーターズメニューへ移動",
      }
    : {
        href: "/supporters",
        src: clubIcon,
        alt: "サポーターズクラブの案内を見る",
      };

  return (
    <Link
      href={href}
      aria-label={alt}
      className="fixed bottom-4 right-4 z-50 block w-[120px] h-[120px] transition-transform hover:scale-105 active:scale-95"
    >
      <Image
        src={src}
        alt={alt}
        width={120}
        height={120}
        className="w-full h-full object-contain"
      />
    </Link>
  );
}
