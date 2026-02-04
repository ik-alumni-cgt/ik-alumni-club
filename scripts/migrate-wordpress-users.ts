/**
 * WordPressからユーザーを移行するスクリプト
 *
 * 使用方法:
 * pnpm tsx scripts/migrate-wordpress-users.ts ./wp-members-user-export-2026-01-26.csv
 *
 * CSVフォーマット（WordPressエクスポート形式）:
 * ユーザー ID,ユーザー名,Email,姓,名,セイ（姓カタカナ）,メイ（名カタカナ）,電話番号,郵便番号,都道府県,市区町村,町名以降の住所,建物名（任意）,Website,会員種別,承認,確認済み ?,登録済み,IP,権限グループ,プラチナ会員,法人会員,個人会員
 */

import { config } from "dotenv";
import postgres from "postgres";
import { readFileSync } from "fs";
import { nanoid } from "nanoid";

// .envファイルを読み込む
config({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URLが設定されていません");
  process.exit(1);
}

// CSVファイルのパスを取得
const csvFilePath = process.argv[2];

if (!csvFilePath) {
  console.error("❌ CSVファイルのパスを指定してください");
  console.error(
    "使用方法: pnpm tsx scripts/migrate-wordpress-users.ts ./wp-members-user-export-2026-01-26.csv"
  );
  process.exit(1);
}

interface WordPressUser {
  "ユーザー ID": string;
  ユーザー名: string;
  Email: string;
  姓: string;
  名: string;
  "セイ（姓カタカナ）": string;
  "メイ（名カタカナ）": string;
  電話番号: string;
  郵便番号: string;
  都道府県: string;
  市区町村: string;
  町名以降の住所: string;
  "建物名（任意）": string;
  Website: string;
  会員種別: string;
  承認: string;
  "確認済み ?": string;
  登録済み: string;
  IP: string;
  権限グループ: string;
  プラチナ会員: string;
  法人会員: string;
  個人会員: string;
}

function parseCSV(content: string): WordPressUser[] {
  // BOMを削除
  const cleanContent = content.replace(/^\uFEFF/, "");
  const lines = cleanContent.trim().split("\n");

  // ヘッダー行をパース
  const headers = parseCSVLine(lines[0]).map((h) => h.trim().replace(/^"|"$/g, ""));

  console.log("📋 検出されたカラム:", headers.join(", "));

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const user: Record<string, string> = {};

    headers.forEach((header, index) => {
      user[header] = values[index]?.trim().replace(/^"|"$/g, "") || "";
    });

    return user as unknown as WordPressUser;
  });
}

// CSV行をパース（カンマを含むフィールドに対応）
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// プランコードを判定
function determinePlanCode(user: WordPressUser): string {
  if (user.プラチナ会員 === "1") {
    return "platinum_individual";
  } else if (user.法人会員 === "1") {
    return "business";
  } else if (user.個人会員 === "1") {
    return "individual";
  }
  // デフォルトは個人会員
  return "individual";
}

async function migrateUsers() {
  const sql = postgres(DATABASE_URL as string);

  try {
    console.log("📂 CSVファイルを読み込み中...");
    const csvContent = readFileSync(csvFilePath, "utf-8");
    const users = parseCSV(csvContent);

    // 管理者とテストユーザーを除外
    const filteredUsers = users.filter((user) => {
      // 権限グループが administrator または editor は除外
      if (user.権限グループ === "administrator" || user.権限グループ === "editor") {
        console.log(`  ⏭️  ${user.Email} - 管理者/編集者のため除外`);
        return false;
      }
      // メールアドレスが空は除外
      if (!user.Email || !user.Email.includes("@")) {
        console.log(`  ⏭️  無効なメールアドレスのため除外`);
        return false;
      }
      // 姓名が明らかにテストデータは除外
      if (user.姓 === "s" && user.名 === "s") {
        console.log(`  ⏭️  ${user.Email} - テストデータのため除外`);
        return false;
      }
      return true;
    });

    console.log(`📊 ${filteredUsers.length}件のユーザーデータを移行対象として検出しました\n`);

    // プラン情報を取得
    console.log("🔍 プラン情報を取得中...");
    const plans = await sql`
      SELECT id, plan_code FROM member_plans WHERE is_active = true
    `;
    const planMap = new Map(plans.map((p) => [p.plan_code as string, p.id as number]));

    console.log("📋 利用可能なプラン:");
    plans.forEach((p) => {
      console.log(`  - ${p.plan_code} (ID: ${p.id})`);
    });

    // 既存のメールアドレスを取得
    const existingEmails = await sql`
      SELECT email FROM users
    `;
    const existingEmailSet = new Set(
      existingEmails.map((e) => (e.email as string).toLowerCase())
    );

    console.log(`\n✅ 移行処理を開始します...\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    const errors: Array<{ email: string; error: string }> = [];

    for (const user of filteredUsers) {
      try {
        const email = user.Email.toLowerCase();

        // メールアドレスの重複チェック
        if (existingEmailSet.has(email)) {
          console.log(`  ⏭️  ${email} - 既に存在します（スキップ）`);
          skipCount++;
          continue;
        }

        // プランコードを判定
        const planCode = determinePlanCode(user);
        const planId = planMap.get(planCode);

        if (!planId) {
          console.log(
            `  ⚠️  ${email} - プランコード "${planCode}" が見つかりません（スキップ）`
          );
          errors.push({ email, error: `無効なプランコード: ${planCode}` });
          errorCount++;
          continue;
        }

        // トランザクション開始
        await sql.begin(async (tx) => {
          // 1. usersテーブルにレコード作成
          const userId = nanoid(10);
          const userName =
            `${user.姓} ${user.名}`.trim() || email.split("@")[0];

          await tx`
            INSERT INTO users (id, name, email, email_verified, created_at, updated_at)
            VALUES (${userId}, ${userName}, ${email}, false, NOW(), NOW())
          `;

          // 2. accountsテーブルにcredential認証用レコード作成（パスワードなし）
          const accountId = nanoid(10);

          await tx`
            INSERT INTO accounts (id, account_id, provider_id, user_id, password, created_at, updated_at)
            VALUES (${accountId}, ${email}, 'credential', ${userId}, NULL, NOW(), NOW())
          `;

          // 3. membersテーブルにレコード作成
          const memberId = nanoid(10);

          // 郵便番号のハイフンを統一（削除）
          const postalCode = user.郵便番号.replace(/-/g, "");

          await tx`
            INSERT INTO members (
              id, user_id, email,
              last_name, first_name, last_name_kana, first_name_kana,
              postal_code, prefecture, city, address, building,
              phone_number,
              plan_id, role, status, profile_completed, is_active,
              payment_status, is_migrated, migrated_at,
              created_at, updated_at
            )
            VALUES (
              ${memberId}, ${userId}, ${email},
              ${user.姓}, ${user.名}, ${user["セイ（姓カタカナ）"]}, ${user["メイ（名カタカナ）"]},
              ${postalCode}, ${user.都道府県}, ${user.市区町村}, ${user.町名以降の住所}, ${user["建物名（任意）"] || null},
              ${user.電話番号},
              ${planId}, 'member', 'active', true, true,
              'pending', true, NOW(),
              NOW(), NOW()
            )
          `;
        });

        existingEmailSet.add(email);
        console.log(
          `  ✓ ${email} (${user.姓} ${user.名}) [${planCode}] - 移行完了`
        );
        successCount++;
      } catch (error) {
        console.error(`  ❌ ${user.Email} - エラー:`, error);
        errors.push({ email: user.Email, error: String(error) });
        errorCount++;
      }
    }

    // 結果レポート
    console.log("\n" + "=".repeat(50));
    console.log("📊 移行結果レポート");
    console.log("=".repeat(50));
    console.log(`  成功: ${successCount}件`);
    console.log(`  スキップ（既存）: ${skipCount}件`);
    console.log(`  エラー: ${errorCount}件`);
    console.log(`  合計: ${filteredUsers.length}件`);

    if (errors.length > 0) {
      console.log("\n⚠️  エラー詳細:");
      errors.forEach((e) => {
        console.log(`  - ${e.email}: ${e.error}`);
      });
    }

    console.log("\n✨ 移行処理が完了しました！");
    console.log("\n📌 次のステップ:");
    console.log("  1. 移行ユーザーに案内メールを送信してください");
    console.log(
      "  2. メールでパスワードリセットまたはソーシャルログインを案内してください"
    );
    console.log(
      "  3. ユーザーがログイン後、決済登録を促すバナーが表示されます"
    );
  } catch (error) {
    console.error("❌ 予期せぬエラーが発生しました:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// スクリプトを実行
migrateUsers();
