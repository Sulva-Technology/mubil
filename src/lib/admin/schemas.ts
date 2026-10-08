import { z } from "zod";

// No eval-based JIT: our Content Security Policy blocks `new Function`.
z.config({ jitless: true });

const slug = z
  .string()
  .trim()
  .min(1, "Add a web address")
  .max(80, "Keep the web address under 80 characters")
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single dashes only");

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} is too long`)
    .transform((v) => v || null);

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Enter a full link starting with https://")
  .transform((v) => v || null);

const time = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{2}:\d{2}(:\d{2})?$/.test(v), "Enter a time like 14:30")
  .transform((v) => v || null);

export const statusSchema = z.enum(["draft", "published"]);

export const eventSchema = z
  .object({
    id: z.uuid().optional(),
    title: z.string().trim().min(3, "Add a title").max(200, "Title is too long"),
    slug,
    excerpt: optionalText(300, "Summary"),
    description: z.string().max(100_000).transform((v) => v || null),
    event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
    start_time: time,
    end_time: time,
    venue: optionalText(200, "Venue"),
    address: optionalText(300, "Address"),
    map_link: optionalUrl,
    cover_image_url: optionalUrl,
    status: statusSchema,
    featured: z.boolean(),
  })
  .refine((e) => !e.start_time || !e.end_time || e.end_time > e.start_time, {
    message: "End time must be after the start time",
    path: ["end_time"],
  });

export const postSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(3, "Add a title").max(200, "Title is too long"),
  slug,
  excerpt: optionalText(300, "Summary"),
  body: z.string().max(200_000).transform((v) => v || null),
  cover_image_url: optionalUrl,
  category: optionalText(60, "Category"),
  author: optionalText(120, "Author"),
  publish_date: z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Pick a publish date"),
  status: statusSchema,
});

export type EventInput = z.input<typeof eventSchema>;
export type PostInput = z.input<typeof postSchema>;

export type FieldErrors = Record<string, string>;

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
