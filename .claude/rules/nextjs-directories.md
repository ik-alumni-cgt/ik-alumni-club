# Next.js ディレクトリ詳細

本ドキュメントは [プログラミング原則](programming-principles.md)（DRY, YAGNI, KISS, SoC, SRP, Fail Fast）に基づいています。

## 概要

- actions.ts: Server Actions を配置（新規構造専用）
- components/: UI コンポーネント（機能専用・共有）
- constants: 定数定義（機能専用・共有）
- context: グローバル状態管理（機能専用・共有）
- hooks/: 状態管理とビジネスロジック（機能専用）
- page.tsx: ページエントリーポイント（新規構造専用）
- queries.ts: データ取得、services/から移行（新規構造専用）
- schemas.ts: バリデーション、validators/から移行（新規構造専用）
- types.ts: 型定義（機能専用・共有）
- utils.ts: データ整形・計算処理（機能専用）

## actions.ts

**適用構造**: 新規構造専用（`src/app/[feature]/actions.ts`）

### 概要

Server Actions を配置。App Router 移行時にそのまま使える形で準備。

### 責任

- サーバーサイドでのデータ操作
- フォーム送信処理
- データの作成・更新・削除

### 例

```typescript
// src/app/users/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { userSchema } from "./schemas";

export async function createUser(formData: FormData) {
  const validated = userSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  const user = await db.user.create({ data: validated });

  revalidatePath("/users");
  return { success: true, user };
}

export async function updateUser(id: number, formData: FormData) {
  const validated = userSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  const user = await db.user.update({
    where: { id },
    data: validated,
  });

  revalidatePath(`/users/${id}`);
  return { success: true, user };
}
```

## components/

**適用構造**: 両方（機能専用: `src/app/[feature]/components/`, 共有: `src/shared/components/`）

### 概要

UI コンポーネントを配置。props を受け取って表示のみを担当。

### 責任

- props を受け取って UI を描画
- ユーザー操作をイベントハンドラ経由で通知
- 最小限のローカルステート（開閉状態など）

### 悪い例

```tsx
// コンポーネント内でAPI呼び出し
const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <ul>
      {users.map((u) => (
        <li>{u.name}</li>
      ))}
    </ul>
  );
};

// コンポーネント内で複雑な計算
const UserCard = ({ user }) => {
  const score = user.points * 1.5 + user.bonus - user.penalty;
  return <div>{score}</div>;
};
```

### 良い例

```tsx
// propsでデータを受け取る
type Props = {
  users: User[];
  onUserClick: (id: number) => void;
};

const UserList = ({ users, onUserClick }: Props) => {
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id} onClick={() => onUserClick(u.id)}>
          {u.name}
        </li>
      ))}
    </ul>
  );
};

// 計算結果をpropsで受け取る
const UserCard = ({ user, score }: { user: User; score: number }) => {
  return <div>{score}</div>;
};
```

## constants.ts / constants/

**適用構造**: 両方（機能専用: `src/app/[feature]/constants.ts`, 共有: `src/shared/constants/`）

### 概要

定数定義を配置。

### 責任

- アプリケーション定数の定義
- マジックナンバーの排除

### 例

```typescript
// src/app/data-import/constants.ts

export const EXPECTED_COLUMNS: string[] = [
  "user_first_name",
  "user_last_name",
  "email",
  "phone",
];

export const DEFAULT_VALUES: Record<string, any> = {
  user_first_name: "",
  user_last_name: "",
  email: "",
  phone: "",
};

export const REQUIRED_COLUMNS: string[] = [
  "user_first_name",
  "user_last_name",
  "email",
];
```

注：定数の export ルールと配置基準については [typescript-exports.md](typescript-exports.md) を参照。

## context.tsx / context/

**適用構造**: 両方（機能専用: `src/app/[feature]/context.tsx`, 共有: `src/shared/context/`）

### 概要

React Context を配置。グローバルな状態管理。

### 責任

- Context の定義
- Provider コンポーネントの提供
- カスタムフックの提供（useContext のラッパー）

### 例

```tsx
// src/shared/context/AuthContext.tsx
import { createContext, useContext, useState } from "react";

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

## hooks/

**適用構造**: 機能専用（`src/app/[feature]/hooks/`）

### 概要

React Hooks を使用したカスタムフック。状態管理とビジネスロジックを担当。

### 責任

- 状態管理
- 副作用の制御（useEffect）
- ビジネスロジックのカプセル化

### 命名規則

- `use`で始める（useXxx）

### 悪い例

```tsx
// JSXを返す（これはコンポーネント）
const useUserCard = (userId: number) => {
  const user = useUser(userId);
  return <div>{user.name}</div>;
};

// useで始まらない
const getUserData = () => {
  const [user, setUser] = useState();
  return user;
};
```

### 良い例

```tsx
// src/app/users/hooks/useUsers.ts
import { useState, useEffect } from "react";
import { getUsers } from "../queries";
import { filterAndSortUsers } from "../utils";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getUsers()
      .then(filterAndSortUsers)
      .then(setUsers)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  return { users, isLoading, error };
};
```

## page.tsx

**適用構造**: 新規構造専用（`src/app/[feature]/page.tsx`）

### 概要

ページコンポーネントを配置。App Router のページエントリーポイント。

### 責任

- ページの UI 構成
- 既存構造（Pages Router）では `pages/` を使用

### 例

```tsx
// src/app/users/page.tsx
import { UsersPage } from "./components/UsersPage";

export default function Page() {
  return <UsersPage />;
}

// src/app/users/components/UsersPage.tsx
import { useUsers } from "../hooks/useUsers";
import { UserList } from "./UserList";

export const UsersPage = () => {
  const { users, isLoading } = useUsers();

  return (
    <div>
      <h1>Users</h1>
      {isLoading && <p>Loading...</p>}
      {users && <UserList users={users} />}
    </div>
  );
};
```

## queries.ts

**適用構造**: 新規構造専用（`src/app/[feature]/queries.ts`）

**既存構造の対応**: `services/` → `queries.ts` に統合

### 概要

データ取得ロジックを配置。API 呼び出しやデータベースクエリ。

### 責任

- データの取得
- エラーハンドリング（Fail Fast: エラーは即座に throw）
- キャッシング戦略

### 例

```typescript
// src/app/users/queries.ts
import { API_URL } from "@/shared/constants/config";

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function getUser(id: number): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

function getToken(): string {
  return localStorage.getItem("token") || "";
}
```

## schemas.ts

**適用構造**: 新規構造専用（`src/app/[feature]/schemas.ts`）

**既存構造の対応**: `validators/` → `schemas.ts` に統合

### 概要

バリデーションスキーマを配置（Zod、Yup など）。Fail Fast 原則に則り、入力値を早期にバリデーションする。

### 責任

- 入力値の型定義と検証
- エラーメッセージの定義
- 早期バリデーションによる問題の即座な検出

### 例

```typescript
// src/app/users/schemas.ts
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(0).max(150).optional(),
});

export type UserInput = z.infer<typeof userSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

## types.ts

**適用構造**: 両方（機能専用: `src/app/[feature]/types.ts`, 共有: `src/shared/types/`）

### 概要

型定義を配置。

### 責任

- 機能内で使用するデータ構造の型定義

### 例

```typescript
// src/app/users/types.ts

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
};

export type UserRole = "admin" | "user" | "guest";

export type UserListProps = {
  users: User[];
  onUserClick: (id: number) => void;
};
```

注：型の export ルールと配置基準については [typescript-exports.md](typescript-exports.md) を参照。

## utils.ts

**適用構造**: 機能専用（`src/app/[feature]/utils.ts`）

### 概要

データ整形や計算処理を配置。

### 責任

- データ変換
- 計算処理
- ヘルパー関数

### 例

```typescript
// src/app/users/utils.ts

export function filterAndSortUsers(users: User[]): User[] {
  return users
    .filter((u) => u.isActive)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function calculateUserScore(user: User): number {
  return user.points * 1.5 + user.bonus - user.penalty;
}

export function formatUserName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}
```

## 責務分離の実践例

### 悪い例：全て 1 ファイルに詰め込む

```tsx
// pages/data-import.tsx

const EXPECTED_COLUMNS = [...];
const DEFAULT_VALUES = {...};
const VALIDATION_RULES = {...};

export function isValidFormat(value: string): boolean {
  return /^(?:\d{4})$/.test(value);
}

let DEBUG_FLAG = false;

const DataImportPage = () => {
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (event) => {
    // 複雑なパース処理
  };

  const submit = async () => {
    // FormData生成
    // API呼び出し
    // エラーハンドリング
    // 状態更新
  };

  return (
    <div>
      {/* 大量のJSX */}
    </div>
  );
};
```

### 良い例：責務を分離

#### 1. hooks/ - ビジネスロジックと状態管理

```typescript
// hooks/useDataImport.ts
import { useState, useCallback } from "react";
import { dataImportApi } from "@/services/dataImportApi";
import { validateImportData } from "@/validators/dataValidators";
import { EXPECTED_COLUMNS, DEFAULT_VALUES } from "@/constants/dataImport";

export const useDataImport = () => {
  const [dataRows, setDataRows] = useState<Record<string, any>[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<ProcessError | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const handleFile = useCallback(async (file: File) => {
    const parsedData = await parseDataFile(file);

    const validationError = validateImportData(parsedData);
    if (validationError) {
      setProcessError(validationError);
      return;
    }

    setDataRows(parsedData);
    setTotalCount(parsedData.length);
  }, []);

  const submit = useCallback(async () => {
    if (isProcessing || dataRows.length === 0) return;

    setIsProcessing(true);
    setProcessError(null);

    try {
      for (let i = 0; i < dataRows.length; i++) {
        await dataImportApi.importData(dataRows[i]);
        setCompletedCount(i + 1);
      }

      toast.success("登録完了");
    } catch (error) {
      setProcessError({
        kind: "exception",
        message: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [dataRows, isProcessing]);

  return {
    dataRows,
    handleFile,
    submit,
    isProcessing,
    processError,
    progressPercent: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
    totalCount,
    completedCount,
  };
};
```

#### 2. constants/ - 定数定義

```typescript
// constants/dataImport.ts

export const EXPECTED_COLUMNS: string[] = [
  "user_first_name",
  "user_last_name",
  "email",
  "phone",
];

export const DEFAULT_VALUES: Record<string, any> = {
  user_first_name: "",
  user_last_name: "",
  email: "",
  phone: "",
};

export const PLACEHOLDER_VALUES: Record<string, any> = {
  user_first_name: "名前（名）を入力してください",
  email: "メールアドレスを入力してください",
};

export const REQUIRED_COLUMNS: string[] = [
  "user_first_name",
  "user_last_name",
  "email",
];
```

#### 3. components/ - UI コンポーネント

```tsx
// components/data_import/DataImportForm.tsx
type Props = {
  onFileChange: (file: File) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  selectedFileName?: string;
};

export const DataImportForm = ({
  onFileChange,
  onSubmit,
  isProcessing,
  selectedFileName,
}: Props) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={isProcessing}
      />

      <span>{selectedFileName || "選択されていません"}</span>

      <button onClick={onSubmit} disabled={isProcessing}>
        {isProcessing ? "処理中…" : "送信"}
      </button>
    </div>
  );
};
```

#### 4. pages/ - ページコンポーネント

```tsx
// pages/data-import.tsx
import { useDataImport } from "@/hooks/useDataImport";
import { DataImportForm } from "@/components/data_import/DataImportForm";
import { ProgressBar } from "@/components/data_import/ProgressBar";
import { ErrorDisplay } from "@/components/data_import/ErrorDisplay";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const DataImportPage = () => {
  const {
    handleFile,
    submit,
    isProcessing,
    processError,
    progressPercent,
    totalCount,
    completedCount,
  } = useDataImport();

  return (
    <div className="container">
      <h1>データインポートフォーム</h1>

      <ProgressBar
        total={totalCount}
        completed={completedCount}
        isProcessing={isProcessing}
        percent={progressPercent}
      />

      {processError && <ErrorDisplay error={processError} />}

      <DataImportForm
        onFileChange={handleFile}
        onSubmit={submit}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default DataImportPage;
```
