export const dynamic = "force-dynamic";

import { setLocale } from "@/app/web/i18n/set-locale";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import profileImage from "./profile.jpg";
import logo from "@/components/header/logo_main.png";
import { ScrollFadeIn } from "@/components/scroll-animation/scroll-fade-in";
import { ScrollStagger } from "@/components/scroll-animation/scroll-stagger";
import { getVisibleProfileMembers } from "@/data/profile-member";

export default async function ProfilesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");
  const members = await getVisibleProfileMembers();

  return (
    <div className="container mx-auto px-4 pt-10 pb-32">
      <h1 className="main-text mb-10">{t("profiles")}</h1>
      <div className="mb-10 max-w-3xl mx-auto">
        <Image
          src={profileImage}
          alt="メンバー集合写真"
          className="w-full rounded-lg"
          priority
        />
      </div>

      {/* ロゴ */}
      <ScrollFadeIn className="flex justify-center mt-16">
        <Image
          src={logo}
          alt="IK ALUMNI CGT"
          width={100}
          height={100}
          className="w-[120px] h-auto md:w-[150px] object-contain"
        />
      </ScrollFadeIn>

      {/* チーム紹介文 */}
      <ScrollFadeIn className="max-w-3xl mx-auto mt-8 text-center space-y-6">
        <p>
          2022年に発足した、千葉県内唯一の一般カラーガードチーム。
          <br />
          チーム名のALUMNIとは「卒業生」という意味で、
          <br />
          その名の通りメンバーは柏市立柏高等学校（通称：イチカシ）の卒業生で構成されています。
        </p>
        <p>
          地元柏市でのイベント出演や年度末に行われる自主公演に向けて日々活動しています。
        </p>
        <p>
          学業や仕事など、忙しい中でも無理なく両立して続けられるよう、
          <br />
          私たちはあえて「大会」を目標とせず、純粋にカラーガードを楽しむことを大切に日々練習しています。
        </p>
        <p>
          そして、カラーガードの魅力を広めながら、初めてご覧になる方にも「すごい！楽しい！」
          <br />
          と感じていただけるようなパフォーマンスを皆様に届けたいと思っています。
        </p>
        <p>
          カラーガードを趣味として楽しみつつ、唯一無二の新たなエンターテインメントを目指して活動しています！
        </p>
      </ScrollFadeIn>

      <ScrollFadeIn>
        <h2 className="main-text mt-16 mb-10 text-center">MEMBER</h2>
      </ScrollFadeIn>
      {members.length > 0 ? (
        <ScrollStagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8" staggerDelay={80}>
          {members.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{member.description}</p>
              </div>
            </div>
          ))}
        </ScrollStagger>
      ) : (
        <p className="text-center text-muted-foreground">メンバー情報を準備中です</p>
      )}
    </div>
  );
}
