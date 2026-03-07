# Next.js アーキテクチャ

本アーキテクチャは [プログラミング原則](programming-principles.md)（DRY, YAGNI, KISS, SoC, SRP, Fail Fast）に基づいています。

## 概要

- 既存構造（Pages Router）と新規構造（App Router 準備）の 2 つの構造が共存
- 新規構造は feature-based（機能単位）+ コロケーション
- 類似コードを発見したら統合を検討（共有化）
- 決済関連コードは慎重に扱う

## 配置と移行の判断フロー

### 基本ルール

触る部分は新構造へ、触らない部分はそのまま

### 判断フロー

1. コード変更の種類を判定
   - 新規機能: ステップ 2 へ
   - 既存機能の修正: ステップ 3 へ
   - 触らない部分: 既存構造のまま（終了）
2. 新規機能の配置判断
   1. 複数の機能で再利用されるか？
      - YES: 2.2 へ
      - NO: 2.3 へ
   2. shared に配置する場合（src/shared/）
      1. UI コンポーネントか？
         - YES: `components/`
         - NO: 次へ
      2. レイアウトコンポーネントか？
         - YES: `components/`
         - NO: 次へ
      3. React Context か？
         - YES: `context/`
         - NO: 次へ
      4. 型定義か？
         - YES: `types/`
         - NO: 次へ
      5. ユーティリティか？
         - YES: `lib/`
         - NO: 次へ
      6. 定数定義か？
         - YES: `constants/`
         - NO: 該当なし（2.3 feature で判断）
   3. feature に配置する場合（src/app/[feature]/）
      1. UI を描画するか？
         - YES: `components/`
         - NO: 次へ
      2. レイアウトコンポーネントか？
         - YES: `components/`
         - NO: 次へ
      3. 状態管理や副作用を扱うか？
         - YES: `hooks/`
         - NO: 次へ
      4. React Context か？
         - YES: `context.tsx`
         - NO: 次へ
      5. Server Actions（フォーム送信、データ操作）か？
         - YES: `actions.ts`
         - NO: 次へ
      6. データ取得（API 通信、DB クエリ）か？
         - YES: `queries.ts`
         - NO: 次へ
      7. バリデーションか？
         - YES: `schemas.ts`
         - NO: 次へ
      8. 型定義か？
         - YES: `types.ts`
         - NO: 次へ
      9. データ整形や計算処理か？
         - YES: `utils.ts`
         - NO: 次へ
      10. 定数定義か？
          - YES: `constants.ts`
          - NO: `page.tsx`
3. 既存機能の修正（移行）
   1. 決済関連コードか？
      - YES: 移行範囲を最小限に制限、影響範囲最小化、慎重にテスト: 3.2 へ
      - NO: 3.2 へ
   2. 類似コードの確認
      - 移行対象のコードと類似した実装が他に存在するか確認
        - 例：テーブルコンポーネント、フォーム、リストなど
      - 類似実装が存在する: 3.3 へ
      - 存在しない: ステップ 2 へ（新規機能と同じ配置判断）
   3. 統合可否の判断
      - 統合可能か検討（props で柔軟に対応できるか）
      - ユーザーに確認：「類似コードが見つかりました。統合しますか？」
      - YES: src/shared/へ統合
      - NO: ステップ 2 へ（機能専用として配置）

### 注意点

- 一度に全てを移行しない
- 移行後はテストを実施
- App Router 移行は別途計画

### 配置例

```
// 類似コード発見: 統合
components/UserTable.tsx
components/ProductTable.tsx
  : src/shared/components/DataTable.tsx（統合）

// 機能専用
components/UserProfile.tsx
  : src/app/users/components/UserProfile.tsx
```

## 既存構造と新規構造の対応

| 既存構造      | 新規構造（機能専用）             | 新規構造（共有）                 | 説明                                   |
| ------------- | -------------------------------- | -------------------------------- | -------------------------------------- |
| -             | `src/app/[feature]/actions.ts`   | -                                | 新規：Server Actions                   |
| `components/` | `src/app/[feature]/components/`  | `src/shared/components/`         | 機能専用か共有かで分ける               |
| `constants/`  | `src/app/[feature]/constants.ts` | `src/shared/constants/`          | 機能専用か共有かで分ける               |
| `context/`    | `src/app/[feature]/context.tsx`  | `src/shared/context/`            | 機能専用か共有かで分ける               |
| `hooks/`      | `src/app/[feature]/hooks/`       | -                                | 機能専用                               |
| `layouts/`    | `src/app/[feature]/components/`  | `src/shared/components/layouts/` | コンポーネントとして扱う               |
| `libs/`       | -                                | `src/shared/lib/`                | 共有ライブラリ                         |
| `pages/`      | `src/app/[feature]/page.tsx`     | -                                | App Router 移行後                      |
| -             | `src/app/[feature]/queries.ts`   | -                                | 新規：データ取得                       |
| -             | `src/app/[feature]/schemas.ts`   | -                                | 新規：バリデーション                   |
| `services/`   | `src/app/[feature]/queries.ts`   | -                                | queries.ts に統合                      |
| `styles/`     | -                                | `src/app/globals.css`            | Tailwind/shadcn 使用のため基本的に不要 |
| `validators/` | `src/app/[feature]/schemas.ts`   | -                                | schemas.ts に統合                      |
| `types/`      | `src/app/[feature]/types.ts`     | `src/shared/types/`              | 機能専用か共有かで分ける               |
| `utils/`      | `src/app/[feature]/utils.ts`     | `src/shared/lib/`                | 機能専用か共有かで分ける               |

## 新規構造（新規機能用 - App Router 準備）

新規機能はこの構造に従う。feature-based + コロケーション。

```
frontend/
├── src/                        # 新規追加
│   ├── app/                    # feature-based（機能単位）
│   │   ├── users/              # 機能ディレクトリ
│   │   │   ├── components/     # この機能専用のコンポーネント
│   │   │   ├── hooks/          # この機能専用のフック
│   │   │   ├── actions.ts      # Server Actions（App Router移行準備）
│   │   │   ├── queries.ts      # データ取得ロジック
│   │   │   ├── schemas.ts      # バリデーションスキーマ（Zodなど）
│   │   │   └── types.ts        # この機能専用の型
│   │   └── ...                 # その他の機能ディレクトリ
│   └── shared/                 # プロジェクト全体で共有
│       ├── components/         # 共有UIコンポーネント
│       │   └── ui/             # shadcn/uiなど
│       ├── lib/                # ユーティリティ関数
│       ├── types/              # グローバル型定義
│       └── constants/          # グローバル定数
├── pages/                      # 既存（変更しない）
├── components/                 # 既存（変更しない）
└── ...                         # その他既存ディレクトリ
```

## 既存構造（Pages Router - 参考）

現在のフラット構造。既存コードはこのまま維持。

```
frontend/
├── pages/              # Pages Router（既存）
├── components/         # UIコンポーネント（既存）
├── hooks/              # カスタムフック（既存）
├── utils/              # ユーティリティ（既存）
├── types/              # 型定義（既存）
├── constants/          # 定数（既存）
├── context/            # Context（既存）
├── layouts/            # レイアウト（既存）
└── libs/               # ライブラリ（既存）
```

## 関連ドキュメント

- [TypeScript Export のルール](typescript-exports.md) - export/スコープ/配置ルール
- [Next.js ディレクトリ詳細](nextjs-directories.md) - 各ディレクトリの詳細・悪い例/良い例
