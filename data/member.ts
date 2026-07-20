import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { verifySession } from "@/lib/session";
import { eq } from "drizzle-orm";
import "server-only";

export const getMemberByUserId = async (userId: string) => {
  return db.query.members.findFirst({
    where: eq(members.userId, userId),
  });
};

export const getMemberRole = async (userId: string) => {
  const member = await getMemberByUserId(userId);
  return member?.role || null;
};

export const isAdmin = async () => {
  const session = await verifySession();
  const member = await getMemberByUserId(session.user.id);
  return member?.role === "admin";
};

export const isOfficerOrAdmin = async () => {
  const session = await verifySession();
  const member = await getMemberByUserId(session.user.id);
  return member?.role === "admin" || member?.role === "officer";
};
