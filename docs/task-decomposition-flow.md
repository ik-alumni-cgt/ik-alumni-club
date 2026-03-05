# タスク分解フロー図

```mermaid
flowchart TD
    START([依頼が来る]) --> MEMO[元のタスク名をメモに記載]
    MEMO --> RENAME[タイトルを実行ベースに変更<br/>見るだけで何をするか判断できる形にする]
    RENAME --> JUDGE{コード修正が必要か?}
    JUDGE -->|必要| DEV_TYPE{タイトルから種別を判断}
    DEV_TYPE -->|新機能・ユーザー価値の追加| STORY[ストーリー]
    DEV_TYPE -->|不具合の修正| BUG[バグ]
    DEV_TYPE -->|リファクタリング・依存更新等の技術的作業| TASK[タスク]

    %% ストーリーフロー
    STORY --> S_DECOMPOSE[ストーリーを子タスクに分解する]
    S_DECOMPOSE --> S_TASKS[以下のタスクを作成する<br/>1. 要件定義書に機能要件を追記する<br/>2. 基本設計書にURL設計・画面構成を追記する<br/>3. 詳細設計書にDB設計・API設計・バリデーション設計を追記する<br/>4. DBスキーマを定義しマイグレーションを実行する<br/>5. Server Actions / データ取得関数を実装する<br/>6. UIコンポーネント・ページを実装する<br/>7. developにコミットしmainにマージする<br/>8. 本番環境で動作確認する]
    S_TASKS --> S_ESTIMATE[各子タスクにSPを見積もる<br/>フィボナッチ: 1, 2, 3, 5, 8, 13<br/>全体の合計SPも算出する]
    S_ESTIMATE --> S_REQ[要件をまとめる]
    S_REQ --> S_REQ_T1[要件定義書に機能要件を追記する<br/>docs/01_requirements-definition.md]
    S_REQ_T1 --> S_DESIGN[設計を行う]
    S_DESIGN --> S_DESIGN_T1[基本設計書にURL設計・画面構成を追記する<br/>docs/02_basic-design.md]
    S_DESIGN_T1 --> S_DESIGN_T2[詳細設計書にDB設計・API設計・<br/>バリデーション設計を追記する<br/>docs/03_detailed-design.md]
    S_DESIGN_T2 --> S_IMPL[実装を行う]
    S_IMPL --> S_IMPL_T1[DBスキーマを定義しマイグレーションを実行する<br/>db/schemas/ ・ db/migrations/]
    S_IMPL_T1 --> S_IMPL_T2[Server Actions / データ取得関数を実装する<br/>actions/ ・ data/]
    S_IMPL_T2 --> S_IMPL_T3[UIコンポーネント・ページを実装する<br/>components/ ・ app/]
    S_IMPL_T3 --> S_DEPLOY[developにコミットしmainにマージする]
    S_DEPLOY --> S_VERIFY[本番環境で動作確認する]
    S_VERIFY --> S_DONE([ストーリー完了])

    %% バグフロー
    BUG --> B_DECOMPOSE[バグを子タスクに分解する]
    B_DECOMPOSE --> B_TASKS[以下のタスクを作成する<br/>1. バグを再現させる<br/>2. 原因を調査・特定する<br/>3. 修正を実装する<br/>4. developにコミットしmainにマージする<br/>5. 本番環境で動作確認する]
    B_TASKS --> B_ESTIMATE[各子タスクにSPを見積もる<br/>フィボナッチ: 1, 2, 3, 5, 8, 13<br/>全体の合計SPも算出する]
    B_ESTIMATE --> B_REPRODUCE[バグを再現させる]
    B_REPRODUCE --> B_INVESTIGATE[原因を調査・特定する]
    B_INVESTIGATE --> B_FIX[修正を実装する]
    B_FIX --> B_DEPLOY[developにコミットしmainにマージする]
    B_DEPLOY --> B_VERIFY[本番環境で動作確認する]
    B_VERIFY --> B_DONE([バグ完了])

    %% タスクフロー
    TASK --> T_ESTIMATE[SPを見積もる<br/>フィボナッチ: 1, 2, 3, 5, 8, 13]
    T_ESTIMATE --> T_IMPL[実装する]
    T_IMPL --> T_DEPLOY[developにコミットしmainにマージする]
    T_DEPLOY --> T_VERIFY[本番環境で動作確認する]
    T_VERIFY --> T_DONE([タスク完了])

    JUDGE -->|不要| OPS[運用]
```

## Notion DBプロパティ

| # | プロパティ名 | 型 | 選択肢・備考 |
|---|---|---|---|
| 1 | ID | ID（自動採番） | プレフィックス例: TASK- |
| 2 | タイトル | タイトル | 実行ベースのタスク名 |
| 3 | 元のタスク名 | テキスト | 依頼時の元の名前をメモ |
| 4 | 種別 | セレクト | 開発 / 運用 |
| 5 | 開発種別 | セレクト | ストーリー / バグ / タスク |
| 6 | ステータス | ステータス | 依頼 / 起票済み / タスク洗い出し済み / 進行中 / 完了 |
| 7 | SP | 数値 | フィボナッチ: 1, 2, 3, 5, 8, 13 |
| 8 | 親タスク | リレーション | 自己参照（ストーリー/バグと子タスクの関係） |
| 9 | 合計SP | ロールアップ | 子タスクのSP合計を自動計算 |
| 10 | スプリント | リレーション | スプリントDBと紐付け |
| 11 | 期限 | 日付 | - |
| 12 | 作成日 | 作成日時 | 自動記録 |

## スプリントDB プロパティ

| # | プロパティ名 | 型 | 選択肢・備考 |
|---|---|---|---|
| 1 | ID | ID（自動採番） | プレフィックス例: SPRINT- |
| 2 | スプリント名 | タイトル | 例: Sprint 1 |
| 3 | 期間 | 日付 | 開始日〜終了日（1週間サイクル、月曜〜日曜） |
| 4 | ステータス | ステータス | 計画中 / 進行中 / 完了 |
| 5 | タスク | リレーション | タスクDBと紐付け |
| 6 | 合計SP | ロールアップ | 紐付タスクのSP合計 |
| 7 | 完了SP | ロールアップ | 完了タスクのSP合計 |
