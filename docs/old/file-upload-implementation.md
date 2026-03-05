# ファイルアップロード実装ドキュメント

## 概要

このプロジェクトでは、画像アップロードにCloudflare R2を使用し、クライアントサイドで画像の加工（トリミング、圧縮、リサイズ）を行うことでサーバーサイドの負荷を軽減します。

---

## 1. クライアントサイドでの画像加工

### 目的
- サーバーサイドの負荷軽減
- トリミング、圧縮、リサイズをクライアントで実行
- 拡張子の統一

### 推奨ツール
**input-image** - shadcn/ui と React Hook Form フレンドリーなクロッパー付き画像セレクタ

- ドキュメント: https://registry.dninomiya.com/input-image
- 用途: アバターのトリミング

---

## 2. Cloudflare R2のセットアップ

### 選定理由
- 最も安価な画像ホスティングサービス
- 無料枠が寛大
- 公式サイト: https://www.cloudflare.com/ja-jp/developer-platform/products/r2/

### セットアップ手順

#### 2.1 バケットの作成
1. Cloudflare R2でバケットを無料作成
2. Cloudflareに独自ドメインを登録（本番環境で必須）
   - 外部ドメイン（ムームードメインなど）も使用可能
   - **推奨**: サブドメインの使用（例: `bucket.example.com`）

#### 2.2 環境変数の設定

以下の環境変数を `.env` に追加:

```bash
CLOUDFLARE_S3_ENDPOINT=        # バケット設定画面上部に表示
CLOUDFLARE_S3_ACCESS_KEY_ID=   # R2ダッシュボードでAPIトークン作成時に表示
CLOUDFLARE_S3_SECRET_ACCESS_KEY= # 同上
CLOUDFLARE_S3_BUCKET=          # バケット名
CLOUDFLARE_S3_PUBLIC_URL=      # パブリック開発URL（開発環境）またはカスタムドメイン（本番環境）
```

**重要な注意点**:
- **開発環境**: パブリック開発URLを使用
- **本番環境（Vercel）**: カスタムドメインから作成したパブリックURLを使用

#### 2.3 各種設定値の取得場所
- `CLOUDFLARE_S3_ENDPOINT`: バケット設定画面上部
- `CLOUDFLARE_S3_ACCESS_KEY_ID` / `SECRET_ACCESS_KEY`: R2ダッシュボード > APIトークン作成
- `CLOUDFLARE_S3_BUCKET`: バケット名
- `CLOUDFLARE_S3_PUBLIC_URL`: バケット設定 > パブリック開発URLを有効化

---

## 3. 実装手順

### 3.1 パッケージのインストール

```bash
pnpm add @aws-sdk/client-s3
```

### 3.2 ストレージ関数の作成

`lib/storage.ts` を作成し、以下の内容を実装:

```typescript
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

interface S3Config {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
}

interface ParsedData {
  mimeType: string;
  extension: string;
  blob: Buffer;
}

interface FileUploadOptions {
  key: string;
  file: File;
}

interface DataUrlUploadOptions {
  key: string;
  dataUrl: string;
}

// 環境変数のバリデーション
const getS3Config = (): S3Config => {
  const config = {
    endpoint: process.env.CLOUDFLARE_S3_ENDPOINT,
    accessKeyId: process.env.CLOUDFLARE_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_S3_SECRET_ACCESS_KEY,
    bucket: process.env.CLOUDFLARE_S3_BUCKET,
    publicUrl: process.env.CLOUDFLARE_S3_PUBLIC_URL,
  };

  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      throw new Error(
        `Missing required environment variable: CLOUDFLARE_S3_${key.toUpperCase()}`
      );
    }
  }

  return config as S3Config;
};

// S3クライアントの初期化
const createS3Client = (config: S3Config) => {
  return new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
};

const config = getS3Config();
const S3 = createS3Client(config);

/**
 * dataUrl の場合画像をアップロードし、URLを返す
 * @param key
 * @param imageURL imageUrl or dataUrl
 * @returns
 */
export const resolveImageUpload = async (
  key: string,
  imageUrl: string
): Promise<string> => {
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  } else {
    return upload({ key, dataUrl: imageUrl });
  }
};

export const upload = async (
  options: FileUploadOptions | DataUrlUploadOptions
): Promise<string> => {
  const isDataUrl = "dataUrl" in options;
  const data = isDataUrl
    ? parseDataUrl(options.dataUrl)
    : await parseFile(options.file);

  const key = `${options.key}.${data.extension}`;

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: data.blob,
    ContentEncoding: isDataUrl ? "base64" : undefined,
    ContentType: data.mimeType,
  });

  await S3.send(command);

  return `${config.publicUrl}/${key}`;
};

export const deleteFile = async (fileName: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: fileName,
  });

  await S3.send(command);
};

const parseDataUrl = (dataUrl: string): ParsedData => {
  const [mimeTypeWithPrefix, base64] = dataUrl.split(";base64,");
  const mimeType = mimeTypeWithPrefix?.replace("data:", "");
  const extension = mimeType?.split("/")[1];

  if (!mimeType || !extension || !base64) {
    throw new Error("Invalid data URL format");
  }

  try {
    return {
      mimeType,
      extension,
      blob: Buffer.from(base64, "base64"),
    };
  } catch (error) {
    throw new Error("Failed to decode base64 data");
  }
};

const parseFile = async (file: File): Promise<ParsedData> => {
  if (!file.type) {
    throw new Error("File type is required");
  }

  const extension = file.type.split("/")[1];

  if (!extension) {
    throw new Error("Invalid file type");
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    return {
      mimeType: file.type,
      extension,
      blob: Buffer.from(arrayBuffer),
    };
  } catch (error) {
    throw new Error(
      `Failed to read file: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};
```

**主要な関数**:
- `upload()`: File または dataUrl を R2 にアップロード
- `resolveImageUpload()`: URL判定してアップロード（既存URLはそのまま返す）
- `deleteFile()`: ファイル削除

**実装の特徴**:
- 環境変数のバリデーション
- dataUrl と File の両方に対応
- 自動的な拡張子抽出とContent-Type設定
- エラーハンドリング

### 3.3 使用例

```typescript
export const createProfile = async (data: InsertProfile) => {
  const session = await currentSession();
  const validData = z.parse(data);

  await db.insert(profiles).values({
    ...validData,
    // dataUrlの場合、アップロード後にURLがセットされる
    image: await resolveImageUpload(`avatars/${session.user.id}`, validData.image)
  });
}
```

---

## 4. Next.js設定

### 4.1 リモートURLの許可

`next.config.ts` を編集:

```typescript
const nextConfig: NextConfig = {
  // ... 既存の設定

  images: {
    remotePatterns: [new URL(`${process.env.CLOUDFLARE_S3_PUBLIC_URL}/**`)],
  },
};
```

### 4.2 環境変数の追加（必要に応じて）

```bash
# Supabase Localの場合の例
IMAGE_HOST=http://127.0.0.1
```

**注意**: 設定後はローカルサーバーを再起動し、Vercelの環境変数にも同様に追加してください。

---

## 5. Tips & ベストプラクティス

### パフォーマンス
- base64 to File などの変換はブラウザで実行（重い処理をサーバーで行わない）

### セキュリティ・制限
- Cloudflare R2ダッシュボードからファイルサイズや拡張子の制限を設定
- 公開画像として表示する場合、対象バケットを公開設定にする

### 運用
- 開発環境と本番環境で異なるパブリックURLを使用
- サブドメインの使用を推奨

---

## 実装チェックリスト

- [ ] Cloudflare R2でバケット作成
- [ ] 独自ドメイン登録（本番環境用）
- [ ] 環境変数の設定（`.env` とVercel）
- [ ] `@aws-sdk/client-s3` のインストール
- [ ] `lib/storage.ts` の作成
- [ ] `next.config.ts` のリモートパターン設定
- [ ] ローカルサーバーの再起動
- [ ] input-imageコンポーネントの導入（必要に応じて）

---

## トラブルシューティング

### よくある問題

#### 環境変数が読み込まれない
- ローカルサーバーを再起動してください
- `.env` ファイルがプロジェクトルートにあることを確認してください
- Vercelの環境変数設定を確認してください

#### 画像が表示されない
- `next.config.ts` の `remotePatterns` 設定を確認してください
- バケットが公開設定になっているか確認してください
- `CLOUDFLARE_S3_PUBLIC_URL` が正しく設定されているか確認してください

#### アップロードが失敗する
- APIトークンの権限を確認してください
- バケット名が正しいか確認してください
- ネットワーク接続を確認してください

---

## 参考リンク

- [Cloudflare R2 公式ドキュメント](https://www.cloudflare.com/ja-jp/developer-platform/products/r2/)
- [input-image コンポーネント](https://registry.dninomiya.com/input-image)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
