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

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "cgt.ik.est2022@gmail.com";

const NOTIFICATION_EMAILS = [
  ADMIN_EMAIL,
  "k.1hsnm@softbank.ne.jp",
  "c5.-_-.328@softbank.ne.jp",
];

/**
 * 問い合わせ通知メールを管理者に送信
 */
export async function sendContactNotificationEmail({
  name,
  email,
  category,
  subject,
  body,
}: {
  name: string;
  email: string;
  category: string;
  subject: string;
  body: string;
}) {
  const resend = getResendClient();

  if (!resend) {
    console.log("=".repeat(50));
    console.log("Contact Notification Email (Development Mode)");
    console.log("=".repeat(50));
    console.log(`To: ${ADMIN_EMAIL}`);
    console.log(`From: ${name} <${email}>`);
    console.log(`Category: ${category}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log("=".repeat(50));
    return { id: "dev-mode" };
  }

  const { data, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `【お問い合わせ】${subject}`,
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
      お問い合わせを受け付けました
    </h1>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e0e0e0; width: 120px;">名前</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">メール</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">カテゴリ</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${category}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">件名</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${subject}</td>
      </tr>
    </table>

    <div style="background-color: #fff; padding: 16px; border-radius: 4px; border: 1px solid #e0e0e0;">
      <p style="font-weight: bold; margin-bottom: 8px;">お問い合わせ内容:</p>
      <p style="white-space: pre-wrap; margin: 0;">${body}</p>
    </div>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="font-size: 12px; color: #999; text-align: center;">
      このメールはIK ALUMNI CLUBのお問い合わせフォームから自動送信されています。
    </p>
  </div>
</body>
</html>
    `,
  });

  if (error) {
    console.error("Failed to send contact notification email:", error);
    throw new Error("管理者への通知メールの送信に失敗しました");
  }

  return data;
}

/**
 * 問い合わせ受付確認メールを送信者に送信
 */
export async function sendContactConfirmationEmail({
  name,
  email,
  category,
  subject,
  body,
}: {
  name: string;
  email: string;
  category: string;
  subject: string;
  body: string;
}) {
  const resend = getResendClient();

  if (!resend) {
    console.log("=".repeat(50));
    console.log("Contact Confirmation Email (Development Mode)");
    console.log("=".repeat(50));
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log("=".repeat(50));
    return { id: "dev-mode" };
  }

  const { data, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: "【IK ALUMNI CLUB】お問い合わせを受け付けました",
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
      お問い合わせを受け付けました
    </h1>

    <p style="margin-bottom: 20px;">
      ${name} 様
    </p>

    <p style="margin-bottom: 20px;">
      この度はお問い合わせいただきありがとうございます。<br>
      以下の内容でお問い合わせを受け付けました。<br>
      内容を確認の上、担当者よりご連絡いたします。
    </p>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e0e0e0; width: 120px;">カテゴリ</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${category}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">件名</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${subject}</td>
      </tr>
    </table>

    <div style="background-color: #fff; padding: 16px; border-radius: 4px; border: 1px solid #e0e0e0;">
      <p style="font-weight: bold; margin-bottom: 8px;">お問い合わせ内容:</p>
      <p style="white-space: pre-wrap; margin: 0;">${body}</p>
    </div>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="font-size: 12px; color: #999; text-align: center;">
      このメールは自動送信されています。<br>
      このメールに返信いただいてもお答えできませんのでご了承ください。
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
    console.error("Failed to send contact confirmation email:", error);
    throw new Error("確認メールの送信に失敗しました");
  }

  return data;
}

/**
 * 新規サインアップ通知メールを管理者に送信
 */
export async function sendSignupNotificationEmail({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const resend = getResendClient();

  const signupDate = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });

  if (!resend) {
    console.log("=".repeat(50));
    console.log("Signup Notification Email (Development Mode)");
    console.log("=".repeat(50));
    console.log(`To: ${NOTIFICATION_EMAILS.join(", ")}`);
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Date: ${signupDate}`);
    console.log("=".repeat(50));
    return { id: "dev-mode" };
  }

  const { data, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: NOTIFICATION_EMAILS,
    subject: "【IK ALUMNI CLUB】新規ユーザー登録がありました",
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
      新規ユーザー登録通知
    </h1>

    <p style="margin-bottom: 20px;">
      新しいユーザーがアカウントを作成しました。
    </p>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e0e0e0; width: 120px;">名前</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">メール</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">登録日時</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${signupDate}</td>
      </tr>
    </table>

    <p style="margin-bottom: 10px; font-size: 14px; color: #666;">
      このユーザーはまだ決済を完了していません。
    </p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="font-size: 12px; color: #999; text-align: center;">
      このメールはIK ALUMNI CLUBから自動送信されています。
    </p>
  </div>
</body>
</html>
    `,
  });

  if (error) {
    console.error("Failed to send signup notification email:", error);
    throw new Error("サインアップ通知メールの送信に失敗しました");
  }

  return data;
}

/**
 * 決済完了通知メールを管理者に送信
 */
export async function sendPaymentCompletedNotificationEmail({
  name,
  email,
  paymentMode,
}: {
  name: string;
  email: string;
  paymentMode: string;
}) {
  const resend = getResendClient();

  const completedDate = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });
  const paymentModeLabel = paymentMode === "subscription" ? "サブスクリプション" : "一括払い";

  if (!resend) {
    console.log("=".repeat(50));
    console.log("Payment Completed Notification Email (Development Mode)");
    console.log("=".repeat(50));
    console.log(`To: ${NOTIFICATION_EMAILS.join(", ")}`);
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Payment Mode: ${paymentModeLabel}`);
    console.log(`Date: ${completedDate}`);
    console.log("=".repeat(50));
    return { id: "dev-mode" };
  }

  const { data, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: NOTIFICATION_EMAILS,
    subject: "【IK ALUMNI CLUB】新規会員の決済が完了しました",
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
      決済完了通知
    </h1>

    <p style="margin-bottom: 20px;">
      新規会員の決済が完了しました。
    </p>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e0e0e0; width: 120px;">名前</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">メール</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">決済方法</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${paymentModeLabel}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">完了日時</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">${completedDate}</td>
      </tr>
    </table>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="font-size: 12px; color: #999; text-align: center;">
      このメールはIK ALUMNI CLUBから自動送信されています。
    </p>
  </div>
</body>
</html>
    `,
  });

  if (error) {
    console.error("Failed to send payment completed notification email:", error);
    throw new Error("決済完了通知メールの送信に失敗しました");
  }

  return data;
}
