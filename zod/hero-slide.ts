import { z } from "zod";

export const HERO_SLIDE_TYPES = ["carousel", "background"] as const;

export const heroSlideTypeSchema = z.enum(HERO_SLIDE_TYPES);

export type HeroSlideType = (typeof HERO_SLIDE_TYPES)[number];

// 1スライドの入力（リンクはカルーセルのみ使用）
export const heroSlideInputSchema = z.object({
  imageUrl: z.string().trim().min(1, "画像が必要です"),
  linkUrl: z.string().trim().optional(),
});

// 指定 type の全スライドを一括保存するペイロード
export const saveHeroSlidesSchema = z
  .object({
    type: heroSlideTypeSchema,
    slides: z.array(heroSlideInputSchema),
  })
  .superRefine((data, ctx) => {
    // カルーセル画像は有効なリンク先URLを必須とする
    if (data.type !== "carousel") return;
    data.slides.forEach((slide, index) => {
      if (!z.string().url().safeParse(slide.linkUrl).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "カルーセル画像には有効なリンク先URLが必要です",
          path: ["slides", index, "linkUrl"],
        });
      }
    });
  });

export type HeroSlideInput = z.infer<typeof heroSlideInputSchema>;
export type SaveHeroSlidesData = z.infer<typeof saveHeroSlidesSchema>;
