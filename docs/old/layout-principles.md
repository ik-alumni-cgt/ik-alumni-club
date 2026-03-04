# レイアウトの原理原則

## 概要

アプリケーションの多くの画面でヘッダーやフッター、サイドバーは共通となります。それらの部分をレイアウトとして実装することで画面をまたいでキープされるため、快適な画面遷移が実現し、コード管理も楽になります。

## 実装

多くの人がチュートリアルに従って `/app/layout.tsx` にヘッダーやフッターを設置しますが、そうすると「この画面はヘッダーを表示したくない、あるいは変えたい」といったケースに対応できなくなります。そこで[ルートグループ](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)の機能を使ってレイアウトを分けて管理します。

たとえば以下のようになります。 `()` の部分がルートグループのディレクトリになっています。名前は `main` などになってますが、なんでも良いです。

- `/app/layout.tsx`
    - アプリ全体で共有するプロバイダーやメタデータを管理
- `/app/(main)/layout.tsx`
    - 主にアプリ内で使用する、ヘッダーとフッターつきのレイアウト
- `/app/(marketing)/layout.tsx`
    - LPや利用規約などアプリの外で使うヘッダーとフッターつきレイアウト

ルートグループ内に設置した画面には同グループのレイアウトが適用されます。最終的に、以下のようなツリーになります。

```bash
/app
├── layout.tsx                      # ほぼ何もないレイアウト
├── (main)/
│   ├── layout.tsx                  # ヘッダーフッター付きレイアウト
│   ├── dashboard/page.tsx          # ダッシュボード
│   └── settings/
│       ├── layout.tsx              # 設定画面のサイドバーレイアウト
│       ├── page.tsx                # 設定画面トップ
│       ├── billing/layout.tsx      # 請求画面
│       └── profile/page.tsx        # プロフィール
├── (marketing)/
│   ├── layout.tsx                  # LP用ヘッダーフッター付きレイアウト
│   ├── page.tsx                    # LP
│   ├── terms/page.tsx              # 利用規約
│   └── company/page.tsx            # 会社概要
├── admin/
│   ├── layout.tsx                  # ヘッダーフッター付きレイアウト
│   ├── dashboard/page.tsx          # ダッシュボード
│   └── settings/page.tsx           # 設定
└── maintenance/
    └── page.tsx                    # メンテナンスページ
```

なお、ルートグループを使うのは**パスが競合する時**なので、URLで `/admin` や `/settings` 画面配下はこのレイアウトを使いたい、という場合 `/admin/layout.tsx` を設置すれば良いので `(admin)` とする必要はないです。

上のツリーの場合マーケティングページやメインページに対し、URL上親となるパスがないのでレイアウトグループを使っています。つまりレイアウトグループは最終的な URL には反映されないので、 `(marketing)/company` というURLではなく `/company` でアクセスする形になります。

## このプロジェクトでの推奨構成

このプロジェクトは国際化対応(i18n)を行っているため、`[locale]` ディレクトリ配下で以下のようなレイアウト構成を推奨します:

```bash
/app/[locale]
├── layout.tsx                      # 全体のプロバイダー、フォント、メタデータ管理
├── (main)/
│   ├── layout.tsx                  # ヘッダーフッター付きレイアウト
│   ├── page.tsx                    # トップページ
│   ├── information/page.tsx        # お知らせ一覧
│   ├── pets/
│   │   ├── page.tsx                # ペット一覧
│   │   └── [id]/page.tsx           # ペット詳細
│   ├── mypage/page.tsx             # マイページ
│   └── new/page.tsx                # 新規登録完了
├── (auth)/
│   ├── layout.tsx                  # 認証画面用レイアウト(ヘッダーフッターなし)
│   ├── login/page.tsx              # ログイン
│   └── signup/page.tsx             # 新規登録
├── (marketing)/
│   ├── layout.tsx                  # LP用ヘッダーフッター付きレイアウト
│   └── supporters/page.tsx         # サポーター募集
└── admin/
    ├── layout.tsx                  # 管理画面用サイドバーレイアウト
    ├── login/page.tsx              # 管理者ログイン
    ├── dashboard/page.tsx          # ダッシュボード
    ├── informations/               # お知らせ管理
    ├── schedules/                  # スケジュール管理
    ├── videos/                     # 動画管理
    ├── blogs/                      # ブログ管理
    └── newsletters/                # 会報管理
```

### 各レイアウトの役割

#### `/app/[locale]/layout.tsx`
- アプリ全体で共有する設定を管理
- プロバイダー(NextIntlClientProvider, NuqsAdapter)
- フォント設定(Geist, Senobi Gothic, Academy)
- メタデータ設定
- **条件分岐でヘッダーフッターを表示/非表示にする現在の実装は推奨しない**

#### `/app/[locale]/(main)/layout.tsx`
- 一般ユーザー向けページのレイアウト
- ヘッダーとフッターを含む
- ログイン済み/未ログインで表示内容を切り替え可能

#### `/app/[locale]/(auth)/layout.tsx`
- 認証関連ページのレイアウト
- ヘッダーフッターなし、中央配置のフォームなど

#### `/app/[locale]/(marketing)/layout.tsx`
- マーケティング・LP用レイアウト
- LP用の特別なヘッダーフッターデザイン
- サポーター募集ページなど

#### `/app/[locale]/admin/layout.tsx`
- 管理画面用レイアウト
- サイドバーナビゲーション
- 管理者権限チェック
- ヘッダーフッターなし

## ベストプラクティス

### ✅ 推奨する実装

1. **ルートグループを活用する**
   ```tsx
   // app/[locale]/(main)/layout.tsx
   export default function MainLayout({ children }: { children: React.ReactNode }) {
     return (
       <>
         <Header />
         {children}
         <Footer />
       </>
     );
   }
   ```

2. **ルートレイアウトはシンプルに保つ**
   ```tsx
   // app/[locale]/layout.tsx
   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang={locale}>
         <body>
           <Providers>
             {children}
           </Providers>
         </body>
       </html>
     );
   }
   ```

### ❌ 避けるべき実装

1. **ルートレイアウトでの条件分岐**
   ```tsx
   // ❌ 良くない例
   export default function RootLayout({ children }: { children: React.ReactNode }) {
     const pathname = usePathname();
     const isAdminPage = pathname.includes('/admin');

     return (
       <html>
         <body>
           {!isAdminPage && <Header />}
           {children}
           {!isAdminPage && <Footer />}
         </body>
       </html>
     );
   }
   ```

2. **レイアウトが必要ない場面でルートグループを使う**
   ```tsx
   // ❌ 不要な例
   // /admin はURLパスに含まれるのでルートグループは不要
   app/[locale]/(admin)/layout.tsx

   // ✅ 正しい例
   app/[locale]/admin/layout.tsx
   ```

## マイグレーション手順

現在の実装から推奨構成に移行する場合:

1. ルートグループディレクトリを作成
   ```bash
   mkdir -p app/[locale]/(main)
   mkdir -p app/[locale]/(auth)
   mkdir -p app/[locale]/(marketing)
   ```

2. 各ルートグループにレイアウトファイルを作成

3. 既存のページファイルを適切なルートグループに移動

4. `app/[locale]/layout.tsx` から条件分岐を削除し、プロバイダーのみに

5. 動作確認とテスト

## 参考資料

- [Next.js Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates)
