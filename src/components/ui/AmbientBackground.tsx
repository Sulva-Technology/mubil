import { cn } from "@/lib/cn";

type Blob = {
  color: string;
  size: string;
  top: string;
  left: string;
  dx: string;
  dy: string;
  duration: string;
};

const LIGHT: Blob[] = [
  { color: "color-mix(in srgb, var(--brand) 28%, transparent)", size: "clamp(320px, 48vw, 700px)", top: "-18%", left: "-10%", dx: "8%", dy: "6%", duration: "26s" },
  { color: "color-mix(in srgb, var(--sky) 35%, transparent)", size: "clamp(300px, 42vw, 620px)", top: "-6%", left: "56%", dx: "-7%", dy: "8%", duration: "32s" },
  { color: "color-mix(in srgb, var(--aqua) 22%, transparent)", size: "clamp(280px, 34vw, 480px)", top: "48%", left: "26%", dx: "6%", dy: "-7%", duration: "38s" },
];

const NIGHT: Blob[] = [
  { color: "color-mix(in srgb, var(--brand) 40%, transparent)", size: "clamp(340px, 52vw, 700px)", top: "-24%", left: "-12%", dx: "7%", dy: "6%", duration: "30s" },
  { color: "color-mix(in srgb, var(--aqua) 40%, transparent)", size: "clamp(260px, 34vw, 520px)", top: "40%", left: "62%", dx: "-6%", dy: "-8%", duration: "36s" },
  { color: "color-mix(in srgb, var(--brand-deep) 60%, transparent)", size: "clamp(280px, 40vw, 560px)", top: "52%", left: "4%", dx: "5%", dy: "-5%", duration: "42s" },
];

/**
 * Three slow drifting gradient blobs. Place inside a `relative` parent.
 * Drift and the 120px blur run only on desktop with motion allowed.
 */
export function AmbientBackground({ tone = "light", className }: { tone?: "light" | "night"; className?: string }) {
  const blobs = tone === "night" ? NIGHT : LIGHT;
  return (
    <div aria-hidden className={cn("ambient", className)}>
      {blobs.map((b, i) => (
        <span
          key={i}
          className="ambient-blob"
          style={
            {
              "--blob-color": b.color,
              "--blob-dx": b.dx,
              "--blob-dy": b.dy,
              "--blob-duration": b.duration,
              width: b.size,
              height: b.size,
              top: b.top,
              left: b.left,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
