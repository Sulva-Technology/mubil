import { z } from "zod";

/** Shared by the form (inline validation) and the Server Action. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120, "Name is too long"),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address")).pipe(z.string().max(254)),
  phone: z
    .string()
    .trim()
    .max(40, "Phone number is too long")
    .refine((v) => v === "" || /^[+\d][\d\s()-]{6,}$/.test(v), "Enter a valid phone number")
    .transform((v) => v || null),
  subject: z.string().trim().min(2, "Add a short subject").max(200, "Subject is too long"),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(5000, "Message is too long"),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const HONEYPOT_FIELD = "company_website";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: ContactErrors };

export function fieldErrors(error: z.ZodError): ContactErrors {
  const out: ContactErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
