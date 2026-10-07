import { beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.fn();
const sendContactEmail = vi.fn();
let ip = "203.0.113.1";

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": ip }),
}));
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: () => ({ insert }) }),
}));
vi.mock("@/lib/contact/email", () => ({ sendContactEmail }));

const { submitContact } = await import("./actions");
const { resetRateLimit } = await import("@/lib/contact/rate-limit");
const { contactSchema, HONEYPOT_FIELD } = await import("@/lib/contact/schema");

const valid = {
  name: "  Adaeze Obi ",
  email: "Adaeze@Example.com ",
  phone: "",
  subject: "Volunteering",
  message: "I would like to volunteer at the next health day.",
};

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const idle = { status: "idle" } as const;

beforeEach(() => {
  insert.mockReset().mockResolvedValue({ error: null });
  sendContactEmail.mockReset().mockResolvedValue(true);
  resetRateLimit();
  ip = "203.0.113.1";
});

describe("contactSchema", () => {
  it("trims and normalises valid input", () => {
    const out = contactSchema.parse(valid);
    expect(out).toEqual({
      name: "Adaeze Obi",
      email: "adaeze@example.com",
      phone: null,
      subject: "Volunteering",
      message: "I would like to volunteer at the next health day.",
    });
  });

  it.each([
    ["name", "A", "Enter your name"],
    ["email", "not-an-email", "Enter a valid email address"],
    ["phone", "abc", "Enter a valid phone number"],
    ["subject", "", "Add a short subject"],
    ["message", "Too short", "Tell us a little more (at least 10 characters)"],
    ["message", "x".repeat(5001), "Message is too long"],
  ])("rejects a bad %s", (field, value, message) => {
    const result = contactSchema.safeParse({ ...valid, [field]: value });
    expect(result.success).toBe(false);
    expect(result.error?.issues.find((i) => i.path[0] === field)?.message).toBe(message);
  });

  it("accepts a Nigerian phone number", () => {
    expect(contactSchema.parse({ ...valid, phone: "+234 803 123 4567" }).phone).toBe("+234 803 123 4567");
  });
});

describe("submitContact", () => {
  it("returns field errors and stores nothing when input is invalid", async () => {
    const state = await submitContact(idle, form({ ...valid, email: "nope", message: "short" }));
    expect(state.status).toBe("error");
    expect(state.status === "error" && state.fieldErrors).toMatchObject({
      email: "Enter a valid email address",
      message: "Tell us a little more (at least 10 characters)",
    });
    expect(insert).not.toHaveBeenCalled();
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("silently drops honeypot submissions", async () => {
    const state = await submitContact(idle, form({ ...valid, [HONEYPOT_FIELD]: "https://spam.example" }));
    expect(state).toEqual({ status: "success" });
    expect(insert).not.toHaveBeenCalled();
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("stores the cleaned message and sends the email", async () => {
    const state = await submitContact(idle, form(valid));
    expect(state).toEqual({ status: "success" });
    expect(insert).toHaveBeenCalledWith({
      name: "Adaeze Obi",
      email: "adaeze@example.com",
      phone: null,
      subject: "Volunteering",
      message: "I would like to volunteer at the next health day.",
    });
    expect(sendContactEmail).toHaveBeenCalledOnce();
  });

  it("reports a friendly error when the database insert fails", async () => {
    insert.mockResolvedValue({ error: { message: "boom" } });
    const state = await submitContact(idle, form(valid));
    expect(state.status).toBe("error");
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("rate-limits repeated submissions from one IP", async () => {
    for (let i = 0; i < 5; i++) expect((await submitContact(idle, form(valid))).status).toBe("success");
    const blocked = await submitContact(idle, form(valid));
    expect(blocked.status).toBe("error");
    expect(insert).toHaveBeenCalledTimes(5);

    ip = "198.51.100.7";
    expect((await submitContact(idle, form(valid))).status).toBe("success");
  });
});
