import { getHeroSlides } from "@/data/hero-slide";
import { HeroSlidesManager } from "@/components/admin/hero-slides-manager";

export const dynamic = "force-dynamic";

export default async function AdminHeroCarouselPage() {
  const slides = await getHeroSlides("carousel");

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">ヒーローカルーセル</h1>
        <p className="text-sm text-muted-foreground">
          トップページ上部のカルーセル画像を管理します。各画像にリンク先URLが必要です。
        </p>
      </div>
      <HeroSlidesManager type="carousel" initialSlides={slides} />
    </div>
  );
}
