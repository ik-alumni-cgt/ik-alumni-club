# Googleログイン実装設計書

**作成日**: 2026-01-10
**バージョン**: 1.0
**ステータス**: 調査完了・実装待ち

---

## 目次

1. [概要](#1-概要)
2. [現在の認証システムとの互換性](#2-現在の認証システムとの互換性)
3. [Google OAuth 2.0の要件](#3-google-oauth-20の要件)
4. [実装に必要な変更点](#4-実装に必要な変更点)
5. [実装手順](#5-実装手順)
6. [本番環境での審査要件](#6-本番環境での審査要件)
7. [LINEログインとの比較](#7-lineログインとの比較)
8. [工数見積もり](#8-工数見積もり)
9. [セキュリティ考慮事項](#9-セキュリティ考慮事項)
10. [実装チェックリスト](#10-実装チェックリスト)
11. [参考資料](#11-参考資料)

---

## 1. 概要

### 1.1 目的

IK ALUMNI CGT サポーターズクラブ会員サイトにGoogleログイン機能を追加し、ユーザーの利便性を向上させる。

### 1.2 調査結果サマリー

| 評価項目 | 結果 |
|----------|------|
| 技術的実現性 | **可能** ✅ |
| 難易度 | **低** |
| DBスキーマ変更 | **不要** |
| 最小工数 | **約9時間（1〜1.5人日）** |
| 本番審査 | **2〜3営業日**（Google側の審査） |

### 1.3 Better AuthのGoogle対応状況

**Better Auth v1.3.23はGoogleログインに完全対応しています。**

- OAuth 2.0 / OpenID Connect標準準拠
- accountsテーブルでソーシャル連携情報を管理
- リフレッシュトークンの自動管理

---

## 2. 現在の認証システムとの互換性

### 2.1 使用技術

| 項目 | 現在の実装 | Google対応 |
|------|-----------|------------|
| 認証フレームワーク | Better Auth v1.3.23 | ✅ 完全対応 |
| ORM | Drizzle ORM | ✅ 対応済み |
| データベース | PostgreSQL | ✅ 変更不要 |
| 認証方式 | Email + Password | ✅ 並行動作可能 |

### 2.2 accountsテーブルの構造

Googleログイン情報は既存の`accounts`テーブルに保存されます。

| カラム | Googleログイン時の値 |
|--------|---------------------|
| providerId | `"google"` |
| accountId | Google User ID |
| accessToken | Googleアクセストークン |
| refreshToken | Googleリフレッシュトークン |
| idToken | Google IDトークン |
| accessTokenExpiresAt | トークン有効期限 |
| scope | `"openid profile email"` |

**スキーマ変更は不要です。**

---

## 3. Google OAuth 2.0の要件

### 3.1 Google Cloud Consoleでの設定

#### 必須条件

1. **Google Cloud Consoleアカウント**
   - https://console.cloud.google.com

2. **プロジェクト作成**
   - 新規プロジェクトを作成
   - プロジェクト名を設定

3. **OAuth 2.0認証情報の作成**
   - APIs & Services → Credentials
   - "Create Credentials" → "OAuth client ID"
   - アプリケーションタイプ: **Web application**

#### 取得する認証情報

| 項目 | 説明 |
|------|------|
| Client ID | `xxxxxxxxxxxx.apps.googleusercontent.com` |
| Client Secret | `GOCSPX-xxxxxxxxxxxxxxxxxxx` |

### 3.2 許可するオリジンとリダイレクトURI

#### 許可する JavaScript オリジン

| 環境 | オリジン |
|------|----------|
| ローカル開発 | `http://localhost:3000` |
| 本番 | `https://yourdomain.com` |

#### 認可済みリダイレクトURI

| 環境 | リダイレクトURI |
|------|-----------------|
| ローカル開発 | `http://localhost:3000/api/auth/callback/google` |
| 本番 | `https://yourdomain.com/api/auth/callback/google` |

### 3.3 スコープ設定

Better Authがデフォルトで要求するスコープ：

| スコープ | 説明 | 必須 |
|---------|------|------|
| `openid` | OpenID Connect識別子 | はい |
| `profile` | ユーザープロフィール（名前、画像） | はい |
| `email` | メールアドレス | はい |

**注意**: これらは非機密スコープのため、追加の審査は不要です。

### 3.4 認証フロー

```
1. ユーザーがGoogleログインボタンをクリック
   ↓
2. Google認可エンドポイントにリダイレクト
   https://accounts.google.com/o/oauth2/v2/auth
   ↓
3. ユーザーがGoogleアカウントを選択・認可
   ↓
4. コールバックURLにリダイレクト
   /api/auth/callback/google?code=xxx&state=xxx
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
| アクセストークン | 1時間 |
| リフレッシュトークン | 無期限（revoke されない限り） |
| IDトークン | 1時間 |

**注意**: リフレッシュトークンを取得するには`accessType: "offline"`の設定が必要です。

---

## 4. 実装に必要な変更点

### 4.1 環境変数の追加

`.env`および`.env.example`に以下を追加します。

```env
# Google OAuth設定
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxx
```

### 4.2 Better Auth設定の変更

**ファイル**: `lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // ... 既存設定

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // オプション設定
      accessType: "offline",              // リフレッシュトークン取得
      prompt: "select_account consent",   // 毎回アカウント選択画面表示
    },
  },

  // ... 他の設定
});
```

#### オプション詳細

| オプション | 説明 | 推奨値 |
|-----------|------|--------|
| `clientId` | Google Consoleから取得 | 環境変数で設定 |
| `clientSecret` | Google Consoleから取得 | 環境変数で設定 |
| `accessType` | "online" or "offline" | `"offline"` |
| `prompt` | 認可画面の表示方法 | `"select_account consent"` |

### 4.3 フロントエンド（ログインフォーム）の変更

**ファイル**: `components/login-form/login-form.tsx`

```typescript
import { authClient } from "@/lib/auth-client";

// Googleログイン処理
const handleGoogleLogin = async () => {
  try {
    setIsLoading(true);
    await authClient.signIn.social({ provider: "google" });
  } catch (error) {
    console.error("Google ログインエラー:", error);
    setError("Googleでのログインに失敗しました");
  } finally {
    setIsLoading(false);
  }
};

// JSXにGoogleログインボタンを追加
<Button
  type="button"
  variant="outline"
  className="w-full"
  onClick={handleGoogleLogin}
  disabled={isLoading}
>
  <GoogleIcon className="mr-2 h-4 w-4" />
  Googleでログイン
</Button>
```

### 4.4 サインアップフローの変更（オプション）

**ファイル**: `components/register/register-auth-form.tsx`

```typescript
// Googleで登録ボタン
const handleGoogleSignUp = async () => {
  try {
    setIsLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/register/payment" // 登録フローに戻す
    });
  } catch (error) {
    console.error("Google 登録エラー:", error);
  } finally {
    setIsLoading(false);
  }
};
```

### 4.5 データベーススキーマの変更

**変更不要です。**

既存の`accounts`テーブルがOAuth連携に対応しており、Googleの情報を保存できます。

---

## 5. 実装手順

### フェーズ1: 開発環境での実装

#### Step 1: Google Cloud Consoleでプロジェクト作成

1. [Google Cloud Console](https://console.cloud.google.com) にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト名を設定（例: `ik-alumni-club`）

#### Step 2: OAuth 2.0認証情報の作成

1. APIs & Services → Credentials
2. "Create Credentials" → "OAuth client ID"
3. アプリケーションタイプ: "Web application"
4. 名前を設定（例: `IK Alumni Club Web`）
5. 許可するJavaScriptオリジンを追加:
   - `http://localhost:3000`
6. 認可済みリダイレクトURIを追加:
   - `http://localhost:3000/api/auth/callback/google`
7. Client IDとClient Secretを取得

#### Step 3: OAuth同意画面の設定

1. APIs & Services → OAuth consent screen
2. ユーザータイプ: "External" を選択
3. 必須情報を入力:
   - アプリケーション名
   - ユーザーサポートメール
   - デベロッパー連絡先メール
4. スコープを追加:
   - `openid`
   - `email`
   - `profile`

#### Step 4: 環境変数設定

```bash
# .env.local
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxx
```

#### Step 5: Better Auth設定更新

`lib/auth.ts`に`socialProviders.google`を追加

#### Step 6: ログインフォーム更新

`components/login-form/login-form.tsx`にGoogleログインボタンを追加

#### Step 7: 動作確認

- ローカル環境でGoogleログインをテスト
- セッション作成・ユーザー情報取得を確認

### フェーズ2: 本番審査・デプロイ

- OAuth同意画面の本番公開申請
- 本番環境のリダイレクトURI追加
- 本番環境での動作確認

---

## 6. 本番環境での審査要件

### 6.1 ユーザータイプ

| タイプ | 説明 | 審査 |
|--------|------|------|
| Internal | Google Workspace組織内のみ | 不要 |
| External | 一般ユーザー向け | **必要** |

### 6.2 審査が必要なケース

- External（一般ユーザー）向けに公開する場合
- ロゴやアプリ名を表示する場合

### 6.3 審査手順

#### 1. ブランド検証（2〜3営業日）

確認される項目：
- アプリケーション名とロゴが正確か
- ホームページが公開アクセス可能か
- ドメイン所有権（Google Search Consoleで確認）

#### 2. 提出要件

| 項目 | 必須 | 説明 |
|------|------|------|
| プライバシーポリシー | ✅ | 公開URLが必要 |
| 利用規約 | 推奨 | 公開URLが必要 |
| ホームページURL | ✅ | 公開アクセス可能 |
| デモ動画 | 場合による | OAuthフローを示す |

### 6.4 開発中の制限

審査完了前でも以下の条件で利用可能：

- テストユーザーとして登録されたGoogleアカウントのみ
- 最大100人のテストユーザー
- OAuth同意画面に警告が表示される

---

## 7. LINEログインとの比較

### 7.1 共通点

| 項目 | 説明 |
|------|------|
| プロトコル | OAuth 2.0 / OpenID Connect |
| 実装方法 | Better Auth socialProviders |
| DBスキーマ | accountsテーブル共用 |
| クライアントAPI | `authClient.signIn.social({provider})` |
| トークン管理 | accessToken, refreshToken 自動保存 |

### 7.2 主な違い

| 項目 | Google | LINE |
|------|--------|------|
| 設定場所 | Google Cloud Console | LINE Developers Console |
| チャネル概念 | なし | あり（国・サービス毎） |
| 多国対応 | 1設定で全世界対応 | 国毎に別チャネル必要 |
| メール取得 | デフォルトで取得可能 | 別途permission申請必要 |
| リフレッシュトークン | あり（無期限） | なし |
| 本番審査 | 必要（2〜3営業日） | 簡単 |
| 設定の複雑さ | 簡単 | やや複雑 |

### 7.3 同時実装の推奨

両方を実装する場合、`lib/auth.ts`は以下のようになります：

```typescript
socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    accessType: "offline",
    prompt: "select_account consent",
  },
  line: {
    clientId: process.env.LINE_CLIENT_ID as string,
    clientSecret: process.env.LINE_CLIENT_SECRET as string,
  },
},
```

---

## 8. 工数見積もり

### 8.1 フェーズ別工数

| フェーズ | 内容 | 工数 |
|---------|------|------|
| **フェーズ1** | 開発環境での実装 | **約6時間** |
| **フェーズ2** | 本番審査・デプロイ | **約3時間 + 審査待ち2〜3営業日** |

### 8.2 詳細タスク

| タスク | 工数 | 説明 |
|--------|------|------|
| Google Cloud Console設定 | 1h | プロジェクト作成、OAuth設定 |
| OAuth同意画面設定 | 0.5h | スコープ、ブランド情報設定 |
| Better Auth設定更新 | 0.5h | lib/auth.tsに設定追加 |
| 環境変数設定 | 0.25h | .env/.env.example更新 |
| ログインフォーム修正 | 1h | Googleボタン追加、UI調整 |
| サインアップフォーム修正 | 1h | Googleボタン追加（オプション） |
| テスト・デバッグ | 2h | 開発環境での動作確認 |
| 本番審査申請 | 1h | 申請資料作成 |
| 本番環境設定 | 1h | リダイレクトURI追加、動作確認 |
| ドキュメント更新 | 1h | 実装ガイド作成 |

**合計**: 約9時間（1〜1.5人日）+ 審査待ち2〜3営業日

### 8.3 リスク要因

| リスク | 確率 | 影響 | 対策 |
|--------|------|------|------|
| 本番審査落選 | 低 | 高 | プライバシーポリシー・ToSの整備 |
| redirect_uri_mismatchエラー | 低 | 中 | URI設定の二重確認 |
| トークン取得失敗 | 低 | 中 | accessType:"offline"指定 |

---

## 9. セキュリティ考慮事項

### 9.1 Better Authによる自動対策

| 対策 | 説明 |
|------|------|
| CSRF攻撃対策 | stateパラメータによる検証 |
| PKCE対応 | Authorization Code Flow with PKCE |
| トークン暗号化保存 | DBへの安全な保存 |
| セッション有効期限管理 | 自動期限切れ処理 |

### 9.2 追加で対応が必要な項目

| 項目 | 対応内容 |
|------|----------|
| Client Secretの管理 | 環境変数で厳密に管理、コミット禁止 |
| 本番環境の設定確認 | .env.localが本番に含まれないことを確認 |
| HTTPS必須 | 本番環境ではHTTPS必須 |

### 9.3 Googleのセキュリティ機能

- OAuth 2.0 / OpenID Connect標準準拠
- トークンの自動期限切れ
- ユーザーによるアクセス権取り消し機能
- 不正アクセス検知

---

## 10. 実装チェックリスト

### 10.1 事前準備

- [ ] Google Cloud Consoleアカウント作成
- [ ] プロジェクト作成
- [ ] OAuth 2.0認証情報作成
- [ ] Client ID / Secret 取得
- [ ] OAuth同意画面設定
- [ ] 開発環境のリダイレクトURI登録
- [ ] 本番環境のリダイレクトURI登録

### 10.2 バックエンド実装

- [ ] 環境変数設定（.env.local）
- [ ] 環境変数サンプル更新（.env.example）
- [ ] Better Auth設定更新（lib/auth.ts）

### 10.3 フロントエンド実装

- [ ] Googleアイコンコンポーネント作成
- [ ] ログインフォームにGoogleボタン追加
- [ ] サインアップフォームにGoogleボタン追加（オプション）
- [ ] エラーハンドリング実装

### 10.4 テスト・デプロイ

- [ ] テストユーザーの登録（審査前の場合）
- [ ] ローカル環境での動作確認
- [ ] 本番審査申請
- [ ] 審査完了確認
- [ ] 本番環境での動作確認
- [ ] エラーケースのテスト
- [ ] Code Review実施

### 10.5 ドキュメント

- [ ] 設定手順書の更新
- [ ] 環境変数一覧の更新
- [ ] プライバシーポリシーの更新（必要に応じて）

---

## 11. 参考資料

### 11.1 公式ドキュメント

| ドキュメント | URL |
|-------------|-----|
| Better Auth - Google | https://www.better-auth.com/docs/authentication/google |
| Better Auth - OAuth概念 | https://www.better-auth.com/docs/concepts/oauth |
| Google OAuth 2.0 for Web | https://developers.google.com/identity/protocols/oauth2/web-server |
| OAuth同意画面の設定 | https://developers.google.com/workspace/guides/configure-oauth-consent |
| アプリ検証要件 | https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance |

### 11.2 関連リンク

| リンク | URL |
|--------|-----|
| Google Cloud Console | https://console.cloud.google.com |
| Google Search Console | https://search.google.com/search-console |
| Better Auth公式サイト | https://www.better-auth.com/ |

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
- [LINEログイン実装設計書](./line-login-design.md)
- [アクセス制御設計](./access-control-design.md)
