# ディレクトリ構造

本ドキュメントは [プログラミング原則](programming-principles.md)（DRY, YAGNI, KISS, SoC, SRP, Fail Fast）に基づいています。

各ディレクトリの責任詳細は [directory-roles.md](directory-roles.md)、命名・export ルールは [file-conventions.md](file-conventions.md)、実装テンプレは [nextjs-patterns.md](nextjs-patterns.md) を参照。

## 1. プロジェクトの構造方針

### 1.1 移行中の二重構造

ik-alumni-club は DDD モジュール構造への段階移行中。旧構造と新構造が共存する。

- 旧構造（既存ドメインで使用中）
  - レイヤー別に水平分割（actions / data / zod / types / components）
  - フラット配置（`actions/` `data/` `zod/` `types/` `components/` `hooks/` `contexts/`）
  - 既存ドメインはこのまま維持

- 新構造（DDD モジュール、`src/modules/[domain]/`）
  - ドメインごとに垂直分割
  - 1 ドメイン = 1 モジュール = 1 ディレクトリ
  - Phase 2 以降で順次移行
  - 詳細ルールは `nextjs-ddd.md`（Phase 2 完了後に追加）

新規コードを書くときの判断:
- 移行済みドメイン: 新構造（`src/modules/[domain]/`）
- 旧構造のままのドメイン: 旧構造（`actions/` `data/` `zod/` ...）
- 既存ドメインを新規にDDD化するときは、別タスクとして合意してから着手する

### 1.2 ドメイン状態表

| ドメイン | 構造 | 配置 |
|---|---|---|
| Blog（管理画面） | 移行中（Phase 2 パイロット） | `src/modules/blog/` |
| Blog（公開側） | 旧構造 | `actions/blog.ts` `data/blog.ts` `components/blog/` `zod/blog.ts` `types/blog.ts` |
| Member | 旧構造 | `actions/members/` `data/member.ts` `components/[member系]/` `zod/member-profile.ts` `types/member.ts` |
| Subscription | 旧構造 | Better Auth Stripe Plugin 経由、`app/api/stripe/` |
| Newsletter | 旧構造 | `actions/newsletter*` `data/newsletter*` `components/newsletter/` `zod/newsletter*` |
| Information | 旧構造 | `actions/information*` `data/information*` `components/information/` |
| Schedule | 旧構造 | `actions/schedule*` `data/schedule*` `components/schedule/` |
| Video | 旧構造 | `actions/video*` `data/video*` `components/video/` |
| Photo Library | 旧構造 | `actions/photo*` `data/photo*` `components/photo*/` |
| Sponsor | 旧構造 | `actions/sponsor*` `components/sponsor*/` |
| Pet | 旧構造 | `db/schemas/pet.ts` 等 |

ドメインを新構造に移行したらこの表を更新する。

## 2. app/ 配下のルート構造

App Router を採用。`pages/` は不存在（採用しない）。

### 2.1 `[locale]/` ロケールセグメント

すべてのルートは `app/[locale]/` 配下。多言語対応（next-intl）。

### 2.2 Route Group の使い分け

`app/[locale]/` 配下で 4 つの Route Group を使う。Route Group は URL に現れず、レイアウトを切り替えるための区分。

| グループ | 用途 | 含まれる主なルート |
|---|---|---|
| `(main)` | 公開コンテンツ（ヘッダー・フッターありの共通レイアウト） | `blog/` `newsletter/` `information/` `video/` `photo-library/` `schedule/` `profiles/` `supporters/` `subscribe/` `member/` `pets/` `past-events/` `new/` |
| `(auth)` | 認証フロー + マイページ + 法的ページ等 | `login/` `register/` `forgot-password/` `reset-password/` `migrate-login/` `mypage/` `profile/` `legal/` `privacy/` `terms/` `refund/` `contact/` |
| `(marketing)` | マーケティング用レイアウト | （現状 layout のみ。実コンテンツなし） |
| `(standalone)` | スタンドアロンレイアウト（特設ページ・外部公開フォーム等） | `feature/` `sponsor-form/` |

実装上は `(auth)` グループに認証フロー以外（マイページ・法的ページ等）も含まれる。これは共通レイアウトの都合によるもの。新規ページを追加するときは「どのレイアウトを使うか」で配置先を決める。

### 2.3 グループ外

特定の責務を持つルートは Route Group の外に配置。

| ディレクトリ | 用途 |
|---|---|
| `admin/` | 管理画面（admin ロール限定） |
| `admin-login/` | 管理者ログイン専用ページ |
| `officer/` | 役員画面（officer または admin ロール） |
| `goods/` | グッズ関連（購入完了ページ等） |

### 2.4 `app/api/` の API Routes

Server Actions で扱えないものに限る。

| エンドポイント | 用途 |
|---|---|
| `/api/auth/[...all]` | Better Auth 認証ハンドラ |
| `/api/stripe/create-checkout` | Stripe チェックアウトセッション作成 |
| `/api/stripe/webhook` | Stripe Webhook 受信 |
| `/api/download-image` | 画像ダウンロード |
| `/api/preview-auth` | プレビュー環境認証 |

新規 API Route を追加するときは、まず Server Action で実現できないか検討する。

## 3. 旧構造のディレクトリ

旧構造ドメインで使用するディレクトリ群。各ディレクトリの責任詳細は [directory-roles.md](directory-roles.md) を参照。

### 3.1 `actions/` 書き込み処理

Server Actions（POST / PUT / DELETE 相当）を配置。GET 処理は禁止（`data/` に書く）。

粒度は 2 形式が混在しており、両方を許容する（粒度統一は別タスクのバックログ）。

- `actions/[feature].ts`: 1 ファイルに複数 action を集約（例: `actions/blog.ts`）
- `actions/[feature]/[action-name].ts`: 1 ファイル 1 action（例: `actions/members/get-member.ts`）

### 3.2 `data/` 読み取り処理

GET 系のデータ取得関数を配置。先頭に `import "server-only"` を書く。

- `data/[feature].ts`: 1 ファイルに該当ドメインの読み取り関数を集約

### 3.3 `components/[feature]/` 機能別 UI

各機能専用のコンポーネント。`components/ui/`（共有 shadcn）と区別する。

### 3.4 `zod/` バリデーション

Zod スキーマを配置。`createInsertSchema` で Drizzle スキーマから派生させる。

- `zod/[feature].ts`: 1 ファイルに該当ドメインのスキーマを集約
- 入力バリデーション（フォーム）と内部処理用スキーマを混在可

### 3.5 `types/` 型定義

TypeScript 型定義を配置。Drizzle の `$inferSelect` / `$inferInsert` で推論することを基本とする。

- `types/[feature].ts`: 1 ファイルに該当ドメインの型を集約

### 3.6 `hooks/` `contexts/`

クライアントサイドの React Hooks と Context を配置。サーバー側ロジックは入れない。

## 4. 新構造（DDD モジュール）の概略

`src/modules/[domain]/` 配下にドメインごとに集約する。各ドメインは 4 層を内部に持つ。

```
src/modules/[domain]/
├── domain/         Entity, Value Object, ドメインロジック（純粋関数）, Repository インターフェース
├── application/    Use Case（業務処理の入口）
├── infrastructure/ Repository 実装（Drizzle）, 外部サービス連携
├── presentation/   Server Actions, queries, components（ドメイン専用 UI）
├── schemas/        Zod（ドメイン不変条件 / 入力バリデーション）
└── CLAUDE.md       ドメイン用語集・不変条件・ユースケース一覧（必須）
```

詳細ルール（各層の責任、書いてよいこと / いけないこと、Better Auth / Stripe との結合方針）は `nextjs-ddd.md`（Phase 2 完了後に追加）に記載予定。

新規ドメインを DDD で作るとき、または既存ドメインを DDD 化するときは、Phase 2 完了後に追加されるこのルールに従う。

## 5. 共通インフラ（移行に依らず固定）

旧構造・新構造に関わらず、以下のディレクトリは共通インフラとしてルート直下に固定する。

| ディレクトリ | 用途 |
|---|---|
| `db/schemas/` | Drizzle スキーマ定義（DDD モジュールの infrastructure 層からも参照） |
| `db/migrations/` | マイグレーションファイル |
| `components/ui/` | shadcn/ui 共有コンポーネント |
| `components/[layout-name]/` | ヘッダー、フッター、共通レイアウト等の横断的 UI |
| `lib/` | 認証、session、共通ユーティリティ（ドメインに属さないもの） |
| `messages/` | next-intl の翻訳辞書 |
| `middleware.ts` | Next.js ミドルウェア |

## 6. 配置判断早見表

| 何を | ドメインの状態 | 配置先 | 例 |
|---|---|---|---|
| ページ | 共通 | `app/[locale]/(group)/[feature]/page.tsx` | `app/[locale]/(main)/blog/page.tsx` |
| 書き込み処理 | 旧構造 | `actions/[feature].ts` または `actions/[feature]/[action-name].ts` | `actions/blog.ts`, `actions/members/get-member.ts` |
| 書き込み処理 | DDD 移行済 | `src/modules/[domain]/presentation/actions.ts` → application 層を呼ぶ | `src/modules/blog/presentation/actions.ts` |
| 読み取り処理 | 旧構造 | `data/[feature].ts` | `data/blog.ts` |
| 読み取り処理 | DDD 移行済 | `src/modules/[domain]/presentation/queries.ts` → application 層を呼ぶ | `src/modules/blog/presentation/queries.ts` |
| バリデーション | 旧構造 | `zod/[feature].ts` | `zod/blog.ts` |
| バリデーション | DDD 移行済 | `src/modules/[domain]/schemas/` | `src/modules/blog/schemas/input-schemas.ts` |
| 型定義 | 旧構造 | `types/[feature].ts` | `types/blog.ts` |
| 型定義 | DDD 移行済 | `src/modules/[domain]/domain/` 内で定義 | `src/modules/blog/domain/blog.ts` |
| DB スキーマ | 共通 | `db/schemas/[entity].ts` | `db/schemas/blogs.ts` |
| 共有 UI（shadcn） | 共通 | `components/ui/` | `components/ui/button.tsx` |
| 共有レイアウト | 共通 | `components/[layout-name]/` | `components/header/`, `components/footer/` |
| 機能別 UI | 旧構造 | `components/[feature]/` | `components/blog/list.tsx` |
| 機能別 UI | DDD 移行済 | `src/modules/[domain]/presentation/components/` | `src/modules/blog/presentation/components/blog-form.tsx` |
| 認証・session・共通 lib | 共通 | `lib/` | `lib/session.ts` |
| クライアントフック | 旧構造 | `hooks/` | `hooks/useToast.ts` |
| Context | 旧構造 | `contexts/` | `contexts/AuthContext.tsx` |
| 翻訳辞書 | 共通 | `messages/[locale]/` | `messages/ja/common.json` |

「ドメインの状態」が DDD 移行済かどうかは §1.2 のドメイン状態表で確認する。

## 7. `src/` の使用方針

- `src/` は DDD モジュール（`src/modules/[domain]/`）でのみ使用
- それ以外の用途で `src/` 配下にファイルを置かない
- 旧構造のディレクトリは引き続きルート直下に配置する（`src/actions/` のような移動はしない）

## 8. 関連ドキュメント

- [directory-roles.md](directory-roles.md): 旧構造の各ディレクトリの責任詳細・悪い例 / 良い例
- [file-conventions.md](file-conventions.md): 命名規則・export ルール・型定義方針
- [nextjs-patterns.md](nextjs-patterns.md): 実装テンプレート（Server / Client Component, Server Action, データ取得, フォーム）
- `nextjs-ddd.md`: DDD モジュールのルール（Phase 2 完了後に追加予定）
- [programming-principles.md](programming-principles.md): DRY / YAGNI / KISS / SoC / SRP / Fail Fast
