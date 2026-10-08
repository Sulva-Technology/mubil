import { home } from "@/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { CountUp } from "./CountUp";

export function Impact() {
  const { impact } = home;
  return (
    <Section tone="night" ambient deferRender aria-labelledby="impact-title">
      <Eyebrow tone="dark" className="mb-4">
        {impact.eyebrow}
      </Eyebrow>
      <h2 id="impact-title" className="max-w-[16ch] text-h2 font-semibold text-white">
        {impact.title}
      </h2>

      <dl className="mt-14 grid border-b border-white/10 md:mt-20 md:grid-cols-2">
        {impact.stats.map((stat, i) => (
          <div
            key={stat.label}
            className={
              "flex flex-col-reverse gap-4 border-t border-white/10 py-10 md:py-14 " +
              (i % 2 === 1 ? "md:border-l md:pl-12" : "md:pr-12")
            }
          >
            <dt className="max-w-[24ch] text-white/70 md:text-[1.125rem]">{stat.label}</dt>
            <dd className="bg-gradient-to-br from-sky to-aqua bg-clip-text pb-1 font-display text-[clamp(3.5rem,1rem+7.5vw,8.5rem)] font-semibold leading-none tracking-[-0.045em] text-transparent">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
