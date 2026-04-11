import { db } from "@/db"
import { profileMembers } from "@/db/schemas/profile-members"
import { asc, eq } from "drizzle-orm"
import "server-only"

export const getAllProfileMembers = async () => {
  return db.query.profileMembers.findMany({
    orderBy: [asc(profileMembers.sortOrder), asc(profileMembers.createdAt)],
  })
}

export const getVisibleProfileMembers = async () => {
  return db.query.profileMembers.findMany({
    where: eq(profileMembers.isVisible, true),
    orderBy: [asc(profileMembers.sortOrder), asc(profileMembers.createdAt)],
  })
}

export const getProfileMember = async (id: string) => {
  return db.query.profileMembers.findFirst({
    where: eq(profileMembers.id, id),
  })
}
