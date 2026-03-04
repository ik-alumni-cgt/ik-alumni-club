# IK ALUMNI CGT サポーターズクラブ - URL設計ドキュメント

## 🏗️ URL構造の概要

プロジェクトは**Next.js App Router**を使用し、3つの主要なルートグループで構成されています。

---

## 📍 ルートグループ構成

### 1. パブリックルート（ルートグループなし）

認証不要でアクセス可能なページ群

| URL | 説明 | ファイルパス |
|-----|------|------------|
| `/` | ランディングページ（ホーム） | `app/page.tsx` |
| `/informations` | お知らせ一覧 | `app/informations/page.tsx` |
| `/informations/[id]` | お知らせ詳細 | `app/informations/[id]/page.tsx` |
| `/events` | スケジュール一覧 | `app/events/page.tsx` |
| `/events/[id]` | スケジュール詳細 | `app/events/[id]/page.tsx` |
| `/videos` | 動画一覧 | `app/videos/page.tsx` |
| `/videos/[id]` | 動画詳細 | `app/videos/[id]/page.tsx` |
| `/blog` | ブログ一覧（会員限定） | `app/blog/page.tsx` |
| `/blog/[id]` | ブログ詳細（会員限定） | `app/blog/[id]/page.tsx` |
| `/newsletters` | ニュースレター一覧（会員限定） | `app/newsletters/page.tsx` |
| `/newsletters/[id]` | ニュースレター詳細（会員限定） | `app/newsletters/[id]/page.tsx` |
| `/contact` | お問い合わせ | `app/contact/page.tsx` |
| `/profile` | プロフィール（会員専用） | `app/profile/page.tsx` |

---

### 2. 認証ルート `(auth)`

ログイン・会員登録関連のページ

| URL | 説明 | ファイルパス |
|-----|------|------------|
| `/login` | ログイン | `app/(auth)/login/page.tsx` |
| `/signup` | サービス説明・会員登録情報 | `app/(auth)/signup/page.tsx` |

---

### 3. 会員登録フロー `register`

専用レイアウト（`RegistrationProvider`使用）

| URL | 説明 | ファイルパス |
|-----|------|------------|
| `/register` | 新規登録トップ | `app/register/page.tsx` |
| `/register/auth` | アカウント作成 | `app/register/auth/page.tsx` |
| `/register/plan` | プラン選択 | `app/register/plan/page.tsx` |
| `/register/profile` | プロフィール入力 | `app/register/profile/page.tsx` |
| `/register/confirm` | 確認画面 | `app/register/confirm/page.tsx` |
| `/register/complete` | 完了画面 | `app/register/complete/page.tsx` |

**特徴**: `RegistrationContext`で会員登録フロー全体の状態を管理

---

### 4. ダッシュボード `(dashboard)`

認証必須（未ログインは`/login`へリダイレクト）

#### 一般会員エリア

| URL | 説明 | ファイルパス |
|-----|------|------------|
| `/dashboard` | ダッシュボードTOP | `app/(dashboard)/dashboard/page.tsx` |
| `/contents` | コンテンツ一覧 | `app/(dashboard)/contents/page.tsx` |
| `/contents/[id]` | コンテンツ詳細 | `app/(dashboard)/contents/[id]/page.tsx` |

#### 管理者専用エリア（`/admin`）

##### お知らせ管理
| URL | 説明 | ファイルパス |
|-----|------|------------|
| `/admin/informations` | お知らせ管理一覧 | `app/(dashboard)/admin/informations/page.tsx` |
| `/admin/informations/new` | お知らせ新規作成 | `app/(dashboard)/admin/informations/new/page.tsx` |
| `/admin/informations/[id]/edit` | お知らせ編集 | `app/(dashboard)/admin/informations/[id]/edit/page.tsx` |

##### スケジュール管理
| URL | 説明 | ファイルパス |
|-----|------|------------|
| `/admin/schedules` | スケジュール管理一覧 | `app/(dashboard)/admin/schedules/page.tsx` |
| `/admin/schedules/new` | スケジュール新規作成 | `app/(dashboard)/admin/schedules/new/page.tsx` |
| `/admin/schedules/[id]/edit` | スケジュール編集 | `app/(dashboard)/admin/schedules/[id]/edit/page.tsx` |

##### 動画管理
| URL | 説明 | ファイルパス |
|-----|------|------------|
| `/admin/videos` | 動画管理一覧 | `app/(dashboard)/admin/videos/page.tsx` |
| `/admin/videos/new` | 動画新規作成 | `app/(dashboard)/admin/videos/new/page.tsx` |
| `/admin/videos/[id]/edit` | 動画編集 | `app/(dashboard)/admin/videos/[id]/edit/page.tsx` |

##### ブログ管理
| URL | 説明 | ファイルパス |
|-----|------|------------|
| `/admin/blogs` | ブログ管理一覧 | `app/(dashboard)/admin/blogs/page.tsx` |
| `/admin/blogs/new` | ブログ新規作成 | `app/(dashboard)/admin/blogs/new/page.tsx` |
| `/admin/blogs/[id]/edit` | ブログ編集 | `app/(dashboard)/admin/blogs/[id]/edit/page.tsx` |

##### ニュースレター管理
| URL | 説明 | ファイルパス |
|-----|------|------------|
| `/admin/newsletters` | ニュースレター管理一覧 | `app/(dashboard)/admin/newsletters/page.tsx` |
| `/admin/newsletters/new` | ニュースレター新規作成 | `app/(dashboard)/admin/newsletters/new/page.tsx` |
| `/admin/newsletters/[id]/edit` | ニュースレター編集 | `app/(dashboard)/admin/newsletters/[id]/edit/page.tsx` |

##### その他管理
| URL | 説明 | ファイルパス |
|-----|------|------------|
| `/admin/users` | ユーザー管理 | `app/(dashboard)/admin/users/page.tsx` |
| `/admin/contents` | コンテンツ管理 | `app/(dashboard)/admin/contents/page.tsx` |

**管理者判定**: `member.role === 'admin'` または `admin@example.com`

---

## 🎯 URL設計の特徴

### 1. リソースベースの命名

- 複数形を使用: `/informations`, `/events`, `/videos`, `/blogs`, `/newsletters`
- 詳細ページは`[id]`による動的ルート
- RESTful APIの原則に準拠

### 2. 会員区分による階層的アクセス制御

- **PLATINUM**: すべてのコンテンツ閲覧可能
- **BUSINESS**: Business + Individual コンテンツ
- **INDIVIDUAL**: Individual コンテンツのみ

### 3. レイアウト戦略

| レイアウト | 適用範囲 | 特徴 |
|----------|---------|------|
| `app/layout.tsx` | 全ページ | フォント設定（Academy, Senobi Gothic） |
| `app/(dashboard)/layout.tsx` | ダッシュボード系 | サイドバー、認証チェック |
| `app/register/layout.tsx` | 会員登録フロー | `RegistrationProvider` |

### 4. ヘッダーナビゲーション（パブリック）

```
HOME → INFORMATION → SCHEDULE → VIDEO → BLOG → NEWSLETTERS → CONTACT → MY PAGE（ログイン時）
```

### 5. 管理画面サイドバーナビゲーション

```
📊 Dashboard
📚 Contents
👤 Profile
---（管理者のみ）---
📢 お知らせ管理
📅 スケジュール管理
🎬 動画管理
📝 ブログ管理
📰 ニュースレター管理
👥 ユーザー管理
```

---

## 🔐 認証フロー

```
未ログイン
  └→ /signup（サービス説明）
      └→ /register（新規登録開始）
          └→ /register/auth（アカウント作成）
              └→ /register/plan（プラン選択）
                  └→ /register/profile（プロフィール入力）
                      └→ /register/confirm（確認）
                          └→ /register/complete（完了）

ログイン済み
  └→ /dashboard または /profile にアクセス可能
  └→ 未ログインで認証必須ページにアクセス → /login へリダイレクト
```

---

## 📋 URL命名規則のまとめ

| パターン | 例 | 用途 |
|---------|---|------|
| リソース一覧 | `/videos` | 全件表示・フィルタリング |
| リソース詳細 | `/videos/[id]` | 個別コンテンツ |
| 管理画面一覧 | `/admin/videos` | CRUD一覧 |
| 管理画面新規作成 | `/admin/videos/new` | 作成フォーム |
| 管理画面編集 | `/admin/videos/[id]/edit` | 編集フォーム |
| 会員登録ステップ | `/register/{step}` | 多段階フォーム |

---

## 🔄 リダイレクト設計

### 認証チェック

- `(dashboard)` 配下の全ページ: 未ログイン時 → `/login`
- ログイン成功後: デフォルトで `/dashboard` へリダイレクト

### 権限チェック

- 管理者専用ページ（`/admin/*`）: 非管理者はアクセス不可（サイドバーにも非表示）
- 会員限定コンテンツ: 未ログイン時は閲覧制限メッセージ表示

---

## 📝 備考

- Next.js 15.4.6 / React 19.1.0 使用
- App Router（`src/app`ディレクトリベース）
- Firebase Authentication + Firestore によるユーザー管理
- 日本語コンテンツが主体だが、UIテキストは英語（文字エンコーディング対策）

---

**最終更新**: 2025-10-06
