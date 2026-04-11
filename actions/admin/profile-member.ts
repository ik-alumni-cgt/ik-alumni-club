"use server"

import { db } from "@/db"
import { profileMembers } from "@/db/schemas/profile-members"
import { verifyAdmin } from "@/lib/session"
import { resolveImageUpload } from "@/lib/storage"
import { profileMemberFormSchema, type ProfileMemberFormData } from "@/zod/admin/profile-member"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

export async function createProfileMember(formData: ProfileMemberFormData) {
  await verifyAdmin()

  const data = profileMemberFormSchema.parse(formData)

  const imageUrl = data.imageUrl
    ? await resolveImageUpload(`profile-members/${nanoid()}`, data.imageUrl)
    : null

  await db.insert(profileMembers).values({
    ...data,
    imageUrl,
    memberId: data.memberId || null,
  })

  revalidatePath("/admin/profile-members")
  revalidatePath("/profiles")
}

export async function updateProfileMember(id: string, formData: ProfileMemberFormData) {
  await verifyAdmin()

  const data = profileMemberFormSchema.parse(formData)

  const imageUrl = data.imageUrl
    ? await resolveImageUpload(`profile-members/${nanoid()}`, data.imageUrl)
    : null

  await db
    .update(profileMembers)
    .set({
      ...data,
      imageUrl,
      memberId: data.memberId || null,
    })
    .where(eq(profileMembers.id, id))

  revalidatePath("/admin/profile-members")
  revalidatePath("/profiles")
}

export async function deleteProfileMember(id: string) {
  await verifyAdmin()

  await db.delete(profileMembers).where(eq(profileMembers.id, id))

  revalidatePath("/admin/profile-members")
  revalidatePath("/profiles")
}
