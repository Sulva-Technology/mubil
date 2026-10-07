"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendContactEmail } from "@/lib/contact/email";
import { rateLimit } from "@/lib/contact/rate-limit";
import { HONEYPOT_FIELD, contactSchema, fieldErrors, type ContactState } from "@/lib/contact/schema";

async function clientIp() {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Bots fill every field. Pretend it worked and store nothing.
  if (String(formData.get(HONEYPOT_FIELD) ?? "").trim() !== "") return { status: "success" };

  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    subject: formData.get("subject") ?? "",
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) {
    return { status: "error", message: "Check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }

  const limit = rateLimit(await clientIp());
  if (!limit.ok) {
    return { status: "error", message: "Too many messages from your connection. Wait a few minutes and try again." };
  }

  const { error } = await createAdminClient().from("messages").insert(parsed.data);
  if (error) {
    console.error("Contact insert failed", error.message);
    return { status: "error", message: "Your message didn't send. Try again, or email us directly." };
  }

  await sendContactEmail(parsed.data);
  return { status: "success" };
}
