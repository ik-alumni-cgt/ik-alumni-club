import "server-only";
import { db } from "@/db";
import { editorInvites } from "@/db/schemas/editor-invites";
import { desc, eq } from "drizzle-orm";

export const getEditorInvites = async () => {
  return db.query.editorInvites.findMany({
    orderBy: [desc(editorInvites.createdAt)],
    with: {
      uses: {
        with: {
          user: true,
        },
      },
    },
  });
};

export const getEditorInviteByToken = async (token: string) => {
  return db.query.editorInvites.findFirst({
    where: eq(editorInvites.token, token),
  });
};

export type InviteState = "valid" | "not_found" | "full" | "expired";

/** 招待が今このタイミングで使えるかを判定する。 */
export const getInviteState = (
  invite: { expiresAt: Date; maxUses: number; usedCount: number } | undefined
): InviteState => {
  if (!invite) return "not_found";
  if (invite.expiresAt.getTime() < Date.now()) return "expired";
  if (invite.usedCount >= invite.maxUses) return "full";
  return "valid";
};
