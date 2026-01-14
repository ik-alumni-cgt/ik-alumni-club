import Image from "next/image";
import Link from "next/link";
import logo from "@/components/supporters/top_supporter's.jpg";

export function AuthHeader() {
  return (
    <header className="w-full h-[140px] bg-transparent">
      <div className="container max-w-full h-full flex items-center justify-center">
        <Link href="/">
          <Image
            src={logo}
            alt="IK ALUMNI CGT"
            width={400}
            height={100}
            placeholder="blur"
            className="h-[100px] w-auto object-contain dark:brightness-[0.2] dark:grayscale"
          />
        </Link>
      </div>
    </header>
  );
}
