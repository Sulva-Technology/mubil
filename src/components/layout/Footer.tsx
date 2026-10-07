import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { contact, footer, site, socials } from "@/content";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { SocialIcon } from "@/components/icons/SocialIcon";

const contactRows = [
  { icon: MapPin, label: "Address", value: contact.address },
  { icon: Phone, label: "Phone", value: contact.phone },
  { icon: Mail, label: "Email", value: contact.email },
  { icon: Clock, label: "Hours", value: contact.hours },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-night text-white">
      <AmbientBackground tone="night" className="opacity-70" />
      <div className="container-page relative z-10 pb-10 pt-24 md:pt-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="max-w-[36ch] text-white/70">{footer.blurb}</p>
            <ul className="mt-8 flex gap-2" aria-label="Social media">
              {socials.map((s) => (
                <li key={s.network}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-[color,transform] duration-500 ease-soft hover:-translate-y-0.5 hover:text-white"
                  >
                    <SocialIcon network={s.network} className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 lg:col-span-3">
            {footer.columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-small font-semibold text-white">{column.title}</h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="rounded text-white/65 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="lg:col-span-4">
            <h2 className="text-small font-semibold text-white">Get in touch</h2>
            <ul className="mt-4 space-y-3">
              {contactRows.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-3 text-white/65">
                  <Icon aria-hidden className="mt-1 size-4 shrink-0 text-aqua" strokeWidth={1.75} />
                  <span>
                    <span className="sr-only">{label}: </span>
                    {value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="mt-20 select-none bg-gradient-to-b from-white/90 to-white/10 bg-clip-text font-display text-[clamp(5rem,24vw,20rem)] font-semibold leading-[0.85] tracking-[-0.05em] text-transparent md:mt-28"
        >
          {site.shortName}
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-small text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. {footer.registration}
          </p>
          <p>
            Built by{" "}
            <a href="https://sulvatech.com" className="rounded text-white/70 hover:text-white">
              Sulva Technology
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
