/**
 * All static copy for the site. Replace bracketed placeholders with real
 * content from Mubil Foundation. Never invent facts.
 */

export const site = {
  name: "Mubil Foundation",
  shortName: "Mubil",
  tagline: "[FOUNDATION TAGLINE]",
  description: "[ONE SENTENCE DESCRIPTION OF MUBIL FOUNDATION]",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_NG",
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programmes", href: "/programmes" },
  { label: "Events", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

export const contact = {
  address: "[STREET ADDRESS, CITY, STATE]",
  phone: "[PHONE NUMBER]",
  email: "[EMAIL ADDRESS]",
  hours: "[OFFICE HOURS]",
} as const;

export type SocialNetwork = "facebook" | "instagram" | "x" | "linkedin" | "youtube";

export const socials: Array<{ network: SocialNetwork; label: string; href: string }> = [
  { network: "facebook", label: "Facebook", href: "#" },
  { network: "instagram", label: "Instagram", href: "#" },
  { network: "x", label: "X", href: "#" },
  { network: "linkedin", label: "LinkedIn", href: "#" },
  { network: "youtube", label: "YouTube", href: "#" },
];

export const footer = {
  blurb: "[SHORT LINE ABOUT THE FOUNDATION FOR THE FOOTER]",
  registration: "[CAC REGISTRATION NUMBER]",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "About", href: "/about" },
        { label: "Programmes", href: "/programmes" },
        { label: "Gallery", href: "/gallery" },
      ],
    },
    {
      title: "Stay up to date",
      links: [
        { label: "Events", href: "/events" },
        { label: "News", href: "/news" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ],
} as const;

/** Intros for page headers. Phase prompts fill in the page bodies. */
export const pages = {
  about: {
    eyebrow: "About",
    title: "[ABOUT HEADLINE]",
    intro: "[ONE OR TWO SENTENCES INTRODUCING THE FOUNDATION]",
  },
  programmes: {
    eyebrow: "Programmes",
    title: "[PROGRAMMES HEADLINE]",
    intro: "[ONE OR TWO SENTENCES ABOUT THE FOUNDATION'S PROGRAMMES]",
  },
  events: {
    eyebrow: "Events",
    title: "[EVENTS HEADLINE]",
    intro: "[ONE SENTENCE INVITING PEOPLE TO EVENTS]",
  },
  news: {
    eyebrow: "News",
    title: "[NEWS HEADLINE]",
    intro: "[ONE SENTENCE ABOUT FOUNDATION NEWS AND STORIES]",
  },
  gallery: {
    eyebrow: "Gallery",
    title: "[GALLERY HEADLINE]",
    intro: "[ONE SENTENCE ABOUT THE PHOTO GALLERY]",
  },
  contact: {
    eyebrow: "Contact",
    title: "[CONTACT HEADLINE]",
    intro: "[ONE SENTENCE INVITING PEOPLE TO GET IN TOUCH]",
  },
} as const;
