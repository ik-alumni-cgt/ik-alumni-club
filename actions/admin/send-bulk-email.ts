"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { users } from "@/db/schemas/auth";
import { emailSends, emailSendRecipients } from "@/db/schemas/email-sends";
import { verifyAdmin } from "@/lib/session";
import { sendBatchEmails } from "@/lib/batch-email";
import { inArray, eq, sql } from "drizzle-orm";

type SendBulkEmailParams = {
  memberIds: string[];
  subject: string;
  body: string;
};

type SendBulkEmailResult =
  | { success: true; successCount: number; failCount: number }
  | { success: false; error: string };

export async function sendBulkEmailAction(
  params: SendBulkEmailParams
): Promise<SendBulkEmailResult> {
  try {
    // 1. 権限チェック
    const { userId } = await verifyAdmin();

    const { memberIds, subject, body } = params;

    if (memberIds.length === 0) {
      return { success: false, error: "送信先が選択されていません" };
    }

    if (!subject.trim()) {
      return { success: false, error: "件名を入力してください" };
    }

    if (!body.trim()) {
      return { success: false, error: "本文を入力してください" };
    }

    // 2. 会員のメールアドレスを取得（members.email → users.email の順でフォールバック）
    const targetMembers = await db
      .select({
        id: members.id,
        memberEmail: members.email,
        userEmail: users.email,
      })
      .from(members)
      .innerJoin(users, eq(members.userId, users.id))
      .where(inArray(members.id, memberIds));

    const validMembers = targetMembers
      .map((m) => ({
        id: m.id,
        email: m.memberEmail || m.userEmail,
      }))
      .filter((m): m is { id: string; email: string } => m.email !== null);

    if (validMembers.length === 0) {
      return { success: false, error: "有効なメールアドレスの会員が見つかりません" };
    }

    // 3. email_sends レコード作成
    const [emailSend] = await db
      .insert(emailSends)
      .values({
        subject,
        body,
        sentBy: userId,
        totalCount: validMembers.length,
        successCount: 0,
        failCount: 0,
      })
      .returning();

    // 4. email_send_recipients レコード一括作成
    await db.insert(emailSendRecipients).values(
      validMembers.map((m) => ({
        emailSendId: emailSend.id,
        memberId: m.id,
        email: m.email,
        status: "pending" as const,
      }))
    );

    // 5. バッチメール送信
    const results = await sendBatchEmails({
      recipients: validMembers.map((m) => ({
        memberId: m.id,
        email: m.email,
      })),
      subject,
      html: body,
    });

    // 6. 各 recipient の status を更新
    for (const result of results) {
      await db
        .update(emailSendRecipients)
        .set({
          status: result.status,
          errorMessage: result.errorMessage ?? null,
          sentAt: new Date(),
        })
        .where(
          sql`${emailSendRecipients.emailSendId} = ${emailSend.id} AND ${emailSendRecipients.email} = ${result.email}`
        );
    }

    // 7. emailSends の集計更新
    const successCount = results.filter((r) => r.status === "success").length;
    const failCount = results.filter((r) => r.status === "failed").length;

    await db
      .update(emailSends)
      .set({ successCount, failCount })
      .where(eq(emailSends.id, emailSend.id));

    return { success: true, successCount, failCount };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "予期しないエラーが発生しました";
    console.error("[sendBulkEmailAction] エラー:", error);
    return { success: false, error: message };
  }
}
