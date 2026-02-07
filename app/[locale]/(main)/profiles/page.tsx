import { setLocale } from "@/app/web/i18n/set-locale";
import { getTranslations } from "next-intl/server";
import Image, { StaticImageData } from "next/image";
import profileImage from "./profile.jpg";
import logo from "@/components/header/logo_main.png";

// メンバー画像
import shoImage from "./member/sho.jpg";
import ryoImage from "./member/ryo.jpg";
import akariImage from "./member/akari.jpg";
import natukiImage from "./member/natuki.jpg";
import rinImage from "./member/rin.jpg";
import hiroakiImage from "./member/hiroaki.jpg";
import yunaImage from "./member/yuna.jpg";
import nanaImage from "./member/nana.jpg";
import taiseiImage from "./member/taisei.jpg";
import aoiImage from "./member/aoi.jpg";
import aokiImage from "./member/aoki.jpg";
import sakuraImage from "./member/sakura.jpg";
import kahoImage from "./member/kaho.jpg";
import mikotoImage from "./member/mikoto.jpg";
import yumaImage from "./member/yuma.jpg";
import kazuakiImage from "./member/kazuaki.jpg";
import moekaImage from "./member/moeka.jpg";
import ayumiImage from "./member/ayumi.jpg";
import sakura2Image from "./member/sakura2.jpg";

export default async function ProfilesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");

  const members: { id: string; name: string; description: string; image: StaticImageData }[] = [
    {
      id: "1",
      name: "SHO",
      description: "カラーガードの振り付けや構成までなんでもできる頼れるリーダー。",
      image: shoImage,
    },
    {
      id: "2",
      name: "RYO",
      description: "意外と副代表、このサイトを作ったり歌ったりしてます。",
      image: ryoImage,
    },
    {
      id: "3",
      name: "AKARI",
      description: "このチームのリーダーよりリーダー。ビシッとチームを導いてくれます。",
      image: akariImage,
    },
    {
      id: "4",
      name: "NATUKI",
      description: "アルムナイの優しい姉さん的存在。ダンスの振り付けもします。",
      image: natukiImage,
    },
    {
      id: "5",
      name: "RIN",
      description: "ライブ、アニメ大好き！こう見えてインテリエンジニアなんです。",
      image: rinImage,
    },
    {
      id: "6",
      name: "HIROAKI",
      description: "普段は飛行機を整備しています。飛んでいるものを扱うのが得意です。",
      image: hiroakiImage,
    },
    {
      id: "7",
      name: "YUNA",
      description: "このチーム唯一のカラーガード未経験者！ライフルまでできるようになりました！",
      image: yunaImage,
    },
    {
      id: "8",
      name: "NANA",
      description: "我らがアイドル。そこのあなたもイチコロです。",
      image: nanaImage,
    },
    {
      id: "9",
      name: "TAISEI",
      description:
        "カラーガードの貴公子降臨。なんでも踊っちゃう彼にはファンが多いみたい。",
      image: taiseiImage,
    },
    {
      id: "10",
      name: "AOI",
      description: "ミスター天才。彼が本物の天才です。ほんとに。",
      image: aoiImage,
    },
    {
      id: "11",
      name: "AOI",
      description:
        "貴公子と天才と同じ3年間同じ楽器でした。本人曰く大変だったそうです。",
      image: aokiImage,
    },
    {
      id: "12",
      name: "SAKURA",
      description: "スタイル抜群！！どんなダンスも華麗に踊ります。",
      image: sakuraImage,
    },
    {
      id: "13",
      name: "CAHO",
      description:
        "Msゲラ。笑いすぎて腹筋がめっちゃ割れているという噂も...",
      image: kahoImage,
    },
    {
      id: "14",
      name: "MIKOTO",
      description:
        "おしゃべり大好き、おしゃべり上手！MCもこなすアナウンサー的ポジション。",
      image: mikotoImage,
    },
    {
      id: "15",
      name: "YUMA",
      description:
        "アルムナイの父。包容力と優しが溢れ出る。実はバク転できます。",
      image: yumaImage,
    },
    {
      id: "16",
      name: "KAZUAKI",
      description:
        "アルムナイの最終兵器。彼がいれば盛り上がらないイベントはない。",
      image: kazuakiImage,
    },
    {
      id: "17",
      name: "MOEKA",
      description: "何と二児の母！ちっちゃくてもパワフルに踊ります。",
      image: moekaImage,
    },
    {
      id: "18",
      name: "AYUMI",
      description: "真面目な谷さんはチームの練習より練習しているという噂も...",
      image: ayumiImage,
    },
    {
      id: "19",
      name: "SAKURA",
      description: "最年少！フレッシュさなら誰にも負けません！",
      image: sakura2Image,
    },
  ];

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
      <div className="flex justify-center mt-16">
        <Image
          src={logo}
          alt="IK ALUMNI CGT"
          width={100}
          height={100}
          className="w-[120px] h-auto md:w-[150px] object-contain"
        />
      </div>

      {/* チーム紹介文 */}
      <div className="max-w-3xl mx-auto mt-8 text-center space-y-6">
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
      </div>

      <h2 className="main-text mt-16 mb-10 text-center">MEMBER</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
        {members.map((member) => (
          <li key={member.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{member.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
