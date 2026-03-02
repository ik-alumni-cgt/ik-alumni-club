"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { verifyOfficer } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleWelcomeGift(memberId: string, sent: boolean) {
  await verifyOfficer();

  await db
    .update(members)
    .set({ welcomeGiftSent: sent })
    .where(eq(members.id, memberId));

  revalidatePath("/officer/members");
}
