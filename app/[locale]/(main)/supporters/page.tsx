import Image from "next/image";
import Link from "next/link";
import topSupportersImg from "./top_supporter's.jpg";
import kojinImg from "./kojin.png";
import houjinImg from "./houjin.png";
import puratinaImg from "./puratina.png";
import tokutenImg from "./tokuten.jpg";
import kessaiImg from "@/components/supporters/kessai.jpg";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PhotoCarousel } from "@/components/supporters/photo-carousel";
import { SupportersContent } from "@/components/supporters/supporters-content";
import { InAppBrowserNotice } from "@/components/supporters/in-app-browser-notice";

// 特典画像のインポート
import tokuten_IMG_3582 from "./tokuten/IMG_3582-scaled.jpg";
import tokuten_3O6A8935 from "./tokuten/3O6A8935.jpg";
import tokuten_fcd9a261 from "./tokuten/fcd9a261c2f0348d1f29ddfb2a06cc8c-scaled.jpg";
import tokuten_logo from "./tokuten/後援会ロゴ　訂正-4-scaled.png";
import tokuten_117213171 from "./tokuten/117213171e45978db06a80dbc1715843-scaled.jpg";
import tokuten_IMG_2202 from "./tokuten/IMG_2202-scaled.jpg";
import tokuten_IMG_2221 from "./tokuten/IMG_2221-scaled.jpg";
import tokuten_IMG_5737 from "./tokuten/IMG_5737-scaled.jpg";

const benefits = {
  individual: [
    {
      title: "会員限定グッズ",
      description: "会員しか持っていない、限定グッズをプレゼント！",
      image: tokuten_IMG_3582,
    },
    {
      title: "コンサート映像の配信",
      description:
        "過去のコンサート映像から、最新のコンサート映像までいつでもどこでもご覧いただけます！",
      image: tokuten_3O6A8935,
    },
    {
      title: "会員ページ限定コンテンツ",
      description:
        "イベントの様子や、SNSでは発信していない限定コンテンツをお届けします！",
      image: tokuten_fcd9a261,
    },
    {
      title: "会報の配信",
      description: "活動内容の報告や、イベントの最新情報をお届けします！",
      image: tokuten_logo,
    },
    {
      title: "コンサート優先入場権",
      description:
        "2月に行われる自主公演にて、他のお客様よりも一足先に、入場をし、席を確保することができます！",
      image: tokuten_117213171,
    },
  ],
  business: [
    {
      title: "ホームページへの掲載",
      description:
        "企業様向けに、企業のロゴとHPをALUMNI HPおよびALUMNI CGT Supporter's Club HPに掲載することができます！",
      image: tokuten_logo,
    },
    {
      title: "コンサートプログラムへの掲載（企業名）",
      description:
        "支援してくださる企業様向けに、コンサートプログラムへの掲載をいたします。",
      image: tokuten_IMG_2202,
    },
    {
      title: "企業ロゴ入りオリジナルフラッグ",
      description: "企業のロゴが入ったオリジナルフラッグを作成します！",
      image: tokuten_IMG_2221,
    },
  ],
  platinum: [
    {
      title: "コンサートプログラムへの広告掲載",
      description:
        "2月に行われる自主公演のプログラムに、企業様の広告を掲載することができます。",
      image: tokuten_IMG_2202,
    },
    {
      title: "プラチナ会員限定オリジナルウェア",
      description:
        "プラチナ会員限定のオリジナルウェアをプレゼントします。（1着）",
      image: tokuten_logo,
    },
    {
      title: "メンバーからのお礼動画",
      description: "メンバーからのオリジナルお礼動画を配信します！",
      image: tokuten_IMG_5737,
    },
  ],
};

export default function SupportersPage() {
  return (
    <div className="bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500 min-h-screen -mt-[140px] pt-[140px]">
      <div className="container mx-auto px-4 pt-10 pb-32">

      {/* メインビジュアル */}
      <div className="mb-4 md:mb-6 flex justify-center">
        <Image
          src={topSupportersImg}
          alt="IK ALUMNI COLOR GUARD TEAM SUPPORTER'S CLUB"
          width={400}
          height={225}
          priority
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Link href="/register/terms" className="w-full sm:w-auto">
              <Button className="w-full sm:min-w-[200px] min-h-11 bg-brand">
                入会はこちら
              </Button>
            </Link>
          </div>
          <InAppBrowserNotice />
      </div>

      {/* フォトカルーセル - containerの外に配置 */}
      <PhotoCarousel />

      <div className="container mx-auto px-4">
      {/* リード文 */}
      <div className="mb-12">
        <p className="text-base text-white mb-4 text-center">
          千葉県柏市を拠点に活動している「IK ALUMNI CGT」の後援会です。
        </p>
        <p className="text-base text-white mb-6 text-center">
          本後援会は、年間を通してIK ALUMNI CGTの活動支援とともに、
          地元柏の地域活性化やカラーガードの普及活動に寄与する事を目的としています。
        </p>
        <p className="text-base text-white mb-4 font-bold text-center">
          後援会特典: 会員限定グッズ、コンサート映像の配信、会員ページ限定コンテンツ、会報の配信など
        </p>
        <p className="text-base text-white font-bold text-center">
          皆様のご入会お待ちしております！
        </p>
      </div>

      <Separator className="mb-12" />

      {/* Supporter's Content */}
      <SupportersContent />

      {/* 会員種別 */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">会員種別</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 overflow-hidden group hover:bg-white/15 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <Image src={kojinImg} alt="個人会員" className="w-full h-auto rounded-lg" />
            </div>
          </div>
          <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 overflow-hidden group hover:bg-white/15 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <Image src={houjinImg} alt="法人会員" className="w-full h-auto rounded-lg" />
            </div>
          </div>
          <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 overflow-hidden group hover:bg-white/15 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <Image
                src={puratinaImg}
                alt="プラチナ会員"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 特典一覧 */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">特典一覧</h2>
        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 overflow-hidden group hover:bg-white/15 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative z-10">
            <Image src={tokutenImg} alt="特典一覧" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      </div>

      {/* 特典詳細 */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">特典詳細</h2>
        <p className="text-base md:text-lg text-white/90 mb-12 text-center">
          会員種別ごとに充実した特典をご用意しています
        </p>

        {/* 全会員共通特典 */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-3 text-center">
            全会員共通特典
          </h3>
          <p className="text-sm text-white/80 mb-8 text-center">
            対象: PLATINUM / BUSINESS / INDIVIDUAL
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.individual.map((benefit, index) => (
              <div key={index} className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 overflow-hidden group hover:bg-white/15 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="relative h-40 mb-4">
                    <Image
                      src={benefit.image}
                      alt={benefit.title}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-white/90">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 法人・プラチナ会員特典 */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-3 text-center">
            法人・プラチナ会員特典
          </h3>
          <p className="text-sm text-white/80 mb-8 text-center">
            対象: PLATINUM / BUSINESS
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.business.map((benefit, index) => (
              <div key={index} className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 overflow-hidden group hover:bg-white/15 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="relative h-40 mb-4">
                    <Image
                      src={benefit.image}
                      alt={benefit.title}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-white/90">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* プラチナ会員限定特典 */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-3 text-center">
            プラチナ会員限定特典
          </h3>
          <p className="text-sm text-white/80 mb-8 text-center">対象: PLATINUM</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.platinum.map((benefit, index) => (
              <div key={index} className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 overflow-hidden group hover:bg-white/15 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="relative h-40 mb-4">
                    <Image
                      src={benefit.image}
                      alt={benefit.title}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-white/90">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 入会スケジュール */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
          入会スケジュール
        </h2>
        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 overflow-hidden group hover:bg-white/15 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative z-10">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-3">募集期間</h3>
              <p className="text-base text-white/90">通年募集</p>
              <p className="text-sm text-white/70 mt-2">
                ※いつでもご入会いただけます
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-3">会員期間</h3>
              <p className="text-base text-white/90">入会日から1年間</p>
              <p className="text-sm text-white/70 mt-2">
                ※自動更新となります
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                入会手続き
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-base text-white/90">
                <li>オンラインフォームからお申し込み</li>
                <li>お支払い手続き</li>
                <li>会員登録完了メール受信</li>
                <li>会員サイトへログイン可能</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* お支払い方法 */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
          お支払い方法
        </h2>
        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 overflow-hidden group hover:bg-white/15 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative z-10">
            <Image src={kessaiImg} alt="決済方法" className="w-full h-auto rounded-lg" />
            <p className="text-sm text-white mt-4 text-center">
              ※コンビニ決済は3月中旬より利用可能
            </p>
          </div>
        </div>
      </div>

      {/* 特典の配送時期 */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
          特典の配送時期について
        </h2>
        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 overflow-hidden group hover:bg-white/15 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative z-10">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-3">
                会員限定グッズ
              </h3>
              <p className="text-base text-white/90">入会後1ヶ月以内に発送</p>
              <p className="text-sm text-white/70 mt-2">
                ※在庫状況により遅れる場合があります
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-3">
                デジタルコンテンツ
              </h3>
              <p className="text-base text-white/90">
                入会手続き完了後、即時利用可能
              </p>
              <p className="text-sm text-white/70 mt-2">
                ※会員サイトからアクセスいただけます
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-3">会報</h3>
              <p className="text-base text-white/90">季節ごとに4回配信</p>
              <p className="text-sm text-white/70 mt-2">
                ※時期によって配信日は異なりますのでご了承ください
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-3">
                プラチナ会員限定ウェア
              </h3>
              <p className="text-base text-white/90">入会後2ヶ月以内に発送</p>
              <p className="text-sm text-white/70 mt-2">
                ※サイズ確認のご連絡をさせていただきます
              </p>
              <p className="text-sm text-white/70 mt-1">
                ※在庫状況によって発送時期が変わる可能性がありますのでご了承ください
              </p>
            </div>
            <div className="pt-6 border-t border-white/20 space-y-1 text-sm text-white/70">
              <p>※配送先は日本国内に限らせていただきます。</p>
              <p>※配送状況はマイページからご確認いただけます。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 登録手続きへのリンク */}
      <div className="text-center pb-16">
        <p className="text-lg md:text-xl text-white mb-8">
          IK ALUMNI CGTを一緒に応援しませんか？
        </p>
        <Link href="/register/terms">
          <Button className="px-12 py-6 text-lg bg-white text-brand hover:bg-white/90 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            登録手続きに進む
          </Button>
        </Link>
      </div>
      </div>
    </div>
  );
}
