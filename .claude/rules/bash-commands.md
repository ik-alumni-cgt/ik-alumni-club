# Bash コマンドのルール

## パイプの使用禁止

Bash コマンドでパイプ（`|`）を直接使用しないこと。

理由: Claude Code の権限システム（`ask`設定）とパイプを組み合わせると、環境変数が失われる問題がある。

### 悪い例

```bash
curl -s -u "user:password" "https://api.example.com/data" | jq '.field'
```

### 良い例

```bash
RESPONSE=$(curl -s -u "user:password" "https://api.example.com/data")
echo "$RESPONSE" | jq '.field'
```

または

```bash
curl -s -u "user:password" "https://api.example.com/data" > /tmp/response.json
jq '.field' /tmp/response.json
```

## 適用範囲

- SKILL.md 内のコード例
- 実際の実装コード
- ドキュメント内のサンプルコード
