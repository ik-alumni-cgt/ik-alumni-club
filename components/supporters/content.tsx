import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import supportersImage from "./top_supporter's.jpg";
import samuneImage from "./samune.jpg";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollFadeIn } from "@/components/scroll-animation/scroll-fade-in";
import { auth } from "@/lib/auth";
import { NewContents } from "../new-contents/content";

export async function SupportersContents() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isLoggedIn = !!session?.user;

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-4 md:mb-6 flex justify-center">
            <Image
              src={supportersImage}
              alt="IK ALUMNI COLOR GUARD TEAM SUPPORTER'S CLUB"
              width={400}
              height={225}
              priority
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {isLoggedIn ? (
              <Link href="/mypage" className="w-full sm:w-auto">
                <Button className="w-full sm:min-w-[200px] min-h-11 bg-brand">
                  マイページ
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/supporters" className="w-full sm:w-auto">
                  <Button className="w-full sm:min-w-[200px] min-h-11 bg-brand">
                    入会はこちら
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:min-w-[200px] min-h-11 border-brand">
                    ログイン
                  </Button>
                </Link>
              </>
            )}
          </div>

          <Separator className="mb-16 md:mb-32" />

          <ScrollFadeIn className="mb-16 md:mb-32 flex justify-center">
            <Image
              src={samuneImage}
              alt="Samune"
              width={800}
              height={450}
              className="rounded-lg"
            />
          </ScrollFadeIn>
        </div>
      </div>



      {/* <div className="mb-16 md:mb-32">
        <div className="container mx-auto">
          <BlogContents />
        </div>
      </div>

      <div className="mb-16 md:mb-32">
        <div className="container mx-auto">
          <NewsLettersContents />
        </div>
      </div> */}

      <ScrollFadeIn className="mb-16 md:mb-32">
        <div className="container mx-auto">
          <NewContents />
        </div>
      </ScrollFadeIn>
    </section>
  );
}
