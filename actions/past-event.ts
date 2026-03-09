"use server";

import { db } from "@/db";
import { pastEvents } from "@/db/schemas/past-events";
import { verifyAdmin } from "@/lib/session";
import { PastEventFormData } from "@/types/past-event";
import { pastEventFormSchema } from "@/zod/past-event";
import { eq } from "drizzle-orm";
import { resolveImageUpload } from "@/lib/storage";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function createPastEvent(formData: PastEventFormData) {
  const { userId } = await verifyAdmin();
  const data = pastEventFormSchema.parse(formData);

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  const imageUrl = data.imageUrl
    ? await resolveImageUpload(`past-events/${nanoid()}`, data.imageUrl)
    : null;

  const [newPastEvent] = await db.insert(pastEvents).values({
    ...data,
    imageUrl,
    eventDate: new Date(data.eventDate),
    authorId: userId,
    authorName: user?.name || "",
    authorEmail: user?.email || "",
  }).returning();

  revalidatePath("/admin/past-events");
  revalidatePath("/past-events");

  return newPastEvent;
}

export async function updatePastEvent(id: string, formData: PastEventFormData) {
  await verifyAdmin();
  const data = pastEventFormSchema.parse(formData);

  const imageUrl = data.imageUrl
    ? await resolveImageUpload(`past-events/${id}`, data.imageUrl)
    : null;

  await db
    .update(pastEvents)
    .set({
      ...data,
      imageUrl,
      eventDate: new Date(data.eventDate),
    })
    .where(eq(pastEvents.id, id));

  revalidatePath("/admin/past-events");
  revalidatePath("/past-events");
  revalidatePath(`/past-events/${id}`);
}

export async function deletePastEvent(id: string) {
  await verifyAdmin();
  await db.delete(pastEvents).where(eq(pastEvents.id, id));

  revalidatePath("/admin/past-events");
  revalidatePath("/past-events");
}

export async function togglePublishPastEvent(id: string) {
  await verifyAdmin();

  const pastEvent = await db.query.pastEvents.findFirst({
    where: eq(pastEvents.id, id),
  });

  if (!pastEvent) {
    throw new Error("過去のイベントが見つかりません");
  }

  await db
    .update(pastEvents)
    .set({ published: !pastEvent.published })
    .where(eq(pastEvents.id, id));

  revalidatePath("/admin/past-events");
  revalidatePath("/past-events");
}
