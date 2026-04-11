import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { newsletters } from "@/db/schemas/newsletters";

export const newsletterFormSchema = createInsertSchema(newsletters, {
  issueNumber: z
    .number()
    .int("号数は整数で入力してください")
    .positive("号数は正の数で入力してください"),
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(255, "タイトルは255文字以内で入力してください"),
  excerpt: z
    .string()
    .trim()
    .min(1, "概要を入力してください")
    .max(500, "概要は500文字以内で入力してください"),
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
  pdfUrl: z
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
  category: z.enum(["regular", "special", "extra"]).optional(),
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
  createdAt: true,
  updatedAt: true,
});

export type NewsletterFormData = z.infer<typeof newsletterFormSchema>;
