import type { Metadata } from "next";
import { Suspense } from "react";
import { contact, site, socials } from "@/content";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/home/Hero";
import { Impact } from "@/components/home/Impact";
import { ProgrammesRail } from "@/components/home/ProgrammesRail";
import {
  ClosingCta,
  LatestNews,
  LatestNewsSkeleton,
  ProgrammesHeading,
  Story,
  UpcomingEvents,
  UpcomingEventsSkeleton,
} from "@/components/home/HomeSections";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: `${site.name} | Children learn, women earn, families thrive` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: site.name, description: site.description },
};

const ngoJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: site.name,
  url: absoluteUrl("/"),
  logo: absoluteUrl("/icon"),
  description: site.description,
  foundingDate: String(site.founded),
  email: contact.email,
  telephone: contact.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: contact.address,
    addressCountry: "NG",
  },
  sameAs: socials.map((s) => s.href),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={ngoJsonLd} />
      <Hero />
      <Impact />
      <ProgrammesRail header={<ProgrammesHeading />} />
      <Suspense fallback={<UpcomingEventsSkeleton />}>
        <UpcomingEvents />
      </Suspense>
      <Suspense fallback={<LatestNewsSkeleton />}>
        <LatestNews />
      </Suspense>
      <Story />
      <ClosingCta />
    </>
  );
}
