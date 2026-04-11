import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { photoLibrary } from "@/db/schemas/photo-library";

// 画像データのスキーマ
export const photoLibraryImageSchema = z.object({
  imageUrl: z.string().min(1, "画像を選択してください"),
  caption: z.string().optional(),
});

export const photoLibraryFormSchema = createInsertSchema(photoLibrary, {
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(255, "タイトルは255文字以内で入力してください"),
  description: z
    .string()
    .trim()
    .max(1000, "説明は1000文字以内で入力してください")
    .optional(),
  coverImageUrl: z
    .string()
    .optional(),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式で入力してください")
    .optional()
    .or(z.literal("")),
  published: z.boolean(),
  isMemberOnly: z.boolean(),
}).omit({
  id: true,
  createdBy: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  images: z.array(photoLibraryImageSchema).min(1, "少なくとも1枚の画像を追加してください"),
});

export type PhotoLibraryFormData = z.infer<typeof photoLibraryFormSchema>;
export type PhotoLibraryImageFormData = z.infer<typeof photoLibraryImageSchema>;
