import { members } from "@/db/schemas/member";
import { MemberPlan } from "./member-plan";

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

// 会員ステータスの型
export type MemberStatus = "pending_profile" | "active" | "inactive";

// 会員ロールの型
export type MemberRole = "admin" | "officer" | "member";

// プラン情報を含む会員型
export type MemberWithPlan = Member & {
  plan: MemberPlan | null;
};

// プロフィール完了チェック用の型
export type ProfileCompletionStatus = {
  isComplete: boolean;
  missingFields: string[];
};
