import { z } from "zod";

/**
 * 編集者招待の作成フォーム。
 * 氏名は本人に入力してもらうため、ここでは管理者用のメモだけを受け取る。
 */
export const editorInviteFormSchema = z.object({
  label: z
    .string()
    .trim()
    .max(100, "メモは100文字以内で入力してください")
    .optional()
    .or(z.literal("")),

  // 何人まで使えるか。リンクが外に漏れたときの影響を絞るための上限
  maxUses: z
    .number()
    .int("整数で入力してください")
    .min(1, "1以上で入力してください")
    .max(200, "200以下で入力してください"),
});

export type EditorInviteFormData = z.infer<typeof editorInviteFormSchema>;
