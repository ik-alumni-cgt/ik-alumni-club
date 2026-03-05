# アクセス制御・コンテンツ公開設計

## 概要

本ドキュメントでは、ユーザーの認証状態と会員ステータスに基づくコンテンツのアクセス制御とリダイレクト設計を定義する。

---

## ユーザー区分

| 区分 | 説明 |
|------|------|
| 未ログインユーザー | 認証していないゲストユーザー |
| ログイン済み会員 | 認証済みかつ会員登録完了済みユーザー |
| 管理者 | `role === 'admin'` のユーザー |

---

## コンテンツ公開区分

### 1. 全ユーザー閲覧可能（パブリック）

認証不要で誰でも閲覧できるコンテンツ

| ページ | URL | 説明 |
|--------|-----|------|
| Home | `/` | ランディングページ |
| INFO（お知らせ）一覧 | `/informations` | 公開情報 + 会員向け情報のタイトル表示 |
| INFO 詳細 | `/informations/[id]` | 公開情報は全文表示、会員限定は要認証 |
| スケジュール一覧 | `/events` | 公開イベント + 会員向けイベントのタイトル表示 |
| スケジュール詳細 | `/events/[id]` | 公開イベントは全文表示、会員限定は要認証 |
| 通常ブログ一覧 | `/blog` | 公開記事の一覧表示 |
| 通常ブログ詳細 | `/blog/[id]` | 公開記事の閲覧 |
| VIDEO（一般公開）一覧 | `/videos` | ショート動画・一般公開ビデオ |
| VIDEO 詳細 | `/videos/[id]` | 動画再生ページ |
| プロフィール（新規） | `/profiles` | メンバープロフィール一覧（新規作成） |
| プロフィール詳細 | `/profiles/[id]` | 個人プロフィールページ（新規作成） |
| お問い合わせ | `/contact` | 問い合わせフォーム |

---

### 2. 会員限定コンテンツ

ログイン済み会員のみ閲覧可能

| ページ | URL | 説明 |
|--------|-----|------|
| 会報一覧 | `/newsletters` | 会報の一覧表示 |
| 会報詳細 | `/newsletters/[id]` | 会報の閲覧 |
| 限定ブログ一覧 | `/blog?type=members` | 会員限定記事の一覧 |
| 限定ブログ詳細 | `/blog/[id]` | 会員限定記事の閲覧 |
| 限定VIDEO一覧 | `/videos?type=members` | イベント・発表会の動画 |
| 限定VIDEO詳細 | `/videos/[id]` | 限定動画の再生 |
| フォトライブラリー一覧 | `/photos` | 会員限定フォトギャラリー（新規作成） |
| フォトライブラリー詳細 | `/photos/[id]` | 写真閲覧ページ（新規作成） |

---

## INFO・スケジュールの特殊な表示ルール

INFO（お知らせ）とスケジュールは、**公開情報と会員限定情報が同一ページに混在して表示される**特殊なケース。

### 表示ルール

```
┌─────────────────────────────────────────────────────────┐
│ INFO / スケジュール一覧ページ                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📢 公開のお知らせ                                        │
│  └→ タイトル、日付、サムネイル表示                        │
│  └→ クリックで詳細ページへ（誰でも閲覧可能）              │
│                                                         │
│  🔒 会員向けお知らせ                                      │
│  └→ タイトル、日付のみ表示（サムネイルは表示可）          │
│  └→ 「会員限定」バッジを表示                              │
│  └→ クリックで詳細ページへ                                │
│      └→ 未ログイン: ログイン画面へリダイレクト            │
│      └→ ログイン済み会員: 詳細内容を表示                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### データ構造（提案）

各コンテンツに `visibility` フィールドを追加

```typescript
type ContentVisibility = 'public' | 'members_only';

interface Information {
  id: string;
  title: string;
  content: string;
  visibility: ContentVisibility;  // 公開範囲
  // ...
}

interface Event {
  id: string;
  title: string;
  description: string;
  visibility: ContentVisibility;  // 公開範囲
  // ...
}
```

---

## リダイレクト設計

### アクセス制御フロー

```
ユーザーがページにアクセス
    │
    ├─ パブリックページ
    │   └→ そのまま表示
    │
    ├─ 会員限定ページ（/newsletters, 限定blog, 限定video, /photos）
    │   │
    │   ├─ 未ログイン
    │   │   └→ /login へリダイレクト
    │   │      └→ returnUrl パラメータで元のURLを保持
    │   │
    │   └─ ログイン済み会員
    │       └→ コンテンツを表示
    │
    └─ 混在ページの会員限定コンテンツ（INFO, スケジュールの詳細）
        │
        ├─ visibility: 'public'
        │   └→ そのまま表示
        │
        └─ visibility: 'members_only'
            │
            ├─ 未ログイン
            │   └→ /login へリダイレクト
            │      └→ returnUrl パラメータで元のURLを保持
            │
            └─ ログイン済み会員
                └→ コンテンツを表示
```

### リダイレクト先一覧

| 状態 | アクセス先 | リダイレクト先 |
|------|-----------|---------------|
| 未ログイン | 会員限定ページ | `/login?returnUrl={元のURL}` |
| ログイン成功後 | - | `returnUrl` または `/` |
| 未ログイン | 会員限定INFO/スケジュール詳細 | `/login?returnUrl={元のURL}` |

---

## ページ別アクセス権マトリクス

| ページ | 未ログイン | 会員 | 管理者 |
|--------|-----------|------|--------|
| Home `/` | ✅ | ✅ | ✅ |
| INFO一覧 `/informations` | ✅（公開+限定タイトル） | ✅（全て） | ✅ |
| INFO詳細（公開） | ✅ | ✅ | ✅ |
| INFO詳細（限定） | ❌→ログイン | ✅ | ✅ |
| スケジュール一覧 `/events` | ✅（公開+限定タイトル） | ✅（全て） | ✅ |
| スケジュール詳細（公開） | ✅ | ✅ | ✅ |
| スケジュール詳細（限定） | ❌→ログイン | ✅ | ✅ |
| 通常ブログ `/blog` | ✅ | ✅ | ✅ |
| VIDEO（一般） `/videos` | ✅ | ✅ | ✅ |
| プロフィール `/profiles` | ✅ | ✅ | ✅ |
| 会報 `/newsletters` | ❌→ログイン | ✅ | ✅ |
| 限定ブログ | ❌→ログイン | ✅ | ✅ |
| 限定VIDEO | ❌→ログイン | ✅ | ✅ |
| フォトライブラリー `/photos` | ❌→ログイン | ✅ | ✅ |

---

## 実装上の注意点

### 1. 一覧ページでの表示制御

```typescript
// 一覧ページでの表示例
const visibleItems = items.map(item => ({
  ...item,
  // 未ログインの場合、会員限定コンテンツは限定的な情報のみ表示
  showFullPreview: item.visibility === 'public' || isAuthenticated,
  showMemberBadge: item.visibility === 'members_only'
}));
```

### 2. 詳細ページでのアクセス制御

```typescript
// 詳細ページでのアクセス制御例
if (content.visibility === 'members_only' && !isAuthenticated) {
  redirect(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
}
```

### 3. コンポーネントでのバッジ表示

会員限定コンテンツには視覚的なバッジを表示して、ユーザーに明示する。

---

## 現在の実装状況

### 実装済み機能

| 機能 | 状態 | 詳細 |
|------|------|------|
| `isMemberOnly` フィールド | ✅ | 全コンテンツ（informations, schedules, videos, blogs, newsletters）に実装済み |
| セッション認証 | ✅ | ミドルウェア + ページレベルで実装 |
| データフィルタリング | ✅ | データ層で会員ステータスに応じた自動フィルタリング |
| 動画の会員限定バッジ | ✅ | `/video` 一覧で表示 |
| ブログの会員限定バッジ | ✅ | `/blog` 一覧で表示 |
| 会員専用画面 | ✅ | `MemberOnlyContent` コンポーネント |
| プラン階層制御 | ✅ | `canAccessContent()` 関数 |
| 管理者権限制御 | ✅ | `verifyAdmin()` 関数 |

### 未実装・改善が必要な機能

| 機能 | 状態 | 備考 |
|------|------|------|
| 一覧での会員限定コンテンツ表示 | ❌ | 現状は非会員に一覧表示されない（要件: タイトルは表示したい） |
| returnUrl パラメータ | ❌ | ログイン後は常に `/mypage` に固定リダイレクト |
| INFO一覧の会員限定バッジ | ❌ | 動画・ブログとの表示が不統一 |
| スケジュール一覧の会員限定バッジ | ❌ | 動画・ブログとの表示が不統一 |
| INFO詳細の会員限定チェック | ❌ | 詳細ページでのアクセス制御が未実装 |
| スケジュール詳細の会員限定チェック | ❌ | 詳細ページでのアクセス制御が未実装 |
| `/profiles` ページ | ❌ | 存在しない |
| `/photos` ページ | ❌ | 存在しない |
| 管理画面の `isMemberOnly` 設定 | ❌ | フォームスキーマに含まれていない可能性 |
| ヘッダーナビの下部リンク | ❌ | VIDEO等のリンクが `href="#"` で未設定 |

---

## 実装タスク一覧

### 優先度: 高（コア機能）

#### タスク1: 一覧ページで会員限定コンテンツも表示するように変更

**目的**: 非会員にも会員限定コンテンツのタイトル・サムネイルを一覧で表示し、詳細ページでアクセス制御する

**現状の問題**:
現在のデータ取得関数では、非会員には `isMemberOnly: true` のコンテンツが一覧に表示されない。

```typescript
// 現状: 非会員には会員限定コンテンツが除外される
isMember ? undefined : eq(informations.isMemberOnly, false)
```

**対象ファイル**:
| ファイル | 関数 |
|----------|------|
| `data/information.ts` | `getInformations()` |
| `data/schedule.ts` | `getSchedules()`, `getUpcomingSchedules()` |
| `data/video.ts` | `getVideos()`, `getRecentVideos()` |
| `data/blog.ts` | `getPublishedBlogs()`, `getRecentBlogs()` |

**実装内容**:
```typescript
// 変更後: 全コンテンツを取得（一覧表示用）
// isMemberOnly のフィルタを削除
export const getInformations = async () => {
  return db.query.informations.findMany({
    where: eq(informations.published, true),  // isMemberOnly フィルタを削除
    orderBy: [desc(informations.date)],
  });
};
```

**対象コンテンツと対応**:
| コンテンツ | 一覧表示 | 詳細アクセス制御 | バッジ |
|-----------|---------|-----------------|-------|
| INFO | 全件表示に変更 | 追加必要（タスク4） | 追加必要（タスク2） |
| スケジュール | 全件表示に変更 | 追加必要（タスク5） | 追加必要（タスク3） |
| 動画 | 全件表示に変更 | 実装済み | 実装済み |
| ブログ | 全件表示に変更 | 実装済み | 実装済み |
| ニュースレター | 現状維持（会員限定ページ） | - | - |

**工数目安**: 小

---

#### タスク2: INFO一覧に会員限定バッジを追加

**目的**: 会員限定のお知らせにバッジを表示し、動画・ブログと統一

**対象ファイル**:
- `components/information/list.tsx`

**実装内容**:
```typescript
{item.isMemberOnly && (
  <div className="absolute top-2 right-2 bg-amber-500/90 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
    <Lock className="h-3 w-3" />
    会員限定
  </div>
)}
```

**工数目安**: 小

---

#### タスク3: スケジュール一覧に会員限定バッジを追加

**目的**: 会員限定のスケジュールにバッジを表示し、動画・ブログと統一

**対象ファイル**:
- `components/schedule/list.tsx`

**実装内容**: INFO一覧と同様

**工数目安**: 小

---

#### タスク4: INFO詳細ページの会員限定アクセス制御

**目的**: 会員限定のINFOは未ログインユーザーがアクセスできないようにする

**対象ファイル**:
- `app/[locale]/(main)/information/[id]/page.tsx`

**実装内容**:
```typescript
if (item.isMemberOnly) {
  const isMember = await canAccessMemberContent();
  if (!isMember) {
    return <MemberOnlyContent contentType="お知らせ" />;
  }
}
```

**工数目安**: 小

---

#### タスク5: スケジュール詳細ページの会員限定アクセス制御

**目的**: 会員限定のスケジュールは未ログインユーザーがアクセスできないようにする

**対象ファイル**:
- `app/[locale]/(main)/schedule/[id]/page.tsx`

**実装内容**: INFO詳細と同様

**工数目安**: 小

---

#### タスク6: returnUrl パラメータの実装

**目的**: ログイン前にアクセスしようとしたページに、ログイン後に戻れるようにする

**対象ファイル**:
- `middleware.ts` - リダイレクト時に `returnUrl` を付与
- `components/login-form/login-form.tsx` - ログイン成功後に `returnUrl` を参照

**実装内容**:
```typescript
// middleware.ts
const url = new URL('/login', request.url);
url.searchParams.set('returnUrl', request.nextUrl.pathname);
return NextResponse.redirect(url);

// login-form.tsx
const searchParams = useSearchParams();
const returnUrl = searchParams.get('returnUrl');
router.push(returnUrl || '/mypage');
```

**工数目安**: 小

---

### 優先度: 中（機能拡張）

#### タスク7: 管理画面に `isMemberOnly` 設定を追加

**目的**: 管理者がコンテンツ作成・編集時に会員限定を設定できるようにする

**対象ファイル**:
- `zod/information.ts` - スキーマに `isMemberOnly` を追加
- `zod/schedule.ts` - スキーマに `isMemberOnly` を追加
- `app/(dashboard)/admin/informations/new/page.tsx` - フォームにチェックボックス追加
- `app/(dashboard)/admin/informations/[id]/edit/page.tsx` - フォームにチェックボックス追加
- `app/(dashboard)/admin/schedules/new/page.tsx` - フォームにチェックボックス追加
- `app/(dashboard)/admin/schedules/[id]/edit/page.tsx` - フォームにチェックボックス追加

**工数目安**: 中

---

#### タスク8: ヘッダーナビゲーションのリンク修正

**目的**: ハンバーガーメニュー下部のリンク先を正しく設定

**対象ファイル**:
- `components/header/hamburger-menu-content.tsx`

**修正内容**:
| 項目 | 現在 | 修正後 |
|------|------|--------|
| VIDEO | `#` | `/video` |
| NEWS LETTER | `#` | `/newsletter` |
| PHOTO LIBRARY | `#` | `/photos`（新規作成後） |
| EXCLUSIVE BLOG | `#` | `/blog?type=members` |

**工数目安**: 小

---

### 優先度: 低（新規ページ作成）

#### タスク9: プロフィール一覧ページの作成

**目的**: メンバーのプロフィール一覧を表示

**新規ファイル**:
- `app/[locale]/(main)/profiles/page.tsx`
- `components/profiles/list.tsx`

**工数目安**: 中

---

#### タスク10: プロフィール詳細ページの作成

**目的**: 個人のプロフィール詳細を表示

**新規ファイル**:
- `app/[locale]/(main)/profiles/[id]/page.tsx`
- `components/profiles/detail.tsx`

**工数目安**: 中

---

#### タスク11: フォトライブラリー機能の作成

**目的**: 会員限定のフォトギャラリーを提供

**新規ファイル**:
- `db/schemas/photos.ts` - データベーススキーマ
- `app/[locale]/(main)/photos/page.tsx` - 一覧ページ
- `app/[locale]/(main)/photos/[id]/page.tsx` - 詳細ページ
- `components/photos/list.tsx`
- `components/photos/detail.tsx`
- `app/(dashboard)/admin/photos/page.tsx` - 管理一覧
- `app/(dashboard)/admin/photos/new/page.tsx` - 新規作成
- `app/(dashboard)/admin/photos/[id]/edit/page.tsx` - 編集
- `data/photos.ts` - データアクセス関数
- `zod/photos.ts` - バリデーションスキーマ

**工数目安**: 大

---

## タスクサマリー

| 優先度 | タスク | 工数 |
|--------|--------|------|
| **高** | 1. 一覧で会員限定コンテンツも表示 | 小 |
| **高** | 2. INFO一覧に会員限定バッジ追加 | 小 |
| **高** | 3. スケジュール一覧に会員限定バッジ追加 | 小 |
| **高** | 4. INFO詳細の会員限定アクセス制御 | 小 |
| **高** | 5. スケジュール詳細の会員限定アクセス制御 | 小 |
| **高** | 6. returnUrl パラメータの実装 | 小 |
| **中** | 7. 管理画面に `isMemberOnly` 設定追加 | 中 |
| **中** | 8. ヘッダーナビのリンク修正 | 小 |
| **低** | 9. プロフィール一覧ページ作成 | 中 |
| **低** | 10. プロフィール詳細ページ作成 | 中 |
| **低** | 11. フォトライブラリー機能作成 | 大 |

**合計: 11タスク**

---

### 推奨実装順序

```
1. 一覧で会員限定コンテンツを表示（タスク1）
   └→ データ取得関数から isMemberOnly フィルタを削除
       ├── data/information.ts
       ├── data/schedule.ts
       ├── data/video.ts
       └── data/blog.ts

2. 会員限定バッジ追加（タスク2, 3）
   └→ INFO・スケジュール一覧にバッジを追加
       ├── components/information/list.tsx
       └── components/schedule/list.tsx

3. 詳細ページのアクセス制御（タスク4, 5）
   └→ INFO・スケジュール詳細に MemberOnlyContent を追加
       ├── app/[locale]/(main)/information/[id]/page.tsx
       └── app/[locale]/(main)/schedule/[id]/page.tsx

4. returnUrl パラメータ実装（タスク6）
   └→ ログイン後のリダイレクト改善
       ├── middleware.ts
       └── components/login-form/login-form.tsx

5. 管理画面の isMemberOnly 設定（タスク7）
   └→ コンテンツ作成・編集フォームに追加

6. ヘッダーナビのリンク修正（タスク8）
   └→ 未設定のリンクを修正

7. プロフィールページ作成（タスク9, 10）
   └→ 新規ページ実装

8. フォトライブラリー作成（タスク11）
   └→ DB〜管理画面まで一式実装
```

---

## 関連ドキュメント

- [URL設計](./url-design.md)
- [ページ構成一覧](./pages-overview.md)
- [データベース設計](./database-design-sql.md)

---

**最終更新**: 2025-12-08
