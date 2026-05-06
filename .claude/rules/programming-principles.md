# プログラミング原則

プロジェクト全体（Next.js、Django、TypeScript 等）で共通して適用する原則。

## 原則の概要

- **DRY (Don't Repeat Yourself)**: 重複は避ける、ただし無理な抽象化はしない
- **YAGNI (You Aren't Gonna Need It)**: 現在必要なものだけ作る、将来の拡張は将来考える
- **KISS (Keep It Simple, Stupid)**: シンプルに保つ、複雑さは必要最小限に
- **SoC (Separation of Concerns)**: 関心事を分離する、異なる責務は異なる場所に
- **SRP (Single Responsibility Principle)**: 1 つのモジュール/関数は 1 つの責任のみ
- **Fail Fast**: 問題は早期に検出し、早期に失敗させる

### 原則間の関係

- **DRY + YAGNI**: Rule of Three（3 回重複したら抽象化）でバランスを取る
- **KISS + SRP**: シンプルに保つために責任を分離する
- **SoC + SRP**: 関心事の分離は責任の分離と密接に関連
- **Fail Fast + 型システム**: TypeScript の型でコンパイル時に問題を検出

### 実践のポイント

- **読みやすさ優先**: 複雑な抽象化より適度な重複の方が良い場合もある
- **段階的な適用**: 最初からすべてを完璧にしようとしない
- **文脈に応じた判断**: 原則は絶対ではなく、状況に応じて柔軟に適用

## DRY (Don't Repeat Yourself)

同じコードを複数箇所に書かない。

### 適用範囲

- コードレベル: 関数、コンポーネント、ロジックの重複を避ける
- アーキテクチャレベル: 類似した構造や責務の重複を避ける
- データレベル: 定数、型定義、設定の重複を避ける

### 例

悪い例：

```typescript
// UserList.tsx
const formatDate = (date: Date) => {
  return date.toLocaleDateString("ja-JP");
};

// ProductList.tsx
const formatDate = (date: Date) => {
  return date.toLocaleDateString("ja-JP");
};
```

良い例：

```typescript
// lib/utils.ts
export const formatDate = (date: Date) => {
  return date.toLocaleDateString("ja-JP");
};

// components/blog/list.tsx
import { formatDate } from "@/lib/utils";

// components/newsletter/list.tsx
import { formatDate } from "@/lib/utils";
```

## YAGNI (You Aren't Gonna Need It)

今必要ないものは作らない。将来使うかもしれないという理由で実装しない。

### 適用範囲

- コードレベル: 使われていない関数、export、抽象化を作らない
- アーキテクチャレベル: 現在不要な機能、拡張ポイントを作らない
- データレベル: 使われていない型、定数、設定を定義しない

### 例

悪い例：

```typescript
// ❌ 将来使うかもしれないという理由でexport
export function isValidFiveDigits(value: string): boolean {
  return /^(?:\d{5})$/.test(value);
}

// ❌ 将来の拡張を見越した抽象化
interface DataValidator<T> {
  validate(data: T): ValidationResult;
  transform(data: T): T;
  rollback(data: T): T;
}
```

良い例：

```typescript
// ✅ 実際に使われている関数のみexport
export function isValidFourDigits(value: string): boolean {
  return /^(?:\d{4})$/.test(value);
}

// ✅ 現在必要な機能のみ実装
export function validateImportData(
  rows: Record<string, any>[]
): ValidationError | null {
  // 実際に必要なバリデーションのみ
}
```

### アーキテクチャレベルでの YAGNI

悪い例：

```typescript
// ❌ 現在使われていないのに抽象化
// data/_base.ts
abstract class BaseRepository<T> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: string): Promise<T | undefined>;
  abstract create(data: T): Promise<T>;
  abstract update(id: string, data: T): Promise<T>;
  abstract delete(id: string): Promise<void>;
}

// data/blog.ts
class BlogRepository extends BaseRepository<Blog> {
  // 実際には findAll と findById しか使っていない
}
```

良い例：

```typescript
// ✅ 実際に必要な関数のみ export
// data/blog.ts
import "server-only";
import { db } from "@/db";
import { blogs } from "@/db/schemas/blogs";
import { eq, desc } from "drizzle-orm";

export const getPublishedBlogs = async () => {
  return db.query.blogs.findMany({
    where: eq(blogs.published, true),
    orderBy: [desc(blogs.createdAt)],
  });
};

export const getBlogById = async (id: string) => {
  return db.query.blogs.findFirst({ where: eq(blogs.id, id) });
};

// 削除や更新が必要になったら、その時に actions/blog.ts に追加
```

## KISS (Keep It Simple, Stupid)

シンプルに保つ。複雑さは必要最小限にする。

### 適用範囲

- コードレベル: 簡潔な実装、明確なロジック
- アーキテクチャレベル: 単純な構造、理解しやすい設計
- インターフェースレベル: 直感的な API、明確な関数名

### 例

悪い例：

```typescript
// ❌ 過度に抽象化されたユーティリティ
class DataProcessor<T, U, V> {
  constructor(
    private transformer: (data: T) => U,
    private validator: (data: U) => boolean,
    private mapper: (data: U) => V
  ) {}

  process(data: T[]): V[] {
    return data.map(this.transformer).filter(this.validator).map(this.mapper);
  }
}

// 使用側が複雑になる
const processor = new DataProcessor<RawData, ValidData, DisplayData>(
  (raw) => transform(raw),
  (valid) => validate(valid),
  (valid) => map(valid)
);
```

良い例：

```typescript
// ✅ シンプルで明確
export function processUserData(rawData: RawData[]): DisplayData[] {
  return rawData
    .map(transformUserData)
    .filter(isValidUserData)
    .map(mapToDisplayData);
}
```

### アーキテクチャレベルでの KISS

悪い例：

```typescript
// ❌ 不要なレイヤー（旧構造ドメインで DDD 4 層を強引に持ち込む）
// services/blog-service.ts
interface IBlogService {
  getBlogs(): Promise<Blog[]>;
}

class BlogService implements IBlogService {
  constructor(private repository: IBlogRepository) {}
  async getBlogs(): Promise<Blog[]> {
    return this.repository.findAll();
  }
}

// data/blog-repository.ts
interface IBlogRepository {
  findAll(): Promise<Blog[]>;
}

class BlogRepository implements IBlogRepository {
  async findAll(): Promise<Blog[]> {
    return db.query.blogs.findMany();
  }
}

// 使用側
const repository = new BlogRepository();
const service = new BlogService(repository);
const items = await service.getBlogs();
```

良い例：

```typescript
// ✅ 旧構造ドメインでは関数 1 段でよい
// data/blog.ts
import "server-only";
import { db } from "@/db";

export const getPublishedBlogs = async () => {
  return db.query.blogs.findMany({ where: eq(blogs.published, true) });
};

// 使用側（Server Component）
const items = await getPublishedBlogs();
```

注: DDD モジュール（`src/modules/[domain]/`）では Repository / Use Case の分離が必要。これは YAGNI の例外で、ドメインの境界を保つために必要なレイヤー。詳細は `nextjs-ddd.md`（Phase 2 完了後追加）。

## SoC (Separation of Concerns)

関心事を分離する。異なる責務は異なる場所に配置する。

### 適用範囲

- ファイルレベル: 1 ファイル = 1 つの責務
- ディレクトリレベル: 役割ごとにディレクトリを分ける
- モジュールレベル: UI とビジネスロジックを分離

### 例

悪い例：

```tsx
// ❌ UI、ビジネスロジック、データ取得が 1 ファイルに混在
// app/[locale]/(main)/blog/page.tsx
"use client";

const BlogPage = () => {
  const [items, setItems] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBlogs = async () => {
    setIsLoading(true);
    const response = await fetch("/api/blogs");
    const data = await response.json();

    // ビジネスロジック
    const published = data.filter((b: Blog) => b.published);
    const sorted = published.sort((a: Blog, b: Blog) =>
      b.createdAt.localeCompare(a.createdAt)
    );

    setItems(sorted);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {items.map((b) => <div key={b.id}>{b.title}</div>)}
    </div>
  );
};
```

良い例：

```typescript
// ✅ 関心事を分離

// data/blog.ts - データ取得
import "server-only";
import { db } from "@/db";
import { blogs } from "@/db/schemas/blogs";
import { eq, desc } from "drizzle-orm";

export const getPublishedBlogs = async () => {
  return db.query.blogs.findMany({
    where: eq(blogs.published, true),
    orderBy: [desc(blogs.createdAt)],
  });
};
```

```tsx
// components/blog/list.tsx - UI（props を受け取って表示するだけ）
import type { Blog } from "@/types/blog";

type Props = { items: Blog[] };

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

```tsx
// app/[locale]/(main)/blog/page.tsx - 取得 + 描画の組み合わせ
import { getPublishedBlogs } from "@/data/blog";
import { BlogList } from "@/components/blog/list";

export default async function BlogPage() {
  const items = await getPublishedBlogs();
  return <BlogList items={items} />;
}
```

## SRP (Single Responsibility Principle)

単一責任の原則。1 つのモジュール/クラス/関数は 1 つの責任のみを持つ。

### 適用範囲

- 関数レベル: 1 つの関数は 1 つのことだけを行う
- コンポーネントレベル: 1 つのコンポーネントは 1 つの役割のみ
- モジュールレベル: 1 つのファイルは 1 つの責務のみ

### 例

悪い例：

```typescript
// ❌ 複数の責任を持つ Server Action
"use server";

export async function createBlogHandler(formData: BlogFormData) {
  // バリデーション
  if (!formData.title || formData.title.length === 0) {
    throw new Error("タイトルが必要です");
  }

  // データ変換
  const data = {
    title: formData.title.trim(),
    content: formData.content.trim(),
  };

  // 権限チェック
  const session = await getSession();
  if (session?.user.role !== "admin") {
    throw new Error("権限がありません");
  }

  // DB 操作
  const [blog] = await db.insert(blogs).values(data).returning();

  // キャッシュ再検証
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");

  return blog;
}
```

良い例：

```typescript
// ✅ 責任を分離

// zod/blog.ts - バリデーション
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { blogs } from "@/db/schemas/blogs";

export const blogFormSchema = createInsertSchema(blogs, {
  title: z.string().trim().min(1, "タイトルを入力してください"),
}).omit({ id: true, authorId: true, createdAt: true, updatedAt: true });

export type BlogFormData = z.infer<typeof blogFormSchema>;
```

```typescript
// lib/session.ts - 権限チェック（既存）
export const verifyAdmin = async () => {
  // ...
};
```

```typescript
// actions/blog.ts - 入口（薄く保つ。検証・権限・操作・再検証のオーケストレーションのみ）
"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/session";
import { db } from "@/db";
import { blogs } from "@/db/schemas/blogs";
import { blogFormSchema, type BlogFormData } from "@/zod/blog";

export async function createBlog(formData: BlogFormData) {
  const { userId } = await verifyAdmin();
  const data = blogFormSchema.parse(formData);

  const [blog] = await db
    .insert(blogs)
    .values({ ...data, authorId: userId })
    .returning();

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");

  return blog;
}
```

### コンポーネントレベルでの SRP

悪い例：

```tsx
// ❌ データ取得と UI を両方担当
"use client";

const BlogList = () => {
  const [items, setItems] = useState<Blog[]>([]);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  return (
    <ul>
      {items.map((b) => (
        <li key={b.id}>{b.title}</li>
      ))}
    </ul>
  );
};
```

良い例：

```tsx
// ✅ UI のみを担当（データは props で受け取る）
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

## Fail Fast

早期失敗。問題を早く検出し、早く失敗させる。

### 適用範囲

- バリデーション: 入力値は早期にチェック
- エラーハンドリング: エラーは即座に検出・報告
- 型チェック: TypeScript の型で早期に問題を発見

### 例

悪い例：

```typescript
// ❌ エラーを後回しにする
function processUserData(data: any) {
  // エラーチェックなし
  const users = data.users;

  // 処理を続ける
  const validUsers = users.filter((u) => {
    // ここでnullチェック
    if (!u) return false;
    if (!u.email) return false;
    return true;
  });

  // さらに処理
  return validUsers.map((u) => ({
    ...u,
    // ここでもエラーが起きる可能性
    displayName: u.firstName + " " + u.lastName,
  }));
}
```

良い例：

```typescript
// ✅ 早期にバリデーション・失敗
function processUserData(data: unknown): User[] {
  // 最初にデータ構造をチェック
  if (!data || typeof data !== "object") {
    throw new Error("Invalid data format");
  }

  if (!("users" in data) || !Array.isArray(data.users)) {
    throw new Error("Users array is required");
  }

  // 各ユーザーをバリデーション
  return data.users.map((user, index) => {
    if (!user || typeof user !== "object") {
      throw new Error(`Invalid user at index ${index}`);
    }

    if (!("email" in user) || typeof user.email !== "string") {
      throw new Error(`Invalid email at index ${index}`);
    }

    if (!("firstName" in user) || !("lastName" in user)) {
      throw new Error(`Missing name at index ${index}`);
    }

    // ここまで来たら安全
    return {
      ...user,
      displayName: `${user.firstName} ${user.lastName}`,
    };
  });
}
```

### TypeScript での Fail Fast

悪い例：

```typescript
// ❌ any を使用してエラーを遅延
function getBlog(id: any): any {
  return db.query.blogs.findFirst({ where: eq(blogs.id, id) });
}

// 使用側でエラーが起きる
const blog = await getBlog(123); // 本来は string なのに number を渡している
console.log(blog.title.toUpperCase()); // ランタイムエラーの可能性
```

良い例：

```typescript
// ✅ 型で早期にエラーを検出
import type { Blog } from "@/types/blog";

export const getBlogById = async (id: string): Promise<Blog | undefined> => {
  return db.query.blogs.findFirst({ where: eq(blogs.id, id) });
};

// コンパイル時にエラー
const blog = await getBlogById(123); // Type error: number is not assignable to string
```

### Zod でのバリデーション

```typescript
// ✅ スキーマで早期バリデーション
// actions/blog.ts
"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/session";
import { db } from "@/db";
import { blogs } from "@/db/schemas/blogs";
import { blogFormSchema } from "@/zod/blog";

export async function createBlog(data: unknown) {
  await verifyAdmin();

  // 最初にバリデーション（失敗したら即エラー）
  const validated = blogFormSchema.parse(data);

  // ここからは安全な型で作業
  const [blog] = await db.insert(blogs).values(validated).returning();
  revalidatePath("/admin/blogs");
  return blog;
}
```
