# adminロールの支払いスキップ仕様

## 概要

adminロールは運営側のシステムアカウントであり、支払い・プラン選択の対象外とする。
会員管理とシステムアカウント管理のUIを分離し、それぞれ適切な情報のみを表示・管理する。

## 背景

現在の実装では、adminもmemberも同じ会員一覧ページで管理されている。
adminは支払いやプランが不要であるにもかかわらず、会員と同じ項目が表示されており、管理上わかりにくい。

## 対象ロール

- admin のみをシステムアカウントとして分離
- officer/member は従来通り会員管理で扱う

## 方針

DBテーブル（`members`）は変更せず、管理画面のUIのみを分離する。
既存の権限チェック（`verifyAdmin()`等）は`members`テーブルの`role`を参照しており、変更不要。

## 仕様

### 1. 会員管理ページの変更

現在の`/admin/accounts`から、adminロールのアカウントを除外する。

- データ取得（`getAllAccounts`）でadminを除外するフィルタを追加
- 会員一覧にadminアカウントが表示されなくなる

### 2. システムアカウント管理ページの新設

`/admin/system-accounts`を新設し、adminロールのアカウントのみを管理する。

#### 一覧ページ

表示項目:
- 氏名
- メールアドレス
- ステータス
- ログイン設定
- 登録日
- 操作（詳細リンク）

表示しない項目（会員管理との差分）:
- プラン
- 支払いステータス
- 移行

#### 詳細ページ

表示するカード:
- 基本情報
- 認証情報
- 個人情報
- 会員情報（プラン・支払い管理を除く）

表示しないカード:
- 支払い管理（支払いステータス、サブスクリプションID、有効期間、リセットボタン）

### 3. adminロールのデータ

管理画面でロールを`admin`に変更して保存した際、以下のフィールドを`null`にリセットする。

| フィールド | 値 | 説明 |
|-----------|-----|------|
| `planId` | `null` | プラン不要 |
| `paymentStatus` | `null` | 支払い対象外 |
| `stripeSubscriptionId` | `null` | サブスクリプションなし |
| `subscriptionStartDate` | `null` | 有効期間なし |
| `subscriptionEndDate` | `null` | 有効期間なし |

### 4. サイドバー

「会員管理」グループに「システムアカウント」メニューを追加する。

```
会員管理
  - 会員管理        /admin/accounts
  - システムアカウント  /admin/system-accounts
```

### 5. adminからmemberへの変更

ロールを`admin`から`member`に変更した場合、クリア済みのフィールドは`null`のままとなる。
管理者が必要に応じてプラン設定・支払いリセット等の操作を行う。
変更後、そのアカウントは会員管理ページに表示される。

## 影響範囲の確認

`paymentStatus`と`planId`はアクセス制御に使用されていない。adminは`role`チェックで全コンテンツにアクセス可能なため、これらを`null`にしても閲覧には影響しない。

- `verifyAdmin()`: `member.role === "admin"` で判定
- `verifyActiveMember()`: `member.status === "active"` で判定
- `canAccessContent()`: adminは`role === "admin"`で即`return true`（planチェックに到達しない）

## 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `data/account.ts` | `getAllAccounts`にadmin除外フィルタ追加、admin一覧取得関数を追加 |
| `app/[locale]/admin/accounts/page.tsx` | admin除外済みデータを使用 |
| `app/[locale]/admin/system-accounts/page.tsx` | 新規: システムアカウント一覧ページ |
| `app/[locale]/admin/system-accounts/[id]/page.tsx` | 新規: システムアカウント詳細ページ（支払い管理カードなし） |
| `components/admin/system-accounts-table.tsx` | 新規: システムアカウント用テーブル（支払い・プラン列なし） |
| `actions/admin/accounts/update-account.ts` | ロールをadminに変更時、planId・支払い関連フィールドをnullにリセット |
| `components/admin-dashboard/admin-sidebar.tsx` | サイドバーに「システムアカウント」メニュー追加 |
