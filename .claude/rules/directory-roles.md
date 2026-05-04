# 旧構造ディレクトリの役割

本ドキュメントは [プログラミング原則](programming-principles.md)（DRY, YAGNI, KISS, SoC, SRP, Fail Fast）に基づいています。

旧構造ドメイン用のディレクトリ詳細。全体構造とディレクトリの選び方は [directory-structure.md](directory-structure.md)、命名・export ルールは [file-conventions.md](file-conventions.md)、実装テンプレは [nextjs-patterns.md](nextjs-patterns.md) を参照。

DDD 移行済みドメインは `src/modules/[domain]/` を使い、本ドキュメントは適用外。詳細は `nextjs-ddd.md`（Phase 2 完了後追加）を参照。

## 1. `actions/`  Server Actions（書き込み）

### 責任

- POST / PUT / DELETE 相当のサーバーサイド処理
- フォーム送信処理、データの作成・更新・削除
- 権限チェック、バリデーション、DB 操作、キャッシュ再検証を一連で実行

### 禁止

- GET 系のデータ取得（`data/` に書く）
- 権限チェックの省略

### 標準テンプレ

```typescript
"use server";

import { verifyAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { blogs } from "@/db/schemas/blogs";
import { blogFormSchema, type BlogFormData } from "@/zod/blog";

export async function createBlog(formData: BlogFormData) {
  // 1. 権限チェック
  const { userId } = await verifyAdmin();

  // 2. バリデーション
  const data = blogFormSchema.parse(formData);

  // 3. DB 操作
  const [newBlog] = await db
    .insert(blogs)
    .values({ ...data, authorId: userId })
    .returning();

  // 4. キャッシュ再検証
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");

  return newBlog;
}
```

### 粒度（両形式を許容）

| 形式 | 例 | 採用基準 |
|---|---|---|
| `actions/[feature].ts` | `actions/blog.ts` | アクションが少なく、まとめて読みやすい場合 |
| `actions/[feature]/[action-name].ts` | `actions/members/get-member.ts` | アクションが多い、または共通の前処理が長い場合 |

新規追加のとき既存ドメインに合わせる（混在しているのは現状仕様）。

### 悪い例

```typescript
// actions/blog.ts
"use server";

// GET 処理を Server Action に書いている
export async function getBlogs() {
  return db.query.blogs.findMany();
}
```

```typescript
// actions/blog.ts
"use server";

// 権限チェックなし
export async function deleteBlog(id: string) {
  await db.delete(blogs).where(eq(blogs.id, id));
}
```

### 良い例

```typescript
// actions/blog.ts
"use server";

export async function deleteBlog(id: string) {
  await verifyAdmin();
  await db.delete(blogs).where(eq(blogs.id, id));
  revalidatePath("/admin/blogs");
}
```

GET 処理は `data/blog.ts` に書く（次節）。

## 2. `data/`  読み取り処理（GET）

### 責任

- データ取得関数のみを配置
- Drizzle query を直接書いてよい
- 関数名は `get*` で始める

### 必須

- ファイル先頭に `import "server-only"`
- クライアントから誤って import されないようにする

### 標準テンプレ

```typescript
import "server-only";
import { db } from "@/db";
import { blogs } from "@/db/schemas/blogs";
import { and, desc, eq } from "drizzle-orm";

export const getPublishedBlogs = async () => {
  return db.query.blogs.findMany({
    where: eq(blogs.published, true),
    orderBy: [desc(blogs.createdAt)],
    with: { author: true },
  });
};

export const getPublicBlogs = async () => {
  return db.query.blogs.findMany({
    where: and(eq(blogs.published, true), eq(blogs.isMemberOnly, false)),
    orderBy: [desc(blogs.createdAt)],
    with: { author: true },
  });
};
```

### 悪い例

```typescript
// data/blog.ts
// "server-only" がない
import { db } from "@/db";

export const getBlogs = async () => {
  // ...
};
```

```typescript
// data/blog.ts
import "server-only";

// 書き込み処理が混在している
export const createBlog = async (data: BlogFormData) => {
  return db.insert(blogs).values(data);
};
```

書き込み処理は `actions/` に書く。

## 3. `components/`

### 配置基準

| 種別 | 配置先 | 例 |
|---|---|---|
| shadcn/ui の汎用 UI | `components/ui/` | `components/ui/button.tsx`, `components/ui/form.tsx` |
| ヘッダー、フッター、共通レイアウト等 | `components/[layout-name]/` | `components/header/`, `components/footer/` |
| 機能別 UI | `components/[feature]/` | `components/blog/list.tsx`, `components/admin/...` |

### 配置判断

1. shadcn/ui コマンドで追加されたものか → `components/ui/`
2. 複数機能で再利用される横断的 UI（ヘッダー、フッター、共通モーダル等）か → `components/[layout-name]/`
3. それ以外で特定機能専用 → `components/[feature]/`

### コンポーネントの責任

- props を受け取って UI を描画
- ユーザー操作をイベントハンドラ経由で通知
- 最小限のローカルステート（開閉状態など）

### 禁止

- コンポーネント内での fetch / DB アクセス（Server Component で `data/` を呼ぶ場合を除く）
- ビジネスロジック（計算、バリデーション）の直書き

### 悪い例

```tsx
// components/blog/list.tsx
"use client";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  // クライアントから fetch している
  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then(setBlogs);
  }, []);

  return (
    <ul>
      {blogs.map((b) => (
        <li>{b.title}</li>
      ))}
    </ul>
  );
};
```

### 良い例

```tsx
// components/blog/list.tsx
import type { Blog } from "@/types/blog";

type Props = {
  items: Blog[];
};

export const BlogList = ({ items }: Props) => {
  return (
    <ul>
      {items.map((b) => (
        <li key={b.id}>{b.title}</li>
      ))}
    </ul>
  );
};
```

データ取得は呼び出し元の Server Component が行う。

## 4. `db/`

### 4.1 `db/index.ts`

Drizzle ORM の初期化と DB クライアントの export。

### 4.2 `db/schemas/`

各テーブルのスキーマ定義。1 ファイル 1 テーブル（または密接な関連テーブル群）を原則。

#### 標準テンプレ

```typescript
// db/schemas/blogs.ts
import { pgTable, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";
import { users } from "./auth";

export const blogs = pgTable("blogs", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  published: boolean("published").notNull().default(false),
  isMemberOnly: boolean("is_member_only").notNull().default(false),
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const blogRelations = relations(blogs, ({ one }) => ({
  author: one(users, {
    fields: [blogs.authorId],
    references: [users.id],
  }),
}));
```

#### 命名

- ファイル名: kebab-case 複数形（`blogs.ts`, `member-plans.ts`）
- テーブル名: snake_case 複数形（`blogs`, `member_plans`）
- カラム名: snake_case（`created_at`, `is_member_only`）
- TypeScript の export 名: camelCase 複数形（`blogs`, `memberPlans`）

### 4.3 `db/migrations/`

`drizzle-kit generate` で自動生成。手動編集しない。

```bash
# マイグレーション生成
PATH="/opt/homebrew/bin:$PATH" /opt/homebrew/bin/pnpm drizzle-kit generate

# マイグレーション適用
PATH="/opt/homebrew/bin:$PATH" /opt/homebrew/bin/pnpm drizzle-kit migrate
```

## 5. `zod/`  バリデーション

### 責任

- フォーム入力バリデーション（React Hook Form の resolver 用）
- Server Action の引数バリデーション
- Drizzle スキーマから派生させて二重定義を避ける

### 標準テンプレ

```typescript
// zod/blog.ts
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { blogs } from "@/db/schemas/blogs";

export const blogFormSchema = createInsertSchema(blogs, {
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(255, "タイトルは255文字以内で入力してください"),
  content: z
    .string()
    .trim()
    .min(1, "本文を入力してください"),
}).omit({
  id: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
});

export type BlogFormData = z.infer<typeof blogFormSchema>;
```

### ルール

- `createInsertSchema(...)` で Drizzle から派生させる
- 自動生成されるカラム（`id`, `createdAt`, `updatedAt`）と、内部で設定するカラム（`authorId` 等）は `.omit({...})` で除外
- バリデーションメッセージは日本語
- 型は `z.infer<typeof xxxSchema>` で export し、`types/[feature].ts` と重複させない

### サブディレクトリ

- `zod/admin/`: 管理画面専用のバリデーション（一般ユーザー向けと分けたい場合）

## 6. `types/`  型定義

### 責任

- Drizzle スキーマから推論した型を export
- リレーションを含む拡張型の定義

### 標準テンプレ

```typescript
// types/blog.ts
import type { blogs } from "@/db/schemas/blogs";
import type { User } from "@/types/user";

// Drizzle から推論
export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;

// 拡張型
export type BlogWithAuthor = Blog & {
  author: User | null;
};
```

### ルール

- `typeof table.$inferSelect` で SELECT 結果型を推論
- `typeof table.$inferInsert` で INSERT 用型を推論
- `zod/[feature].ts` で `z.infer<...>` した型と重複させない（フォーム入力型は zod 側、永続化型は types 側）

### 悪い例

```typescript
// types/blog.ts
// Drizzle スキーマと別に手書き定義（重複・乖離リスク）
export type Blog = {
  id: string;
  title: string;
  content: string;
  // ...
};
```

## 7. `lib/`  共通ユーティリティ

### 責任

- 認証・session・権限チェック関数
- 外部サービスクライアントの初期化（Better Auth, ストレージ等）
- ドメインに属さない汎用ユーティリティ

### 配置例（実態）

| ファイル | 用途 |
|---|---|
| `lib/auth.ts` | Better Auth 初期化 |
| `lib/auth-client.ts` | クライアント側の認証ヘルパー |
| `lib/session.ts` | `verifyAdmin()`, `verifyOfficer()`, `verifyActiveMember()` 等の権限チェック関数 |
| `lib/storage.ts` | Cloudflare R2 等のストレージクライアント |
| `lib/email.ts`, `lib/batch-email.ts` | メール送信 |
| `lib/get-base-url.ts` | URL 解決ユーティリティ |
| `lib/utils.ts` | 汎用ヘルパー（cn 関数等） |

### 禁止

- ドメインロジックの配置（特定ドメイン専用の処理は `actions/` `data/` または DDD モジュールに書く）
- UI コンポーネントの配置

## 8. `hooks/`  クライアントフック

### 責任

- React Hooks を使用したクライアント専用ロジック
- 状態管理、副作用、イベント購読のカプセル化

### 命名

- ファイル名は kebab-case で `use-` で始める（例: `use-mobile.ts`, `use-postal-code.ts`）
- 関数名は camelCase で `use` で始める

### 配置例（実態）

| ファイル | 用途 |
|---|---|
| `hooks/use-mobile.ts` | モバイル判定 |
| `hooks/use-pdf-document.ts` | PDF 表示 |
| `hooks/use-postal-code.ts` | 郵便番号検索 |
| `hooks/use-scroll-animation.ts` | スクロールアニメーション |

### 禁止

- サーバー処理を含めない（Server Action や `data/` の呼び出しは行うが、内部に書かない）
- JSX を返さない（それはコンポーネント）

## 9. `contexts/`  React Context

### 責任

- グローバルな状態管理
- Provider と useXxx フックをセットで提供

### 標準テンプレ

```tsx
"use client";

import { createContext, useContext, useState } from "react";

type RegistrationContextType = {
  step: number;
  setStep: (step: number) => void;
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState(0);

  return (
    <RegistrationContext.Provider value={{ step, setStep }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error("useRegistration must be used within RegistrationProvider");
  }
  return context;
};
```

### 配置例（実態）

| ファイル | 用途 |
|---|---|
| `contexts/RegistrationContext.tsx` | 会員登録フローのステップ管理 |

## 10. `messages/`  翻訳辞書

### 責任

- next-intl 用の翻訳辞書

### 構造

```
messages/
├── ja.json
└── en.json
```

### ルール

- 1 ロケール 1 ファイル
- ネストでカテゴリ分け（`Contents.blog`, `Auth.login` 等）
- 新しいキーを追加するときは ja.json と en.json の両方に追加（片方だけにしない）

## 11. `middleware.ts`

### 責任

- Next.js のミドルウェア処理
- ロケール判定（next-intl）
- プレビュー環境の認証ガード
- 認証ガード（必要に応じて）

### 配置

- ルート直下に 1 ファイルのみ（`middleware.ts`）
- 複雑になったら処理ごとに関数を切り出して `lib/` に配置するが、エントリポイントは 1 ファイルのまま

## 12. 関連ドキュメント

- [directory-structure.md](directory-structure.md): 全体構造と配置判断早見表
- [file-conventions.md](file-conventions.md): 命名規則、export ルール、型定義方針
- [nextjs-patterns.md](nextjs-patterns.md): Server / Client Component, Server Action, データ取得, フォームの実装テンプレ
- [programming-principles.md](programming-principles.md): DRY / YAGNI / KISS / SoC / SRP / Fail Fast
- `nextjs-ddd.md`（Phase 2 完了後追加）: DDD モジュールのルール
