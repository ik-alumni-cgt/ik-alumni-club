"use server";

import { db } from "@/db";
import { contacts } from "@/db/schemas/contacts";
import { contactFormSchema, type ContactFormData } from "@/zod/contact";
import {
  CONTACT_CATEGORY_LABELS,
  type ContactCategory,
} from "@/components/contact/constants";
import {
  sendContactNotificationEmail,
  sendContactConfirmationEmail,
} from "@/lib/email";

type SubmitContactResult =
  | { success: true }
  | { success: false; error: string };

export async function submitContact(
  formData: ContactFormData
): Promise<SubmitContactResult> {
  try {
    const data = contactFormSchema.parse(formData);

    await db.insert(contacts).values({
      name: data.name,
      email: data.email,
      category: data.category,
      subject: data.subject,
      body: data.body,
    });

    const categoryLabel =
      CONTACT_CATEGORY_LABELS[data.category as ContactCategory];

    await sendContactNotificationEmail({
      name: data.name,
      email: data.email,
      category: categoryLabel,
      subject: data.subject,
      body: data.body,
    });

    await sendContactConfirmationEmail({
      name: data.name,
      email: data.email,
      category: categoryLabel,
      subject: data.subject,
      body: data.body,
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "予期しないエラーが発生しました";
    console.error("[submitContact] エラー:", error);
    return { success: false, error: message };
  }
}
