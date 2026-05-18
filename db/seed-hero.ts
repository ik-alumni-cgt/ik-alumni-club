/**
 * hero_slides テーブルへ既存のヒーロー画像を投入する。
 * カルーセル5枚（public/hero/）と背景44枚（public/hero-bg/）を対象とする。
 *
 * 一度きりの実行を想定。再実行しても重複しないよう、
 * type ごとに全削除してから投入する（冪等）。
 *
 * 実行: pnpm seed:hero
 */
import { eq } from "drizzle-orm";
import { db } from "./index";
import { heroSlides } from "./schemas/hero-slides";

// カルーセル画像（旧 components/hero/hero-carousel.tsx の定義を移植）
const carouselSeed: { imageUrl: string; linkUrl: string }[] = [
  {
    imageUrl: "/hero/hero1.jpg",
    linkUrl: "https://www.ik-alumni-cgt.com/information/msF6BJczMaceyFyaYXiOh",
  },
  {
    imageUrl: "/hero/hero2.jpg",
    linkUrl: "https://www.ik-alumni-cgt.com/supporters",
  },
  {
    imageUrl: "/hero/hero3.jpg",
    linkUrl: "https://www.ik-alumni-cgt.com/information/tO6hO-rok6TmGAydrXtXV",
  },
  {
    imageUrl: "/hero/hero4.jpg",
    linkUrl: "https://linktr.ee/ik_alumni_2022",
  },
  {
    imageUrl: "/hero/hero5.jpg",
    linkUrl: "https://www.ik-alumni-cgt.com/information/Q0qmGTSBsw4KsQLK0OTGW",
  },
];

// 背景画像（旧 components/hero/hero-bg-slideshow.tsx の定義を移植）
const backgroundNumbers = [
  "１", "２", "３", "４", "５", "６", "７", "８", "９", "１０",
  "１１", "１２", "１３", "１４", "１５", "１６", "１７", "１８", "１９", "２０",
  "２１", "２２", "２３", "２４", "２５", "２６", "２７", "２８", "２９", "３０",
  "３１", "３２", "３３", "３４", "３５", "３６", "３７", "３８", "３９", "４０",
  "４１", "４２", "４３", "４４",
];

const backgroundExtensions: Record<string, string> = {
  "１": "jpg", "２": "jpg", "３": "jpg", "４": "jpg", "５": "JPG",
  "６": "JPG", "７": "jpg", "８": "JPEG", "９": "JPEG", "１０": "JPEG",
  "１１": "jpg", "１２": "JPG", "１３": "jpg", "１４": "JPEG", "１５": "jpg",
  "１６": "jpg", "１７": "JPG", "１８": "JPEG", "１９": "jpg", "２０": "JPG",
  "２１": "JPG", "２２": "JPG", "２３": "JPG", "２４": "JPG", "２５": "JPG",
  "２６": "JPG", "２７": "JPG", "２８": "jpg", "２９": "JPG", "３０": "JPG",
  "３１": "JPG", "３２": "JPEG", "３３": "jpg", "３４": "JPG", "３５": "jpg",
  "３６": "jpg", "３７": "JPG", "３８": "jpg", "３９": "JPG", "４０": "JPEG",
  "４１": "JPG", "４２": "JPG", "４３": "jpg", "４４": "jpg",
};

const backgroundSeed = backgroundNumbers.map((num) => ({
  imageUrl: `/hero-bg/${num}.${backgroundExtensions[num]}`,
}));

async function main() {
  await db.transaction(async (tx) => {
    await tx.delete(heroSlides).where(eq(heroSlides.type, "carousel"));
    await tx.delete(heroSlides).where(eq(heroSlides.type, "background"));

    await tx.insert(heroSlides).values(
      carouselSeed.map((slide, index) => ({
        type: "carousel",
        imageUrl: slide.imageUrl,
        linkUrl: slide.linkUrl,
        sortOrder: index,
      }))
    );

    await tx.insert(heroSlides).values(
      backgroundSeed.map((slide, index) => ({
        type: "background",
        imageUrl: slide.imageUrl,
        linkUrl: null,
        sortOrder: index,
      }))
    );
  });

  console.log(
    `hero_slides を投入しました: carousel ${carouselSeed.length}件 / background ${backgroundSeed.length}件`
  );
  process.exit(0);
}

main().catch((error) => {
  console.error("シードに失敗しました:", error);
  process.exit(1);
});
