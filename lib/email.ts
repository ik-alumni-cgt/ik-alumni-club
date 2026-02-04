import { Resend } from "resend";

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@example.com";
const FROM_NAME = process.env.FROM_NAME || "IK ALUMNI CLUB";

// Resend APIキーがない場合はnullを返す（開発環境用）
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set. Email sending will be disabled.");
    return null;
  }
  return new Resend(apiKey);
}

export async function sendPasswordResetEmail({
  email,
  resetLink,
}: {
  email: string;
  resetLink: string;
}) {
  const resend = getResendClient();

  if (!resend) {
    // 開発環境ではコンソールにログを出力
    console.log("=".repeat(50));
    console.log("📧 Password Reset Email (Development Mode)");
    console.log("=".repeat(50));
    console.log(`To: ${email}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log("=".repeat(50));
    return { id: "dev-mode" };
  }

  const { data, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: "【IK ALUMNI CLUB】パスワードリセットのご案内",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
    <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px; text-align: center;">
      パスワードリセットのご案内
    </h1>

    <p style="margin-bottom: 20px;">
      IK ALUMNI CLUBをご利用いただきありがとうございます。
    </p>

    <p style="margin-bottom: 20px;">
      パスワードリセットのリクエストを受け付けました。<br>
      以下のボタンをクリックして、新しいパスワードを設定してください。
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}"
         style="display: inline-block; background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        パスワードを再設定する
      </a>
    </div>

    <p style="margin-bottom: 10px; font-size: 14px; color: #666;">
      このリンクは24時間有効です。
    </p>

    <p style="margin-bottom: 10px; font-size: 14px; color: #666;">
      このメールに心当たりがない場合は、このメールを無視してください。<br>
      パスワードは変更されません。
    </p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="font-size: 12px; color: #999; text-align: center;">
      このメールは自動送信されています。<br>
      ご不明な点がございましたら、お問い合わせページよりご連絡ください。
    </p>

    <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
      IK ALUMNI CLUB
    </p>
  </div>
</body>
</html>
    `,
  });

  if (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("メールの送信に失敗しました");
  }

  return data;
}
