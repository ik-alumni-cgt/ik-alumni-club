# JIRA 連携ワークフロー

## 基本フロー

1. JIRA URL が貼られたら自動的にチケットにアクセスする
2. チケット内容を要約して表示する
3. 作業タイプに応じた分析を行い、結果を表示する
4. JIRA 更新内容をユーザーに提案し、承認を得てから実行する
5. 必要に応じて実装を進める
6. 実装完了後、GitLab での作業を行う（ブランチ作成、コミット、プッシュ、PR 作成）

## 技術的な詳細

### URL パターン

- 形式: `https://virtuspayment.atlassian.net/browse/VPAY-XXX`

### REST API の使い方

単一チケットを取得する場合:

```bash
curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" \
  "https://virtuspayment.atlassian.net/rest/api/3/issue/VPAY-XXX"
```

JQL で検索する場合（複数チケット検索など）:

```bash
curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" \
  "https://virtuspayment.atlassian.net/rest/api/3/search/jql?jql=key=VPAY-XXX&fields=key,summary,status,description,issuetype,priority,comment,attachment"
```

注意: 古い `/rest/api/3/search?jql=...` エンドポイントは廃止されているため、必ず `/rest/api/3/search/jql` を使用すること。

### 認証情報

- 環境変数として設定（`.claude/settings.local.json` で定義）
  - `JIRA_EMAIL`: JIRA アカウントのメールアドレス
  - `JIRA_TOKEN`: JIRA API トークン
  - `JIRA_TOKEN_EXPIRES`: トークンの有効期限
- Basic 認証: `curl -u "$JIRA_EMAIL:$JIRA_TOKEN"`

### 認証確認手順

チケット取得前に、以下の手順で認証情報が正しく設定されているか確認する:

1. 環境変数の確認

```bash
echo "JIRA_EMAIL: $JIRA_EMAIL"
echo "JIRA_TOKEN: ${JIRA_TOKEN:0:20}..." # 最初の20文字のみ表示
echo "JIRA_TOKEN_EXPIRES: $JIRA_TOKEN_EXPIRES"
```

2. 認証テスト

```bash
RESPONSE=$(curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" \
  "https://virtuspayment.atlassian.net/rest/api/3/myself")
echo "$RESPONSE" | jq '.emailAddress'
```

- 成功: メールアドレスが返る
- 失敗: エラーメッセージが返る（401 Unauthorized など）

3. 問題がなければチケット取得へ進む

### 取得する情報

チケットから以下の情報を全て取得して総合的に判断する:

- タイトル（summary）
- 説明（description）
- 作業タイプ（issuetype）
- ステータス（status）
- 優先度（priority）
- コメント（comment）
- 添付ファイル（attachment）

## 作業タイプ別の対応

### ストーリー・タスク

チケット内容はざっくり起票されているため、以下を行う:

1. チケット内容の理解と要約

   - チケット内容を理解・要約
   - 非エンジニア（クライアント）でも理解できる表現で記載する
     - 技術用語を避け、ビジネス価値や機能の効果を中心に説明
     - 専門用語を使う場合は平易な言葉で補足
     - 「何ができるようになるか」「どう改善されるか」を明確に
   - BDD 的に Acceptance Criteria（受け入れ条件）を明確化
   - 「最終系」を定義
   - JIRA の説明を更新する内容をユーザーに提示
   - 承認後、説明を更新

2. 実装方針の決定

   - 実装方針をユーザーに提示
   - 承認を得る
   - 実装方針を JIRA にコメントとして追加
   - 実装を進める

3. 実装

   - 実装を進める

4. GitLab での作業
   - 実装完了後、GitLab での作業を行う

### バグ

チケット内容はざっくり起票されているため、以下の順で進める:

1. 内容の理解と要約

   - バグの内容を理解・要約
   - 非エンジニア（クライアント）でも理解できる表現で記載する
     - 技術用語を避け、「どんな問題が起きているか」「どう影響するか」を明確に
     - 専門用語を使う場合は平易な言葉で補足
   - JIRA の説明を更新する内容をユーザーに提示
   - 承認後、説明を更新

2. 仮説立て

   - 関連するコードを特定
   - 原因の仮説を立てる
   - 仮説をコメントとして追加する内容をユーザーに提示
   - 承認後、JIRA にコメント追加

3. 原因調査

   - 立てた仮説をもとに原因調査を実施
   - 調査結果をコメントとして追加する内容をユーザーに提示
   - 承認後、JIRA にコメント追加

4. 修正実装

   - 修正方針を提示
   - 承認後、実装を進める

5. GitLab での作業
   - 実装完了後、GitLab での作業を行う

## 注意事項

- ステータス変更は手動で行うため、自動変更しない
- JIRA 更新（説明の編集、コメント追加）は必ずユーザーの承認を得てから実行する
- curl コマンドを使用して REST API 経由でアクセスする
- ドキュメント出力時は `docs/VPAY-XXX/` ディレクトリを作成し、そこに出力する
  - `XXX` は JIRA チケット番号
  - 例: `docs/VPAY-126/`, `docs/VPAY-127/`
  - チケットに関連する全ての分析結果、調査結果、実装方針などのドキュメントをこのディレクトリに保存
