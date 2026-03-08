"use server";

import { db } from "@/db";
import { schedules } from "@/db/schemas/schedules";
import { verifyAdmin } from "@/lib/session";
import { ScheduleFormData } from "@/types/schedule";
import { scheduleFormSchema } from "@/zod/schedule";
import { eq } from "drizzle-orm";
import { resolveImageUpload } from "@/lib/storage";
import { nanoid } from "nanoid";

// スケジュール作成
export async function createSchedule(formData: ScheduleFormData) {
  const { userId } = await verifyAdmin();
  const data = scheduleFormSchema.parse(formData);

  // ユーザー情報を取得
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  // 画像URLの処理（dataURLの場合はアップロード）
  const imageUrl = data.imageUrl
    ? await resolveImageUpload(`schedules/${nanoid()}`, data.imageUrl)
    : null;

  const [newSchedule] = await db.insert(schedules).values({
    ...data,
    imageUrl,
    eventDate: new Date(data.eventDate),
    authorId: userId,
    authorName: user?.name || "",
    authorEmail: user?.email || "",
  }).returning();

  return newSchedule;
}

// スケジュール更新
export async function updateSchedule(
  id: string,
  formData: ScheduleFormData
) {
  await verifyAdmin();
  const data = scheduleFormSchema.parse(formData);

  // 画像URLの処理（dataURLの場合はアップロード）
  const imageUrl = data.imageUrl
    ? await resolveImageUpload(`schedules/${id}`, data.imageUrl)
    : null;

  await db
    .update(schedules)
    .set({
      ...data,
      imageUrl,
      eventDate: new Date(data.eventDate),
    })
    .where(eq(schedules.id, id));
}

// スケジュール削除
export async function deleteSchedule(id: string) {
  await verifyAdmin();
  await db.delete(schedules).where(eq(schedules.id, id));
}

// 公開/非公開切り替え
export async function togglePublishSchedule(id: string) {
  await verifyAdmin();

  const schedule = await db.query.schedules.findFirst({
    where: eq(schedules.id, id),
  });

  if (!schedule) {
    throw new Error("スケジュールが見つかりません");
  }

  await db
    .update(schedules)
    .set({ published: !schedule.published })
    .where(eq(schedules.id, id));
}

// 表示順序の更新
export async function updateScheduleSortOrder(
  id: string,
  sortOrder: number
) {
  await verifyAdmin();

  await db
    .update(schedules)
    .set({ sortOrder })
    .where(eq(schedules.id, id));
}
