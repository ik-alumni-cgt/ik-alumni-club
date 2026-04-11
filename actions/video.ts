"use server";

import { db } from "@/db";
import { videos } from "@/db/schemas/videos";
import { verifyAdmin } from "@/lib/session";
import { VideoFormData } from "@/types/video";
import { videoFormSchema } from "@/zod/video";
import { eq } from "drizzle-orm";
import { resolveImageUpload } from "@/lib/storage";
import { nanoid } from "nanoid";

// 動画作成
export async function createVideo(formData: VideoFormData) {
  const { userId } = await verifyAdmin();
  const data = videoFormSchema.parse(formData);

  // ユーザー情報を取得
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  const thumbnailUrl = data.thumbnailUrl
    ? await resolveImageUpload(`videos/${nanoid()}`, data.thumbnailUrl)
    : null;

  const [newVideo] = await db.insert(videos).values({
    ...data,
    thumbnailUrl,
    authorId: userId,
    authorName: user?.name || "",
  }).returning();

  return newVideo;
}

// 動画更新
export async function updateVideo(id: string, formData: VideoFormData) {
  await verifyAdmin();
  const data = videoFormSchema.parse(formData);

  const thumbnailUrl = data.thumbnailUrl
    ? await resolveImageUpload(`videos/${id}`, data.thumbnailUrl)
    : null;

  await db
    .update(videos)
    .set({
      ...data,
      thumbnailUrl,
    })
    .where(eq(videos.id, id));
}

// 動画削除
export async function deleteVideo(id: string) {
  await verifyAdmin();
  await db.delete(videos).where(eq(videos.id, id));
}

// 公開/非公開切り替え
export async function togglePublishVideo(id: string) {
  await verifyAdmin();

  const video = await db.query.videos.findFirst({
    where: eq(videos.id, id),
  });

  if (!video) {
    throw new Error("動画が見つかりません");
  }

  await db
    .update(videos)
    .set({ published: !video.published })
    .where(eq(videos.id, id));
}

