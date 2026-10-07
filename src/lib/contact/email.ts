import "server-only";
import { Resend } from "resend";
import { site } from "@/content";

type Message = { name: string; email: string; phone: string | null; subject: string; message: string };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Clean branded HTML email. Inline styles only, for email clients. */
export function renderContactEmail(m: Message) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:#5B6B82;font-size:14px;width:96px;vertical-align:top">${label}</td><td style="padding:6px 0;color:#0B1B33;font-size:15px">${value}</td></tr>`;
  return `<!doctype html>
<html><body style="margin:0;background:#F5F7FB;font-family:Inter,Segoe UI,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FB;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid rgba(11,27,51,0.08)">
        <tr><td style="background:#0A2A6B;background-image:linear-gradient(135deg,#0A2A6B,#1F5EFF);padding:28px 32px">
          <p style="margin:0;color:#6FB8FF;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;font-weight:600">New website message</p>
          <p style="margin:8px 0 0;color:#FFFFFF;font-size:22px;font-weight:700;letter-spacing:-0.02em">${esc(m.subject)}</p>
        </td></tr>
        <tr><td style="padding:28px 32px 8px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("From", esc(m.name))}
            ${row("Email", `<a href="mailto:${esc(m.email)}" style="color:#1F5EFF">${esc(m.email)}</a>`)}
            ${m.phone ? row("Phone", `<a href="tel:${esc(m.phone)}" style="color:#1F5EFF">${esc(m.phone)}</a>`) : ""}
          </table>
        </td></tr>
        <tr><td style="padding:8px 32px 32px">
          <div style="border-top:1px solid rgba(11,27,51,0.08);padding-top:20px;color:#0B1B33;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(m.message)}</div>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;color:#5B6B82;font-size:12px">Sent from the contact form on ${esc(site.name)}'s website. Reply to this email to answer ${esc(m.name)}.</p>
    </td></tr>
  </table>
</body></html>`;
}

/** Returns false (and logs) when email isn't configured or Resend fails. */
export async function sendContactEmail(m: Message) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !to) {
    console.warn("Contact email skipped: RESEND_API_KEY or CONTACT_EMAIL is not set");
    return false;
  }
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? `${site.name} <onboarding@resend.dev>`,
    to,
    replyTo: m.email,
    subject: `Website message: ${m.subject}`,
    html: renderContactEmail(m),
    text: `${m.name} <${m.email}>${m.phone ? `, ${m.phone}` : ""}\n\n${m.message}`,
  });
  if (error) {
    console.error("Contact email failed", error.message);
    return false;
  }
  return true;
}
