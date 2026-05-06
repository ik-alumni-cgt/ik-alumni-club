# ファイル規約

本ドキュメントは [プログラミング原則](programming-principles.md)（特に YAGNI と SRP）に基づいています。

ファイル名・シンボル命名・export のスコープ・型定義の方針をまとめる。配置場所の判断は [directory-structure.md](directory-structure.md)、各ディレクトリの責任は [directory-roles.md](directory-roles.md)、実装テンプレは [nextjs-patterns.md](nextjs-patterns.md) を参照。

## 1. ファイル名・ディレクトリ名

| 対象 | 規則 | 例 |
|---|---|---|
| ファイル名（コンポーネント） | kebab-case | `blog-form.tsx`, `welcome-gift-checkbox.tsx` |
| ファイル名（その他 ts） | kebab-case | `member-plans.ts`, `use-postal-code.ts` |
| ディレクトリ名 | kebab-case | `admin-dashboard/`, `member-plans/` |

### 既存例外（実態に合わせる）

- `contexts/` 配下は PascalCase（例: `RegistrationContext.tsx`）
  - 既存ファイルに合わせる
  - 新規 Context を追加する場合は kebab-case を推奨。ただし既存と統一したい場合は PascalCase 継続も可

## 2. シンボル命名

| 対象 | 規則 | 例 |
|---|---|---|
| 変数・関数 | camelCase | `userName`, `getBlogs` |
| 定数 | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE`, `API_URL` |
| コンポーネント | PascalCase | `BlogForm`, `UserCard` |
| 型・インターフェース | PascalCase | `Member`, `BlogFormData` |
| React Hook | `use` + camelCase | `useAuth`, `usePostalCode` |
| DB カラム | snake_case | `created_at`, `is_member_only` |
| DB テーブル | snake_case 複数形 | `blogs`, `member_plans` |
| Drizzle スキーマ export 名 | camelCase 複数形 | `blogs`, `memberPlans` |

## 3. 関数命名パターン

### 動詞プレフィックス

| パターン | 用途 | 例 |
|---|---|---|
| `get*` | データ取得 | `getBlogs`, `getMember` |
| `create*` | 新規作成 | `createBlog`, `createMember` |
| `update*` | 更新 | `updateBlog`, `updateProfile` |
| `delete*` | 削除 | `deleteBlog`, `deleteAccount` |
| `toggle*` | 状態切替 | `togglePublish`, `toggleWelcomeGift` |
| `verify*` | 検証・認証 | `verifySession`, `verifyAdmin` |
| `can*` | 権限チェック | `canAccessMemberContent`, `canEdit` |
| `handle*` | イベントハンドラ | `handleSubmit`, `handleClick` |
| `on*` | コールバック（Props 名） | `onChange`, `onSubmit` |

### Boolean 命名

```typescript
// 良い例
const isLoading = true;
const hasPermission = false;
const canEdit = true;
const shouldRefresh = false;

// 悪い例
const loading = true;
const permission = false;
```

`is` / `has` / `can` / `should` のいずれかを必ず付ける。

## 4. import の規則

### 4.1 型は必ず `import type`

```typescript
// 良い例
import type { Member, MemberWithPlan } from "@/types/member";

// 悪い例
import { Member } from "@/types/member";
```

理由: ビルド時の依存解析が正しく動き、不要な実行時 import が消える。

### 4.2 import 順序

外部 → 内部の順。

```typescript
// 1. Node 標準・外部パッケージ
import { useForm } from "react-hook-form";
import { z } from "zod";

// 2. 内部（@/ alias）
import { db } from "@/db";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/types/blog";
```

### 4.3 alias

`@/` をルート alias として使う（tsconfig.json で設定済み）。相対パス（`../../...`）を多用しない。

## 5. export のスコープルール

### 5.1 他ファイルで使わないものは export しない

export することで失うもの:
- IDE の「未使用」警告が機能しなくなる
- リファクタリング時の影響範囲が見えなくなる
- 依存関係が複雑化する

```typescript
// 悪い例: data/blog.ts
import "server-only";

// ファイル内でしか使わない関数を export
export function buildBlogQuery(filter: BlogFilter) {
  // ...
}

export const getBlogs = async (filter: BlogFilter) => {
  return buildBlogQuery(filter);
};
```

```typescript
// 良い例
import "server-only";

// ファイル内のみ（export しない）
function buildBlogQuery(filter: BlogFilter) {
  // ...
}

export const getBlogs = async (filter: BlogFilter) => {
  return buildBlogQuery(filter);
};
```

### 5.2 将来用の export 禁止（YAGNI）

「将来使うかもしれない」という理由で export しない。実際に他ファイルから import されたタイミングで export する。

### 5.3 型も同じ原則

```typescript
// 悪い例: types/blog.ts
// 使われていない型を export
export type BlogStatistics = {
  totalViews: number;
  averageReadTime: number;
};
```

ファイル内でのみ使う型は export しない。

### 5.4 IDE の未使用警告を活かす

ESLint / TypeScript の未使用警告が信頼できる状態を保つ。これは export を絞ることが前提。

## 6. 変数宣言

```typescript
// 良い例
const items = ["a", "b", "c"];

// 良い例: 再代入が必要な場合のみ let
let count = 0;
count++;

// 悪い例: var 禁止
var oldStyle = "deprecated";
```

### ファイルスコープのグローバル可変変数禁止

```typescript
// 悪い例: components/some-form.tsx
let isProcessing = false; // ファイルスコープで let

const SomeForm = () => {
  const handleSubmit = () => {
    isProcessing = true;
  };
  return <button onClick={handleSubmit}>Submit</button>;
};
```

```typescript
// 良い例: コンポーネント内の state
const SomeForm = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = () => {
    setIsProcessing(true);
  };
  return <button onClick={handleSubmit}>Submit</button>;
};
```

## 7. 定数のスコープ判断

| スコープ | 配置先 | export | 例 |
|---|---|---|---|
| ファイル内のみ | そのファイル内に定義 | しない | `data/blog.ts` 内の `DEFAULT_LIMIT = 20` |
| 1 ドメイン内で複数ファイルが共有 | そのドメインの該当ディレクトリ | する | 旧構造: `zod/[feature].ts` 内の `EXPECTED_COLUMNS` 等 / 新構造（DDD）: `src/modules/[domain]/` 内 |
| プロジェクト全体 | `lib/` または専用ファイル | する | `lib/utils.ts` 内の `cn` 関数等 |

### 注意

- `src/shared/constants/` は不採用（旧ルール由来。本プロジェクトでは使わない）
- ドメイン専用の定数ファイルを新規追加する必要が出たら、まず既存ファイル（`zod/[feature].ts` `types/[feature].ts`）に集約できないか検討する。それでも分けたいときに新ファイル

```typescript
// ファイル内のみ
// data/blog.ts
import "server-only";

const DEFAULT_LIMIT = 20; // export しない

export const getBlogs = async () => {
  return db.query.blogs.findMany({ limit: DEFAULT_LIMIT });
};
```

```typescript
// プロジェクト全体
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 8. 型定義の方針

### 8.1 Drizzle 推論を優先

```typescript
// 良い例: types/blog.ts
import type { blogs } from "@/db/schemas/blogs";

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
```

```typescript
// 悪い例: 手書き定義（重複・乖離リスク）
export type Blog = {
  id: string;
  title: string;
  content: string;
  // ...
};
```

### 8.2 zod の `z.infer` も併用

フォーム入力型は `zod/[feature].ts` で定義し、`z.infer` で型を export する。

```typescript
// zod/blog.ts
export const blogFormSchema = createInsertSchema(blogs, { /* ... */ }).omit({ /* ... */ });
export type BlogFormData = z.infer<typeof blogFormSchema>;
```

`types/blog.ts` には `BlogFormData` を再定義しない（zod 側に任せる）。

### 8.3 拡張型は `types/` に

リレーション込みの型・複数型を組み合わせた表示用型は `types/` に置く。

```typescript
// types/blog.ts
export type BlogWithAuthor = Blog & {
  author: User | null;
};
```

### 8.4 `any` 禁止、`unknown` + Zod で fail fast

```typescript
// 悪い例
function getUser(id: any): any {
  return fetch(`/api/users/${id}`).then((res) => res.json());
}
```

```typescript
// 良い例
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export async function getUser(id: string) {
  const data: unknown = await fetch(`/api/users/${id}`).then((res) => res.json());
  return userSchema.parse(data);
}
```

外部入力（API レスポンス、フォーム入力等）は `unknown` で受けて Zod でバリデーションする。

## 9. 非同期処理

`async` / `await` を使う。Promise chain は避ける。

```typescript
// 良い例
async function fetchUser(id: string): Promise<User> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return user;
}

// 悪い例
function fetchUser(id: string) {
  return db.query.users
    .findFirst({ where: eq(users.id, id) })
    .then((user) => processUser(user))
    .then((result) => result);
}
```

## 10. エラーハンドリング

### try-catch で適切にハンドリング

```typescript
// 良い例
async function createBlog(data: BlogFormData) {
  try {
    const result = await db.insert(blogs).values(data).returning();
    return result;
  } catch (error) {
    console.error("ブログ作成エラー:", error);
    throw new Error("ブログの作成に失敗しました");
  }
}
```

### エラーを握りつぶさない

```typescript
// 悪い例: エラーを null で返す（呼び出し元が判別できない）
async function createBlog(data: BlogFormData) {
  try {
    return await db.insert(blogs).values(data).returning();
  } catch (error) {
    return null;
  }
}
```

エラーはログに残し、呼び出し元に伝える。

## 11. 関連ドキュメント

- [directory-structure.md](directory-structure.md): 全体構造と配置判断早見表
- [directory-roles.md](directory-roles.md): 旧構造の各ディレクトリの責任詳細
- [nextjs-patterns.md](nextjs-patterns.md): Server / Client Component, Server Action, データ取得, フォームの実装テンプレ
- [programming-principles.md](programming-principles.md): DRY / YAGNI / KISS / SoC / SRP / Fail Fast
- `nextjs-ddd.md`（Phase 2 完了後追加）: DDD モジュールのルール
