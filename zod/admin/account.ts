import { z } from "zod";
import { memberProfileFormSchema } from "@/zod/member-profile";

/**
 * 管理者用会員編集フォームのバリデーションスキーマ
 * 個人情報 + 会員設定（プラン、権限、ステータス）
 */
export const adminAccountFormSchema = memberProfileFormSchema.extend({
  // プラン設定
  planId: z.number().nullable().optional(),

  // 権限設定
  role: z.enum(["admin", "officer", "member"], {
    message: "権限を選択してください",
  }),

  // ステータス設定
  status: z.enum(["pending_profile", "active", "inactive"], {
    message: "ステータスを選択してください",
  }),

  // アクティブフラグ
  isActive: z.boolean(),

  // 編集者フラグ（メンバーブログの執筆可否）
  isEditor: z.boolean(),
});

export type AdminAccountFormData = z.infer<typeof adminAccountFormSchema>;
