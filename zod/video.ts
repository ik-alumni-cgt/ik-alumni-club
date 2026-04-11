import { videos } from "@/db/schemas/videos";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const videoFormSchema = createInsertSchema(videos, {
  title: z
    .string()
    .trim()
    .min(1, "動画タイトルを入力してください")
    .max(255, "動画タイトルは255文字以内で入力してください"),
  videoDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式で入力してください"),
  videoUrl: z
    .string()
    .trim()
    .min(1, "YouTube URLを入力してください")
    .refine(
      (val) => {
        try {
          const url = new URL(val);
          return url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be");
        } catch {
          return false;
        }
      },
      { message: "有効なYouTube URLを入力してください" }
    ),
  thumbnailUrl: z.string().optional(),
  published: z.boolean(),
  isMemberOnly: z.boolean(),
  isShorts: z.boolean(),
}).omit({
  id: true,
  authorId: true,
  authorName: true,
  createdAt: true,
  updatedAt: true,
});

export type VideoFormData = z.infer<typeof videoFormSchema>;
