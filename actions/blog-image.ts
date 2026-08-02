"use server"

import { verifyBlogWriter } from "@/lib/session"
import { generatePresignedPutUrl } from "@/lib/storage"
import { nanoid } from "nanoid"

/**
 * ブログ本文内画像のPresigned PUT URLを生成する
 * クライアントはこのURLに直接PUTしてR2にアップロードする（サーバー経由なし）
 */
export async function generateBlogImagePresignedUrl(contentType: string) {
  await verifyBlogWriter()

  return generatePresignedPutUrl({
    key: `blogs/content/${nanoid()}`,
    contentType,
  })
}
