import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { contact, pages, socials } from "@/content";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Glass } from "@/components/ui/Glass";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { ContactForm } from "@/components/contact/ContactForm";

const page = pages.contact;

export const metadata: Metadata = {
  title: "Contact",
  description: page.intro,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact Mubil Foundation", description: page.intro, url: "/contact" },
};

const rows = [
  { icon: MapPin, label: "Address", value: contact.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapQuery)}` },
  { icon: Phone, label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
  { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  { icon: Clock, label: "Hours", value: contact.hours },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44">
        <AmbientBackground />
        <div className="container-page relative z-10 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-5">{page.eyebrow}</Eyebrow>
            <h1 className="text-h1 font-semibold">{page.title}</h1>
            <p className="measure mt-6 text-[1.125rem] text-ink-2 md:text-[1.3125rem]">{page.intro}</p>

            <ul className="mt-10 space-y-5">
              {rows.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-brand-text shadow-card">
                    <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-small text-ink-2">{label}</p>
                    {href ? (
                      <a href={href} className="rounded font-medium hover:text-brand-text" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <ul className="mt-10 flex gap-2" aria-label="Social media">
              {socials.map((s) => (
                <li key={s.network}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink-2 transition-[color,transform] duration-500 ease-soft hover:-translate-y-0.5 hover:text-brand-text"
                  >
                    <SocialIcon network={s.network} className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      <section aria-label="Map" className="pb-24">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-panel bg-ice shadow-card">
            <iframe
              title={`Map showing ${contact.address}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[420px] w-full border-0 md:h-[480px]"
            />
            <Glass variant="strong" className="absolute bottom-4 left-4 right-4 rounded-card p-5 sm:right-auto sm:max-w-sm md:bottom-6 md:left-6">
              <p className="flex items-center gap-2 font-medium">
                <MapPin aria-hidden className="size-4 text-brand-text" strokeWidth={2} />
                Visit our office
              </p>
              <p className="mt-1 text-small text-ink">{contact.address}</p>
            </Glass>
          </div>
        </div>
      </section>
    </>
  );
}
