import "server-only";
import { db } from "@/db";
import { contacts } from "@/db/schemas/contacts";
import { desc, eq } from "drizzle-orm";

export const getAllContacts = async () => {
  return db.query.contacts.findMany({
    orderBy: [desc(contacts.createdAt)],
  });
};

export const getContact = async (id: string) => {
  return db.query.contacts.findFirst({
    where: eq(contacts.id, id),
  });
};
