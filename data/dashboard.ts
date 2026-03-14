import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { blogs } from "@/db/schemas/blogs";
import { newsletters } from "@/db/schemas/newsletters";
import { videos } from "@/db/schemas/videos";
import { schedules } from "@/db/schemas/schedules";
import { informations } from "@/db/schemas/informations";
import { photoLibrary } from "@/db/schemas/photo-library";
import { pastEvents } from "@/db/schemas/past-events";
import { contacts } from "@/db/schemas/contacts";
import { sponsors } from "@/db/schemas/sponsors";
import { count, sql } from "drizzle-orm";
import "server-only";

export type DashboardStats = {
  members: {
    total: number;
    active: number;
    pendingProfile: number;
    inactive: number;
  };
  payment: {
    completed: number;
    pending: number;
    failed: number;
  };
  memberType: {
    migrated: number;
    new: number;
  };
  content: {
    blogs: number;
    newsletters: number;
    videos: number;
    schedules: number;
    informations: number;
    photos: number;
    pastEvents: number;
  };
  contacts: number;
  sponsors: number;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [memberStats, ...contentCounts] = await Promise.all([
    // 会員統計を1クエリで取得
    db
      .select({
        total: count(),
        active: count(
          sql`CASE WHEN ${members.status} = 'active' THEN 1 END`
        ),
        pendingProfile: count(
          sql`CASE WHEN ${members.status} = 'pending_profile' THEN 1 END`
        ),
        inactive: count(
          sql`CASE WHEN ${members.status} = 'inactive' THEN 1 END`
        ),
        paymentCompleted: count(
          sql`CASE WHEN ${members.paymentStatus} = 'completed' THEN 1 END`
        ),
        paymentPending: count(
          sql`CASE WHEN ${members.paymentStatus} = 'pending' THEN 1 END`
        ),
        paymentFailed: count(
          sql`CASE WHEN ${members.paymentStatus} = 'failed' THEN 1 END`
        ),
        migrated: count(
          sql`CASE WHEN ${members.isMigrated} = true THEN 1 END`
        ),
        newMembers: count(
          sql`CASE WHEN ${members.isMigrated} = false THEN 1 END`
        ),
      })
      .from(members),
    // コンテンツ数を並列取得
    db.select({ count: count() }).from(blogs),
    db.select({ count: count() }).from(newsletters),
    db.select({ count: count() }).from(videos),
    db.select({ count: count() }).from(schedules),
    db.select({ count: count() }).from(informations),
    db.select({ count: count() }).from(photoLibrary),
    db.select({ count: count() }).from(pastEvents),
    db.select({ count: count() }).from(contacts),
    db.select({ count: count() }).from(sponsors),
  ]);

  const stats = memberStats[0];
  const [blogCount, newsletterCount, videoCount, scheduleCount, informationCount, photoCount, pastEventCount, contactCount, sponsorCount] = contentCounts;

  return {
    members: {
      total: stats.total,
      active: stats.active,
      pendingProfile: stats.pendingProfile,
      inactive: stats.inactive,
    },
    payment: {
      completed: stats.paymentCompleted,
      pending: stats.paymentPending,
      failed: stats.paymentFailed,
    },
    memberType: {
      migrated: stats.migrated,
      new: stats.newMembers,
    },
    content: {
      blogs: blogCount[0].count,
      newsletters: newsletterCount[0].count,
      videos: videoCount[0].count,
      schedules: scheduleCount[0].count,
      informations: informationCount[0].count,
      photos: photoCount[0].count,
      pastEvents: pastEventCount[0].count,
    },
    contacts: contactCount[0].count,
    sponsors: sponsorCount[0].count,
  };
};
