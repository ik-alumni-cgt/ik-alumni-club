import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { blogs } from "@/db/schemas/blogs";

export const blogFormSchema = createInsertSchema(blogs, {
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(255, "タイトルは255文字以内で入力してください"),
  excerpt: z
    .string()
    .trim()
    .min(1, "抜粋を入力してください")
    .max(500, "抜粋は500文字以内で入力してください"),
  content: z
    .string()
    .trim()
    .min(1, "本文を入力してください"),
  thumbnailUrl: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "有効なURLを入力してください" }
    ),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式で入力してください")
    .optional()
    .or(z.literal("")),
  published: z.boolean(),
}).omit({
  id: true,
  authorId: true,
  authorName: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
});

export type BlogFormData = z.infer<typeof blogFormSchema>;
