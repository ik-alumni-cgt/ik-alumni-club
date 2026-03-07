import { Resend } from "resend";

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@example.com";
const FROM_NAME = process.env.FROM_NAME || "IK ALUMNI CLUB";
const BATCH_SIZE = 100;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set. Batch email sending will be disabled.");
    return null;
  }
  return new Resend(apiKey);
}

type BatchEmailRecipient = {
  memberId: string;
  email: string;
};

type BatchEmailResult = {
  email: string;
  memberId: string;
  status: "success" | "failed";
  errorMessage?: string;
};

export async function sendBatchEmails(params: {
  recipients: BatchEmailRecipient[];
  subject: string;
  html: string;
}): Promise<BatchEmailResult[]> {
  const { recipients, subject, html } = params;
  const resend = getResendClient();

  if (!resend) {
    console.log("=".repeat(50));
    console.log("Batch Email (Development Mode)");
    console.log("=".repeat(50));
    console.log(`Subject: ${subject}`);
    console.log(`Recipients: ${recipients.length}`);
    recipients.forEach((r) => console.log(`  - ${r.email} (${r.memberId})`));
    console.log("=".repeat(50));

    return recipients.map((r) => ({
      email: r.email,
      memberId: r.memberId,
      status: "success" as const,
    }));
  }

  const results: BatchEmailResult[] = [];

  // 100件ずつチャンクに分割
  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE);
    const emails = chunk.map((r) => ({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: r.email,
      subject,
      html,
    }));

    try {
      const { data, error } = await resend.batch.send(emails);

      if (error) {
        // バッチ全体がエラーの場合、チャンク内全員を失敗に
        for (const r of chunk) {
          results.push({
            email: r.email,
            memberId: r.memberId,
            status: "failed",
            errorMessage: error.message,
          });
        }
        continue;
      }

      // 各メールの結果をマッピング
      if (data?.data) {
        for (let j = 0; j < chunk.length; j++) {
          const recipient = chunk[j];
          const emailResult = data.data[j];

          if (emailResult?.id) {
            results.push({
              email: recipient.email,
              memberId: recipient.memberId,
              status: "success",
            });
          } else {
            results.push({
              email: recipient.email,
              memberId: recipient.memberId,
              status: "failed",
              errorMessage: "No email ID returned",
            });
          }
        }
      }
    } catch (err) {
      // 予期しないエラーの場合、チャンク内全員を失敗に
      const message = err instanceof Error ? err.message : "Unknown error";
      for (const r of chunk) {
        results.push({
          email: r.email,
          memberId: r.memberId,
          status: "failed",
          errorMessage: message,
        });
      }
    }
  }

  return results;
}
