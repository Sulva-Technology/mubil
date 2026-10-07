import type { SocialNetwork } from "@/content";

/** Line-style social icons drawn to match lucide's 24px / 1.75 stroke grid. */
const paths: Record<SocialNetwork, React.ReactNode> = {
  facebook: <path d="M15 3.5h-2.2A3.8 3.8 0 0 0 9 7.3V10H6.5v3.5H9v7h3.5v-7h2.6l.6-3.5h-3.2V7.8c0-.6.4-1 1-1H15z" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  x: (
    <>
      <path d="M4 4h4.6L20 20h-4.6z" />
      <path d="M19.5 4l-6.6 7.3M11.1 12.7L4.5 20" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10.5V16.5M8 7.6v.01M11.5 16.5v-6M11.5 13a2.5 2.5 0 0 1 5 0v3.5" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.4l4.4 2.6-4.4 2.6z" fill="currentColor" />
    </>
  ),
};

export function SocialIcon({ network, className }: { network: SocialNetwork; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {paths[network]}
    </svg>
  );
}
