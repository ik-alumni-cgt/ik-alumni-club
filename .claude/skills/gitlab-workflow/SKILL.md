# GitLab 連携ワークフロー

## リポジトリ情報

| リポジトリ | URL                                     | 開発ブランチ | 本番ブランチ |
| ---------- | --------------------------------------- | ------------ | ------------ |
| api        | https://git.mmhserver.com/payx/api      | develop      | develop2     |
| frontend   | https://git.mmhserver.com/payx/frontend | develop      | master       |

## 実装前フロー

JIRA チケットの整理完了後、実装開始前に以下を実施：

1. ブランチ作成

   - ブランチ名形式: `prefix/XXX-description`
     - `prefix`: 作業内容に応じて決定（`feature`, `bugfix`, `refactor` など）
     - `XXX`: JIRA チケット番号（数字のみ）
     - `description`: 簡潔な説明（kebab-case）
   - 例: `feature/126-add-failure-history`, `bugfix/127-fix-login-error`
   - 重要: ブランチ名をユーザーに提示し、承認を得てから作成

2. ブランチをプッシュ
   - `git push -u origin <branch-name>`
   - 空ブランチでもプッシュして、作業開始を明示
   - 重要: プッシュ前にユーザーに確認

## 実装中フロー

依存性の低い部分から順次実装し、都度コミット・プッシュする：

1. コミット作成

   - コミットメッセージ形式:

     ```
     prefix/number: 具体的な変更内容

     詳細な説明（必要に応じて）
     - 変更点1
     - 変更点2
     ```

   - `prefix`: 作業内容に応じて決定（`feat`, `fix`, `refactor` など）
   - `number`: JIRA チケット番号（数字のみ）
   - 概要は具体的な変更内容を 1 行で記述
   - 詳細な説明は必要に応じて追加（省略可）
   - 例:

     ```
     feat/126: Model層に失敗履歴チェック関数を追加

     - hasTypeScoutFailureHistory関数を実装
     - addTypeScoutFailureHistory関数を実装
     - 既存データとの後方互換性を保持
     ```

   - 重要: コミットメッセージをユーザーに提示し、承認を得てからコミット

2. プッシュ
   - 各コミット後に `git push` で都度プッシュ
   - レビュアーが進捗を追いやすくなる
   - 問題発生時のロールバックが容易
   - 重要: プッシュ前にユーザーに確認

## リリース MR 作成フロー

develop から本番ブランチ（api: develop2, frontend: master）へのリリース MR を作成する場合:

1. 対象コミットの特定

   - JIRA チケット番号でコミット履歴を検索: `git log develop --oneline --grep="VPAY-XXX"`
   - チケットのコメントに記載された MR リンクからも特定可能
   - frontend と api 両方で対象コミットがあるか確認する（片方のみの場合もある）

2. リリースブランチ作成

   - ブランチ名形式: `release/short-summary`
   - 複数チケットを含む場合は内容を要約した名前にする
   - 例: `release/erom-3ds-webhook-callback-fix`
   - 本番ブランチから作成: `git checkout develop2 && git checkout -b release/xxx`

3. cherry-pick

   - 対象コミットを古い順（時系列順）に cherry-pick
   - 複数チケットがある場合も、コミット日時の古い順に適用
   - 例: `git cherry-pick <older-commit> && git cherry-pick <newer-commit>`

4. MR 作成

   - タイトル形式: `release/short-summary`
   - 例: `release/erom-3ds-webhook-callback-fix`
   - アサイニー: `yuto.taniura`
   - 複数リポジトリで同じリリースを行う場合、同じブランチ名を使用

5. MR 説明形式

   ```
   ## 含まれるJIRAチケット

   ### [チケット番号]: [チケット名]
   - 概要: [概要説明]
   - コミット: [コミットハッシュ]
   - 変更ファイル: [ファイル数]
     - [ファイル名を箇条書き]
   ```

6. JIRA コメント
   - MR 作成後、対象の全チケットに「Stg 反映 MR を作成」と MR リンクをコメント

## GitLab API での MR 作成

GitLab API を使用して MR を作成する:

1. 認証トークンの取得

   - git remote URL から取得: `git remote -v`
   - URL 形式: `https://{username}:{token}@git.mmhserver.com/payx/api.git`

2. プロジェクト ID の確認

   | リポジトリ | プロジェクト ID |
   | ---------- | --------------- |
   | api        | 17              |
   | frontend   | 24              |

3. ユーザー ID の確認

   ```bash
   curl -s --header "PRIVATE-TOKEN: {token}" \
     "https://git.mmhserver.com/api/v4/users?username=yuto.taniura"
   ```

   - yuto.taniura のユーザー ID: 93

4. MR 作成 API

   ```bash
   curl -s --request POST \
     --header "PRIVATE-TOKEN: {token}" \
     --header "Content-Type: application/json" \
     --data '{
       "source_branch": "release/xxx",
       "target_branch": "develop2",
       "title": "release/xxx",
       "description": "...",
       "assignee_id": 93
     }' \
     "https://git.mmhserver.com/api/v4/projects/{project_id}/merge_requests"
   ```

## 注意事項

- git の書き込み操作（ブランチ作成、コミット、プッシュ、PR 作成）は必ずユーザーの承認を得てから実行する
  - 読み取り操作（`git status`, `git diff`, `git log` など）は承認不要
- PR 作成後、JIRA のステータス更新はユーザーが手動で行う
- コミットは小さく、頻繁に行うことを推奨
- 各コミットは独立してビルド可能な状態を保つことが理想
- 作業前に必ず正しいディレクトリにいることを確認する
  - api/ と frontend/ は別々の git リポジトリ
  - git コマンド実行前に pwd で現在位置を確認
  - 必要に応じて cd でディレクトリ移動
  - 例:
    - API の作業: `/Users/yuto_taniura/Projects/v-pay/api`
    - フロントエンドの作業: `/Users/yuto_taniura/Projects/v-pay/frontend`
