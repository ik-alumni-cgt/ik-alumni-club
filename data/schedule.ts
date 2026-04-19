import { db } from "@/db";
import { schedules } from "@/db/schemas/schedules";
import { eq, desc, asc, gte, and } from "drizzle-orm";
import "server-only";

// 公開済みスケジュール一覧を取得（一般公開用）
// 会員限定コンテンツも一覧には表示（詳細ページでアクセス制御）
export const getSchedules = async () => {
  return db.query.schedules.findMany({
    where: eq(schedules.published, true),
    orderBy: [asc(schedules.sortOrder), asc(schedules.eventDate)],
  });
};

// 未来のイベントのみ取得（公開用）
// 会員限定コンテンツも一覧には表示（詳細ページでアクセス制御）
export const getUpcomingSchedules = async () => {
  const now = new Date();

  return db.query.schedules.findMany({
    where: and(
      eq(schedules.published, true),
      gte(schedules.eventDate, now)
    ),
    orderBy: [asc(schedules.sortOrder), asc(schedules.eventDate)],
  });
};

// 全スケジュール一覧を取得（管理者用）
export const getAllSchedules = async () => {
  return db.query.schedules.findMany({
    orderBy: [asc(schedules.sortOrder), desc(schedules.eventDate)],
    with: {
      scheduleCategories: {
        with: {
          category: true,
        },
      },
    },
  });
};

// 個別スケジュールを取得
export const getSchedule = async (id: string) => {
  return db.query.schedules.findFirst({
    where: eq(schedules.id, id),
  });
};
