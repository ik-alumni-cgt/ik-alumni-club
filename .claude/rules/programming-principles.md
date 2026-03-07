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
// utils/dateFormatter.ts
export const formatDate = (date: Date) => {
  return date.toLocaleDateString("ja-JP");
};

// UserList.tsx
import { formatDate } from "@/utils/dateFormatter";

// ProductList.tsx
import { formatDate } from "@/utils/dateFormatter";
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
abstract class BaseRepository<T> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: number): Promise<T>;
  abstract create(data: T): Promise<T>;
  abstract update(id: number, data: T): Promise<T>;
  abstract delete(id: number): Promise<void>;
}

class UserRepository extends BaseRepository<User> {
  // 実際にはfindAllとfindByIdしか使っていない
}
```

良い例：

```typescript
// ✅ 実際に必要な機能のみ実装
export const userRepository = {
  async findAll(): Promise<User[]> {
    // 実装
  },

  async findById(id: number): Promise<User> {
    // 実装
  },
};

// 将来deleteが必要になったら、その時に追加
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
// ❌ 不要なレイヤー
interface IUserService {
  getUsers(): Promise<User[]>;
}

class UserService implements IUserService {
  constructor(private repository: IUserRepository) {}

  async getUsers(): Promise<User[]> {
    return this.repository.findAll();
  }
}

interface IUserRepository {
  findAll(): Promise<User[]>;
}

class UserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    // 実装
  }
}

// 使用側
const repository = new UserRepository();
const service = new UserService(repository);
const users = await service.getUsers();
```

良い例：

```typescript
// ✅ 必要なレイヤーのみ
export const userRepository = {
  async getUsers(): Promise<User[]> {
    // 実装
  },
};

// 使用側
const users = await userRepository.getUsers();
```

## SoC (Separation of Concerns)

関心事を分離する。異なる責務は異なる場所に配置する。

### 適用範囲

- ファイルレベル: 1 ファイル = 1 つの責務
- ディレクトリレベル: 役割ごとにディレクトリを分ける
- モジュールレベル: UI とビジネスロジックを分離

### 例

悪い例：

```typescript
// ❌ UI、ビジネスロジック、API通信が混在
const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    const response = await fetch("/api/users");
    const data = await response.json();

    // ビジネスロジック
    const activeUsers = data.filter((u) => u.isActive);
    const sortedUsers = activeUsers.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setUsers(sortedUsers);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {users.map((u) => (
        <div key={u.id}>{u.name}</div>
      ))}
    </div>
  );
};
```

良い例：

```typescript
// ✅ 関心事を分離

// queries.ts - データ取得
export async function getUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  return response.json();
}

// utils.ts - ビジネスロジック
export function filterAndSortUsers(users: User[]): User[] {
  return users
    .filter((u) => u.isActive)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// hooks/useUsers.ts - 状態管理
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getUsers()
      .then(filterAndSortUsers)
      .then(setUsers)
      .finally(() => setIsLoading(false));
  }, []);

  return { users, isLoading };
};

// components/UserPage.tsx - UI
const UserPage = () => {
  const { users, isLoading } = useUsers();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {users.map((u) => (
        <div key={u.id}>{u.name}</div>
      ))}
    </div>
  );
};
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
// ❌ 複数の責任を持つ関数
function handleUserSubmit(formData: FormData) {
  // バリデーション
  if (!formData.email.includes("@")) {
    throw new Error("Invalid email");
  }

  // データ変換
  const user = {
    name: formData.name.trim(),
    email: formData.email.toLowerCase(),
  };

  // API通信
  fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  });

  // UI更新
  toast.success("User created");
  router.push("/users");
}
```

良い例：

```typescript
// ✅ 責任を分離

// validators/userValidator.ts
export function validateUserEmail(email: string): void {
  if (!email.includes("@")) {
    throw new Error("Invalid email");
  }
}

// utils/userTransformer.ts
export function transformUserFormData(formData: FormData): User {
  return {
    name: formData.name.trim(),
    email: formData.email.toLowerCase(),
  };
}

// api/userApi.ts
export async function createUser(user: User): Promise<void> {
  await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

// hooks/useUserSubmit.ts
export const useUserSubmit = () => {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    validateUserEmail(formData.email);
    const user = transformUserFormData(formData);
    await createUser(user);
    toast.success("User created");
    router.push("/users");
  };

  return { handleSubmit };
};
```

### コンポーネントレベルでの SRP

悪い例：

```typescript
// ❌ データ取得とUIを両方担当
const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
};
```

良い例：

```typescript
// ✅ UIのみを担当
type Props = {
  users: User[];
};

const UserList = ({ users }: Props) => {
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
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
// ❌ anyを使用してエラーを遅延
function getUser(id: any): any {
  return fetch(`/api/users/${id}`).then((res) => res.json());
}

// 使用側でエラーが起きる
const user = await getUser("invalid");
console.log(user.name.toUpperCase()); // ランタイムエラー
```

良い例：

```typescript
// ✅ 型で早期にエラーを検出
function getUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`).then((res) => res.json());
}

// コンパイル時にエラー
const user = await getUser("invalid"); // Type error
```

### Zod でのバリデーション

```typescript
// ✅ スキーマで早期バリデーション
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  age: z.number().min(0).max(150),
});

export function createUser(data: unknown) {
  // 最初にバリデーション（失敗したら即エラー）
  const validated = userSchema.parse(data);

  // ここからは安全な型で作業
  return api.createUser(validated);
}
```
