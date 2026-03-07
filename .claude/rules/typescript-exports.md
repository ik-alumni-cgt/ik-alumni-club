# TypeScript Export とスコープのルール

本ルールは [プログラミング原則](programming-principles.md) の YAGNI と SRP に基づいています。

## 概要

- 他のファイルで使わないものは export しない
- 将来使うかもしれないという理由で export しない
- ファイルスコープのグローバル変数は避ける
- 適切なスコープで変数・定数を管理する
- IDE の警告を活かすため、不要な export は削除する

配置場所の判断については [Next.js アーキテクチャ](nextjs-architecture.md) を参照。

## Export のルール

### 1. 他のファイルで使わないものは export しない

export しないことで得られるメリット：

- IDE の「未使用の変数/関数」警告が正しく機能する
- リファクタリング時に影響範囲が明確
- コードの依存関係がシンプルになる

悪い例：

```typescript
// src/app/users/queries.ts

// ファイル内でしか使わない関数をexport
export function getToken(): string {
  return localStorage.getItem("token") || "";
}

// 将来使うかもしれないという理由でexport
export function getUsersByRole(role: string): Promise<User[]> {
  // 実際には使われていない
}

// 実際に他のファイルで使われている
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
}
```

良い例：

```typescript
// src/app/users/queries.ts

// ファイル内でのみ使用（exportしない）
function getToken(): string {
  return localStorage.getItem("token") || "";
}

// 他のファイルで使用される（exportする）
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
}

export async function getUser(id: number): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
}
```

### 2. 型も export の原則に従う

型定義も関数や定数と同様、他のファイルで使用されるもののみ export する。

悪い例：

```typescript
// src/app/users/types.ts

// 使われていない型をexport
export type InternalError = {
  code: string;
  message: string;
};

// 将来使うかもしれないという理由でexport
export type UserStatistics = {
  totalLogins: number;
  lastLoginAt: Date;
};

// 実際に他のファイルで使われる型
export type User = {
  id: number;
  name: string;
  email: string;
};
```

良い例：

```typescript
// src/app/users/types.ts

// ファイル内でのみ使用（exportしない）
type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

// 他のファイルで使用される（exportする）
export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type UserRole = "admin" | "user" | "guest";

export type UserListProps = {
  users: User[];
  onUserClick: (id: number) => void;
};

// 内部で使用
function validateUser(user: User): ValidationResult {
  // バリデーションロジック
}
```

## スコープのルール

### 1. ファイルスコープのグローバル変数は避ける

ファイルスコープで可変な変数（let, var）を定義しない。

悪い例：

```typescript
// src/app/data-import/components/DataImportForm.tsx

// ファイルスコープでグローバル変数
let isProcessing = false;
let currentFile: File | null = null;

const DataImportForm = () => {
  const handleSubmit = () => {
    isProcessing = true; // 外部から変更
    // 処理
  };

  return <button onClick={handleSubmit}>Submit</button>;
};
```

良い例（ローカルな状態の場合）：

```typescript
// src/app/data-import/components/DataImportForm.tsx

// コンポーネント内のstate
const DataImportForm = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleSubmit = () => {
    setIsProcessing(true);
    // 処理
  };

  return <button onClick={handleSubmit}>Submit</button>;
};
```

良い例（アプリ全体で共有する場合）：

```typescript
// src/shared/constants/config.ts
export const APP_CONFIG = {
  DEBUG_MODE: process.env.NODE_ENV === "development",
  API_TIMEOUT: 30000,
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024,
} as const;

// または
// src/shared/context/AppContext.tsx
import { createContext, useContext, useState } from "react";

type AppContextType = {
  debugMode: boolean;
  setDebugMode: (mode: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [debugMode, setDebugMode] = useState(false);

  return (
    <AppContext.Provider value={{ debugMode, setDebugMode }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
```

### 2. 定数は適切なスコープで定義する

定数（const）は使用範囲に応じて適切なスコープで定義する。

- ファイル内のみ: ファイル内に定義（export しない）
- 機能内の複数ファイル: 機能ディレクトリの constants.ts に export
- プロジェクト全体: src/shared/constants/ に export

詳細は [Next.js アーキテクチャ](nextjs-architecture.md) の配置判断フローを参照。

悪い例：

```typescript
// src/app/data-import/components/DataImportForm.tsx

// このコンポーネントでしか使わない定数を大量に定義
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".csv", ".xlsx"];
const ERROR_MESSAGES = {
  FILE_TOO_LARGE: "ファイルサイズが大きすぎます",
  INVALID_EXTENSION: "無効なファイル形式です",
};

const DataImportForm = () => {
  // コンポーネントロジック
};
```

良い例：

```typescript
// ケース1: ファイル内のみで使用
// src/app/data-import/queries.ts

// このファイル内でのみ使用（exportしない）
const API_ENDPOINT = "/api/v1/data_import/";
const REQUEST_TIMEOUT = 30000;

export async function importData(data: ImportData): Promise<void> {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });
  // 処理
}

// ケース2: 機能内の複数ファイルで使用
// src/app/data-import/constants.ts

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_EXTENSIONS = [".csv", ".xlsx"];
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: "ファイルサイズが大きすぎます",
  INVALID_EXTENSION: "無効なファイル形式です",
} as const;

export const EXPECTED_COLUMNS = [
  "user_first_name",
  "user_last_name",
  "email",
];

// src/app/data-import/components/DataImportForm.tsx
import { MAX_FILE_SIZE, ALLOWED_EXTENSIONS, ERROR_MESSAGES } from "../constants";

const DataImportForm = () => {
  // コンポーネントロジック
};

// ケース3: プロジェクト全体で使用
// src/shared/constants/config.ts

export const APP_CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  API_TIMEOUT: 30000,
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
} as const;

// 複数の機能から使用
// src/app/users/queries.ts
import { APP_CONFIG, HTTP_STATUS } from "@/shared/constants/config";

// src/app/products/queries.ts
import { APP_CONFIG, HTTP_STATUS } from "@/shared/constants/config";
```
