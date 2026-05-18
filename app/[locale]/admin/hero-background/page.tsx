import { getHeroSlides } from "@/data/hero-slide";
import { HeroSlidesManager } from "@/components/admin/hero-slides-manager";

export const dynamic = "force-dynamic";

export default async function AdminHeroBackgroundPage() {
  const slides = await getHeroSlides("background");

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">メイン写真</h1>
        <p className="text-sm text-muted-foreground">
          トップページ上部の背景スライドショー画像を管理します。
        </p>
      </div>
      <HeroSlidesManager type="background" initialSlides={slides} />
    </div>
  );
}
