"use server";

import { verifyAdmin } from "@/lib/session";
import { sendTestEmail } from "@/lib/email";

/**
 * テストメールを送信（cgt.ik.est2022@gmail.com 宛）
 * @returns 成功時は { success: true }、失敗時は { success: false, error: string }
 */
export async function sendTestEmailAction(): Promise<
  { success: true } | { success: false; error: string }
> {
  try {
    // 1. 管理者権限チェック
    await verifyAdmin();

    // 2. テストメール送信
    await sendTestEmail();

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "予期しないエラーが発生しました";
    console.error("[sendTestEmailAction] エラー:", error);
    return { success: false, error: message };
  }
}
