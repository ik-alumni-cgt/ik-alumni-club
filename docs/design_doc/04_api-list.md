# API一覧

## 概要

本ドキュメントでは、システムで使用する全APIエンドポイントおよびサーバーアクションを一覧化する。
バックエンドは Next.js 15 App Router のサーバーアクション（Server Actions）と API Routes を使用し、認証は Better Auth で行う。

## 技術スタック

- フレームワーク: Next.js 15 (App Router)
- 認証: Better Auth (メール/パスワード + Google OAuth + LINE OAuth)
- 決済: Stripe (サブスクリプション + 銀行振込)
- ORM: Drizzle ORM + PostgreSQL
- ストレージ: Cloudflare R2

## 認証方式

| 認証種別 | 関数 | 説明 |
|---------|------|------|
| session | `verifySession()` | ログインユーザー必須。未ログインは `/login` にリダイレクト |
| admin | `verifyAdmin()` | 管理者ロール必須（`role = "admin"`） |
| officer | `verifyOfficer()` | 役員ロール必須（`role = "admin"` または `"officer"`） |
| activeMember | `verifyActiveMember()` | アクティブ会員必須（`status = "active"`） |
| なし | - | 認証不要（公開エンドポイント / 内部処理） |

## API Routes（`app/api/`）

| No. | メソッド | エンドポイント | 機能 | 認証 | 備考 |
|-----|---------|---------------|------|------|------|
| 1 | GET/POST | `/api/auth/[...all]` | Better Auth 認証ハンドラ | なし | メール/パスワード、Google、LINE認証 |
| 2 | POST | `/api/stripe/create-checkout` | Stripeチェックアウトセッション作成 | session | subscription/paymentモード対応 |
| 3 | POST | `/api/stripe/webhook` | Stripe Webhook受信 | Stripe署名検証 | checkout完了/解約/支払い失敗イベント処理 |
| 4 | GET | `/api/download-image` | 画像ダウンロード | なし | url, filenameクエリパラメータ |
| 5 | POST | `/api/preview-auth` | プレビュー環境認証 | なし | passcodeによる簡易認証、Cookie設定 |

## サーバーアクション一覧

### 会員管理

| No. | カテゴリ | 関数名 | 機能 | 認証 | ファイル | 備考 |
|-----|---------|--------|------|------|---------|------|
| 6 | 会員 | `getCurrentMember` | ログインユーザーの会員情報取得 | session | `actions/members/get-member.ts` | 未作成時は自動作成 |
| 7 | 会員 | `updateMemberProfile` | プロフィール更新 | session | `actions/members/update-profile.ts` | status→active、profileCompleted→true |
| 8 | 会員 | `createMemberAfterSignup` | 会員レコード作成 | なし | `actions/members/create-member.ts` | サインアップ後の内部処理 |
| 9 | 会員 | `updateMemberPlan` | 会員プラン更新 | なし | `actions/members/create-member.ts` | 内部処理 |
| 10 | 会員 | `updateUserEmail` | メールアドレス更新 | なし | `actions/members/update-user-email.ts` | LINE認証後のダミーメール→本メール更新 |
| 11 | 会員 | `checkMigratedUser` | 移行ユーザー確認 | なし | `actions/members/check-migrated-user.ts` | ログイン前に使用 |
| 12 | 会員 | `setMigratedUserPassword` | 移行ユーザーパスワード設定 | なし | `actions/members/set-migrated-user-password.ts` | 移行フロー用 |
| 13 | 会員 | `linkLineAccountToMigratedUser` | LINEアカウントリンク | なし | `actions/members/link-line-account.ts` | LINE一時ユーザーを既存ユーザーに統合 |

### 会員プラン

| No. | カテゴリ | 関数名 | 機能 | 認証 | ファイル | 備考 |
|-----|---------|--------|------|------|---------|------|
| 14 | プラン | `getMemberPlans` | アクティブプラン一覧取得 | なし | `actions/member-plans/get-member-plans.ts` | isActive=trueのみ |
| 15 | プラン | `getMemberPlanById` | プラン詳細取得 | なし | `actions/member-plans/get-member-plans.ts` | |

### 管理者アクション（admin）

| No. | カテゴリ | 関数名 | 機能 | 認証 | ファイル | 備考 |
|-----|---------|--------|------|------|---------|------|
| 16 | 管理 | `deleteAccount` | 会員削除 | admin | `actions/admin/accounts/delete-account.ts` | users CASCADE DELETEで会員も削除 |
| 17 | 管理 | `updateAccount` | 会員情報更新 | admin | `actions/admin/accounts/update-account.ts` | 個人情報・ロール・ステータス等 |
| 18 | 管理 | `resetPayment` | 支払い情報リセット | admin | `actions/admin/accounts/reset-payment.ts` | 返金後の再手続き用 |
| 19 | 管理 | `sendTestEmailAction` | テストメール送信 | admin | `actions/admin/send-test-email.ts` | メール設定確認用 |

### 役員アクション（officer）

| No. | カテゴリ | 関数名 | 機能 | 認証 | ファイル | 備考 |
|-----|---------|--------|------|------|---------|------|
| 20 | 役員 | `toggleWelcomeGift` | 初回特典郵送フラグ切り替え | officer | `actions/officer/toggle-welcome-gift.ts` | welcomeGiftSentフィールド |

### ブログ

| No. | カテゴリ | 関数名 | 機能 | 認証 | ファイル | 備考 |
|-----|---------|--------|------|------|---------|------|
| 21 | ブログ | `createBlog` | ブログ作成 | admin | `actions/blog.ts` | 画像→R2アップロード |
| 22 | ブログ | `updateBlog` | ブログ更新 | admin | `actions/blog.ts` | |
| 23 | ブログ | `deleteBlog` | ブログ削除 | admin | `actions/blog.ts` | |
| 24 | ブログ | `incrementViewCount` | 閲覧数カウント | なし | `actions/blog.ts` | |
| 25 | ブログ | `toggleBlogPublish` | 公開/非公開切り替え | admin | `actions/blog.ts` | |
| 26 | ブログ | `generateBlogImagePresignedUrl` | 本文内画像アップロードURL生成 | admin | `actions/blog-image.ts` | Presigned PUT URL |

### ニュースレター

| No. | カテゴリ | 関数名 | 機能 | 認証 | ファイル | 備考 |
|-----|---------|--------|------|------|---------|------|
| 27 | ニュースレター | `createNewsletter` | ニュースレター作成 | admin | `actions/newsletter.ts` | 画像・PDF→R2アップロード |
| 28 | ニュースレター | `updateNewsletter` | ニュースレター更新 | admin | `actions/newsletter.ts` | 公開時publishedAt自動設定 |
| 29 | ニュースレター | `deleteNewsletter` | ニュースレター削除 | admin | `actions/newsletter.ts` | |
| 30 | ニュースレター | `incrementNewsletterViewCount` | 閲覧数カウント | なし | `actions/newsletter.ts` | |
| 31 | ニュースレター | `toggleNewsletterPublish` | 公開/非公開切り替え | admin | `actions/newsletter.ts` | 公開時publishedAt自動設定 |

### お知らせ

| No. | カテゴリ | 関数名 | 機能 | 認証 | ファイル | 備考 |
|-----|---------|--------|------|------|---------|------|
| 32 | お知らせ | `createInformation` | お知らせ作成 | admin | `actions/information.ts` | 画像→R2アップロード |
| 33 | お知らせ | `updateInformation` | お知らせ更新 | admin | `actions/information.ts` | |
| 34 | お知らせ | `deleteInformation` | お知らせ削除 | admin | `actions/information.ts` | |
| 35 | お知らせ | `togglePublishInformation` | 公開/非公開切り替え | admin | `actions/information.ts` | |

### スケジュール

| No. | カテゴリ | 関数名 | 機能 | 認証 | ファイル | 備考 |
|-----|---------|--------|------|------|---------|------|
| 36 | スケジュール | `createSchedule` | スケジュール作成 | admin | `actions/schedule.ts` | 画像→R2アップロード |
| 37 | スケジュール | `updateSchedule` | スケジュール更新 | admin | `actions/schedule.ts` | |
| 38 | スケジュール | `deleteSchedule` | スケジュール削除 | admin | `actions/schedule.ts` | |
| 39 | スケジュール | `togglePublishSchedule` | 公開/非公開切り替え | admin | `actions/schedule.ts` | |
| 40 | スケジュール | `updateScheduleSortOrder` | 表示順序更新 | admin | `actions/schedule.ts` | |

### 動画

| No. | カテゴリ | 関数名 | 機能 | 認証 | ファイル | 備考 |
|-----|---------|--------|------|------|---------|------|
| 41 | 動画 | `createVideo` | 動画作成 | admin | `actions/video.ts` | YouTube/Vimeo URL |
| 42 | 動画 | `updateVideo` | 動画更新 | admin | `actions/video.ts` | |
| 43 | 動画 | `deleteVideo` | 動画削除 | admin | `actions/video.ts` | |
| 44 | 動画 | `togglePublishVideo` | 公開/非公開切り替え | admin | `actions/video.ts` | |
| 45 | 動画 | `incrementViewCount` | 閲覧数カウント | なし | `actions/video.ts` | |

### フォトライブラリ

| No. | カテゴリ | 関数名 | 機能 | 認証 | ファイル | 備考 |
|-----|---------|--------|------|------|---------|------|
| 46 | フォト | `generatePresignedUrls` | 画像アップロードURL一括生成 | admin | `actions/photo-library.ts` | 最大100枚、Presigned PUT URL |
| 47 | フォト | `createPhoto` | フォトライブラリ作成 | admin | `actions/photo-library.ts` | 画像テーブルへ並列INSERT |
| 48 | フォト | `updatePhoto` | フォトライブラリ更新 | admin | `actions/photo-library.ts` | 既存画像DELETE→新規INSERT |
| 49 | フォト | `deletePhoto` | フォトライブラリ削除 | admin | `actions/photo-library.ts` | 画像はCASCADE DELETE |
| 50 | フォト | `incrementPhotoViewCount` | 閲覧数カウント | なし | `actions/photo-library.ts` | |
| 51 | フォト | `togglePhotoPublish` | 公開/非公開切り替え | admin | `actions/photo-library.ts` | |

### スポンサー

| No. | カテゴリ | 関数名 | 機能 | 認証 | ファイル | 備考 |
|-----|---------|--------|------|------|---------|------|
| 52 | スポンサー | `createSponsor` | スポンサー作成 | なし | `actions/sponsor.ts` | 公開フォームから登録 |
| 53 | スポンサー | `deleteSponsor` | スポンサー削除 | admin | `actions/sponsor.ts` | |

### ペット

| No. | カテゴリ | 関数名 | 機能 | 認証 | ファイル | 備考 |
|-----|---------|--------|------|------|---------|------|
| 54 | ペット | `createPet` | ペット登録 | session | `actions/pet.ts` | ownerId=ログインユーザー |
| 55 | ペット | `updatePet` | ペット更新 | session | `actions/pet.ts` | 所有者確認あり |
| 56 | ペット | `deletePet` | ペット削除 | session | `actions/pet.ts` | 所有者確認あり |

## 認証フロー

### Better Auth 対応認証方式

| 認証方式 | プロバイダーID | 説明 |
|---------|-------------|------|
| メール/パスワード | `credential` | パスワードリセットメール対応 |
| Google OAuth | `google` | offline access、アカウントリンク対応 |
| LINE OAuth | `line` | genericOAuth使用、bot_prompt対応 |
| アカウントリンク | - | 同一メールアドレスで複数プロバイダーを自動リンク |

### Stripe 決済フロー

| モード | 支払い方法 | 有効期限 | 自動更新 |
|-------|-----------|---------|---------|
| subscription | クレジットカード | Stripeサブスクリプション管理 | あり |
| payment | 銀行振込（customer_balance） | 1年間 | なし |

### Stripe Webhookイベント

| イベント | 処理内容 |
|---------|---------|
| `checkout.session.completed` | paymentStatus→completed、サブスクリプション情報保存 |
| `customer.subscription.deleted` | paymentStatus→canceled |
| `invoice.payment_failed` | paymentStatus→failed |

## 画像アップロード方式

| 方式 | 用途 | 処理 |
|------|------|------|
| サーバーサイド | ブログ・ニュースレター・お知らせ・スケジュール・スポンサー | dataURL → サーバーで R2 アップロード |
| クライアント直接 | ブログ本文内画像・フォトライブラリ | Presigned PUT URL → クライアントから R2 直接アップロード |

## 集計

| 種別 | 件数 |
|------|------|
| API Routes | 5 |
| サーバーアクション（会員管理） | 8 |
| サーバーアクション（管理者） | 4 |
| サーバーアクション（役員） | 1 |
| サーバーアクション（コンテンツ） | 32 |
| サーバーアクション（プラン） | 2 |
| サーバーアクション（ペット） | 3 |
| サーバーアクション（スポンサー） | 1 |
| **合計** | **56** |
