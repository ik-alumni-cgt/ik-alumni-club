# LINEログイン実装設計書

**作成日**: 2026-01-10
**バージョン**: 1.0
**ステータス**: 調査完了・実装待ち

---

## 目次

1. [概要](#1-概要)
2. [現在の認証システムとの互換性](#2-現在の認証システムとの互換性)
3. [LINE Login APIの要件](#3-line-login-apiの要件)
4. [実装に必要な変更点](#4-実装に必要な変更点)
5. [実装手順](#5-実装手順)
6. [工数見積もり](#6-工数見積もり)
7. [セキュリティ考慮事項](#7-セキュリティ考慮事項)
8. [実装チェックリスト](#8-実装チェックリスト)
9. [参考資料](#9-参考資料)

---

## 1. 概要

### 1.1 目的

IK ALUMNI CGT サポーターズクラブ会員サイトにLINEログイン機能を追加し、ユーザーの利便性を向上させる。

### 1.2 調査結果サマリー

| 評価項目 | 結果 |
|----------|------|
| 技術的実現性 | **可能** ✅ |
| 難易度 | **低〜中** |
| DBスキーマ変更 | **不要** |
| 最小工数 | **約4〜5時間（1人日）** |

### 1.3 Better AuthのLINE対応状況

**Better Auth v1.3.23はLINE Loginに正式対応しています。**

- 専用の設定オプションが用意されている
- OAuth 2.0フローを自動処理
- accountsテーブルでソーシャル連携情報を管理

---

## 2. 現在の認証システムとの互換性

### 2.1 使用技術

| 項目 | 現在の実装 | LINE対応 |
|------|-----------|----------|
| 認証フレームワーク | Better Auth v1.3.23 | ✅ 正式対応 |
| ORM | Drizzle ORM | ✅ 対応済み |
| データベース | PostgreSQL | ✅ 変更不要 |
| 認証方式 | Email + Password | ✅ 並行動作可能 |

### 2.2 認証層のスキーマ設計

プロジェクトでは**2層構造**の認証システムが実装されています。

**認証層（Better Auth管理）**:
- `users`テーブル: ユーザー基本情報
- `sessions`テーブル: セッション管理
- `accounts`テーブル: OAuth/ソーシャル連携用 ← **LINEはここに保存**
- `verifications`テーブル: メール認証用

**会員管理層（独自実装）**:
- `members`テーブル: ビジネスロジック層（会員プロフィール、権限、ステータス等）

### 2.3 accountsテーブルの構造

LINEログイン情報は既存の`accounts`テーブルに保存されます。

| カラム | LINEログイン時の値 |
|--------|-------------------|
| providerId | `"line"` |
| accountId | LINE ユーザーID |
| accessToken | LINEアクセストークン |
| idToken | LINE IDトークン |
| refreshToken | なし（LINEは更新非対応） |
| scope | `"openid profile email"` |

**スキーマ変更は不要です。**

---

## 3. LINE Login APIの要件

### 3.1 LINE Developers側での設定

#### 必須条件

1. **LINE Developersアカウント登録**
   - https://developers.line.biz/console/

2. **LINE Login チャネルの作成**
   - プロバイダーを作成（または既存のものを使用）
   - 「LINE Login」チャネルを新規作成
   - アプリタイプ: "Web app" を選択

#### 取得する認証情報

| 項目 | 説明 |
|------|------|
| Channel ID | クライアントID（`LINE_CLIENT_ID`） |
| Channel Secret | クライアントシークレット（`LINE_CLIENT_SECRET`） |

### 3.2 コールバックURL設定

LINE Developers Consoleの「LINE Login設定」で以下URLを登録します。

| 環境 | コールバックURL |
|------|-----------------|
| ローカル開発 | `http://localhost:3000/api/auth/callback/line` |
| ステージング | `https://staging.yourdomain.com/api/auth/callback/line` |
| 本番 | `https://yourdomain.com/api/auth/callback/line` |

**注意**: URLは完全一致が必要（スキーム、ドメイン、パス全て）

### 3.3 スコープ設定

| スコープ | 説明 | 必須 |
|---------|------|------|
| `openid` | ユーザーID取得 | はい |
| `profile` | プロフィール情報（名前、画像） | 推奨 |
| `email` | メールアドレス取得 | 推奨（要申請） |

**注意**: `email`スコープを使用する場合、LINE側での事前許可申請が必要です。

### 3.4 認証フロー

```
1. ユーザーがLINEログインボタンをクリック
   ↓
2. LINE認可エンドポイントにリダイレクト
   https://access.line.me/oauth2/v2.1/authorize
   ↓
3. ユーザーがLINEでログイン・認可
   ↓
4. コールバックURLにリダイレクト
   /api/auth/callback/line?code=xxx&state=xxx
   ↓
5. Better Authがトークン交換を実行
   ↓
6. ユーザー情報取得・セッション作成
   ↓
7. アプリケーションにリダイレクト
```

### 3.5 トークン有効期限

| トークン | 有効期限 |
|----------|----------|
| アクセストークン | 30日間 |
| リフレッシュトークン | なし（LINEは更新非対応） |

---

## 4. 実装に必要な変更点

### 4.1 環境変数の追加

`.env`および`.env.example`に以下を追加します。

```env
# LINE Login設定
LINE_CLIENT_ID=your_channel_id
LINE_CLIENT_SECRET=your_channel_secret
```

### 4.2 Better Auth設定の変更

**ファイル**: `lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // ... 既存設定

  socialProviders: {
    line: {
      clientId: process.env.LINE_CLIENT_ID as string,
      clientSecret: process.env.LINE_CLIENT_SECRET as string,
      // オプション: スコープ指定（デフォルトは openid, profile, email）
      // scopes: ["openid", "profile", "email"],
    },
  },

  // ... 他の設定
});
```

### 4.3 フロントエンド（ログインフォーム）の変更

**ファイル**: `components/login-form/login-form.tsx`

```typescript
import { authClient } from "@/lib/auth-client";

// LINEログイン処理
const handleLineLogin = async () => {
  try {
    setIsLoading(true);
    await authClient.signIn.social({ provider: "line" });
  } catch (error) {
    console.error("LINE ログインエラー:", error);
    setError("LINEでのログインに失敗しました");
  } finally {
    setIsLoading(false);
  }
};

// JSXにLINEログインボタンを追加
<Button
  type="button"
  variant="outline"
  className="w-full"
  onClick={handleLineLogin}
  disabled={isLoading}
>
  <LineIcon className="mr-2 h-4 w-4" />
  LINEでログイン
</Button>
```

### 4.4 サインアップフローの変更（オプション）

**ファイル**: `components/register/register-auth-form.tsx`

LINEでの新規登録時、自動的に`members`レコードを作成する処理を追加します。

```typescript
// LINEで登録ボタン
const handleLineSignUp = async () => {
  try {
    setIsLoading(true);
    // LINEログイン実行
    await authClient.signIn.social({
      provider: "line",
      callbackURL: "/register/payment" // 登録フローに戻す
    });
  } catch (error) {
    console.error("LINE 登録エラー:", error);
  } finally {
    setIsLoading(false);
  }
};
```

### 4.5 データベーススキーマの変更

**変更不要です。**

既存の`accounts`テーブルがOAuth連携に対応しており、LINEの情報を保存できます。

---

## 5. 実装手順

### フェーズ1: 基本的なLINEログイン実装（推奨）

#### Step 1: LINE Developersでチャネル作成

1. [LINE Developers Console](https://developers.line.biz/console/) にアクセス
2. プロバイダーを作成（または既存のものを選択）
3. 「LINE Login」チャネルを新規作成
4. Channel IDとChannel Secretを取得
5. Callback URLを登録

#### Step 2: 環境変数設定

```bash
# .env.local
LINE_CLIENT_ID=1234567890
LINE_CLIENT_SECRET=abcdefghijklmnopqrstuvwxyz
```

#### Step 3: Better Auth設定更新

`lib/auth.ts`に`socialProviders.line`を追加

#### Step 4: ログインフォーム更新

`components/login-form/login-form.tsx`にLINEログインボタンを追加

#### Step 5: 動作確認

- ローカル環境でLINEログインをテスト
- セッション作成・ユーザー情報取得を確認

### フェーズ2: 登録フローの統合（追加実装）

- サインアップフォームにもLINEボタンを追加
- LINE情報からプロフィールを自動入力
- 既存ユーザーへのLINE連携機能

### フェーズ3: 本番化対応

- 本番環境のCallback URL登録
- セキュリティ監査
- エラーハンドリング強化
- ドキュメント更新

---

## 6. 工数見積もり

### 6.1 フェーズ別工数

| フェーズ | タスク | 工数 |
|---------|--------|------|
| **フェーズ1** | 基本実装 | **約4〜5時間** |
| フェーズ2 | 登録フロー統合 | 約6.5時間 |
| フェーズ3 | 本番化対応 | 約5.5時間 |

### 6.2 フェーズ1の詳細

| タスク | 工数 | 説明 |
|--------|------|------|
| LINE Developersチャネル作成・設定 | 0.5h | マニュアル作業 |
| Better Auth設定（LINE追加） | 0.5h | lib/auth.tsに数行追加 |
| 環境変数設定 | 0.25h | .env/.env.exampleに設定 |
| ログインフォームにLINEボタン追加 | 1.5h | UIコンポーネント修正 |
| 動作確認・デバッグ | 1.5h | ローカル環境でのテスト |
| **合計** | **4.25h** | **約1人日** |

### 6.3 推奨スケジュール

```
Week 1: フェーズ1完了 → LINE認証を本番リリース
Week 2: 必要に応じてフェーズ2実装
Week 3: 必要に応じてフェーズ3実装
```

---

## 7. セキュリティ考慮事項

### 7.1 Better Authによる自動対策

| 対策 | 説明 |
|------|------|
| CSRF攻撃対策 | stateパラメータによる検証 |
| トークン暗号化保存 | DBへの安全な保存 |
| セッション有効期限管理 | 自動期限切れ処理 |

### 7.2 追加で対応が必要な項目

| 項目 | 対応内容 |
|------|----------|
| Channel Secretの管理 | 環境変数で厳密に管理、コミット禁止 |
| 本番環境の設定確認 | .env.localが本番に含まれないことを確認 |
| エラーハンドリング | LINE側エラーの適切な表示 |

### 7.3 リスクと対策

| リスク | 可能性 | 対策 |
|--------|--------|------|
| Channel ID/Secretの誤り | 低 | LINE Developers Consoleで二重確認 |
| Callback URLのミスマッチ | 中 | 各環境ごとにテスト必須 |
| トークン有効期限の問題 | 低 | Better Authが自動処理 |
| メールアドレス取得の承認待ち | 中 | 事前にLINE側に申請 |

---

## 8. 実装チェックリスト

### 8.1 事前準備

- [ ] LINE Developers アカウント作成
- [ ] LINE Login チャネル作成
- [ ] Channel ID / Secret 取得
- [ ] Callback URL 登録（開発環境）
- [ ] Callback URL 登録（本番環境）
- [ ] emailスコープの申請（必要な場合）

### 8.2 バックエンド実装

- [ ] 環境変数設定（.env.local）
- [ ] 環境変数サンプル更新（.env.example）
- [ ] Better Auth設定更新（lib/auth.ts）

### 8.3 フロントエンド実装

- [ ] LINEアイコンコンポーネント作成
- [ ] ログインフォームにLINEボタン追加
- [ ] サインアップフォームにLINEボタン追加（オプション）
- [ ] エラーハンドリング実装

### 8.4 テスト・デプロイ

- [ ] ローカル環境での動作確認
- [ ] ステージング環境での動作確認
- [ ] 本番環境での動作確認
- [ ] エラーケースのテスト
- [ ] Code Review実施

### 8.5 ドキュメント

- [ ] 設定手順書の更新
- [ ] 環境変数一覧の更新
- [ ] README更新（必要な場合）

---

## 9. 参考資料

### 9.1 公式ドキュメント

| ドキュメント | URL |
|-------------|-----|
| Better Auth - LINE Integration | https://www.better-auth.com/docs/authentication/line |
| Better Auth - Generic OAuth | https://www.better-auth.com/docs/plugins/generic-oauth |
| LINE Developers - LINE Login統合ガイド | https://developers.line.biz/en/docs/line-login/integrate-line-login/ |
| LINE Developers - LINE Login v2.1 API Reference | https://developers.line.biz/en/reference/line-login/ |

### 9.2 関連リンク

| リンク | URL |
|--------|-----|
| Better Auth公式サイト | https://www.better-auth.com/ |
| LINE Developers Console | https://developers.line.biz/console/ |

---

## 更新履歴

| 日付 | バージョン | 内容 | 作成者 |
|------|-----------|------|--------|
| 2026-01-10 | 1.0 | 初版作成（調査結果をまとめ） | - |

---

## 関連ドキュメント

- [要件定義書](./01_requirements-definition.md)
- [基本設計書](./02_basic-design.md)
- [アカウント設計](./account-design.md)
- [アクセス制御設計](./access-control-design.md)
