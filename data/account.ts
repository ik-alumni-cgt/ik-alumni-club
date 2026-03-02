import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { accounts } from "@/db/schemas/auth";
import { eq, desc, and } from "drizzle-orm";
import type { MemberStatus } from "@/types/member";
import "server-only";

type PaymentStatus = "pending" | "completed" | "failed" | "canceled";

type AccountFilters = {
  status?: MemberStatus;
  paymentStatus?: PaymentStatus;
  isMigrated?: boolean;
};

// 全会員一覧を取得（管理者用）
export const getAllAccounts = async (filters?: AccountFilters) => {
  const conditions = [];

  if (filters?.status) {
    conditions.push(eq(members.status, filters.status));
  }
  if (filters?.paymentStatus) {
    conditions.push(eq(members.paymentStatus, filters.paymentStatus));
  }
  if (filters?.isMigrated !== undefined) {
    conditions.push(eq(members.isMigrated, filters.isMigrated));
  }

  const memberList = await db.query.members.findMany({
    with: {
      user: true,
      plan: true,
    },
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [desc(members.createdAt)],
  });

  // 各会員の認証アカウント情報を取得
  const membersWithAuthInfo = await Promise.all(
    memberList.map(async (member) => {
      const userAccounts = await db.query.accounts.findMany({
        where: eq(accounts.userId, member.userId),
      });

      // パスワード設定済みかどうか
      const hasPassword = userAccounts.some(
        (acc) => acc.providerId === "credential" && acc.password
      );

      // ソーシャルログイン設定済みかどうか
      const hasSocialLogin = userAccounts.some(
        (acc) => acc.providerId === "google" || acc.providerId === "line"
      );

      // ログイン設定済み = パスワードまたはソーシャルログインがある
      const hasLoginSetup = hasPassword || hasSocialLogin;

      return {
        ...member,
        hasPassword,
        hasSocialLogin,
        hasLoginSetup,
      };
    })
  );

  return membersWithAuthInfo;
};

// 個別会員を取得（管理者用）
export const getAccountById = async (id: string) => {
  const member = await db.query.members.findFirst({
    where: eq(members.id, id),
    with: {
      user: true,
      plan: true,
    },
  });

  if (!member) return null;

  // 認証アカウント情報を取得
  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, member.userId),
  });

  const hasPassword = userAccounts.some(
    (acc) => acc.providerId === "credential" && acc.password
  );

  const hasSocialLogin = userAccounts.some(
    (acc) => acc.providerId === "google" || acc.providerId === "line"
  );

  const hasLoginSetup = hasPassword || hasSocialLogin;

  // 連携済みのプロバイダー一覧
  const linkedProviders = userAccounts
    .filter((acc) => acc.providerId !== "credential" || acc.password)
    .map((acc) => acc.providerId);

  return {
    ...member,
    hasPassword,
    hasSocialLogin,
    hasLoginSetup,
    linkedProviders,
  };
};
