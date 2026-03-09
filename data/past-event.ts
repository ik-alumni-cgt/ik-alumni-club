import "server-only";
import { db } from "@/db";
import { pastEvents } from "@/db/schemas/past-events";
import { eq, desc } from "drizzle-orm";

export const getPublishedPastEvents = async () => {
  return db.query.pastEvents.findMany({
    where: eq(pastEvents.published, true),
    orderBy: [desc(pastEvents.eventDate)],
  });
};

export const getAllPastEvents = async () => {
  return db.query.pastEvents.findMany({
    orderBy: [desc(pastEvents.eventDate)],
  });
};

export const getPastEvent = async (id: string) => {
  return db.query.pastEvents.findFirst({
    where: eq(pastEvents.id, id),
  });
};
