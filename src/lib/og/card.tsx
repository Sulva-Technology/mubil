import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

let fontPromise: Promise<ArrayBuffer | null> | null = null;

/** Inter Tight 700 from Google Fonts, fetched once per server instance. */
function loadDisplayFont() {
  fontPromise ??= (async () => {
    try {
      const css = await fetch("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@700&display=swap", {
        // An old user agent makes Google return TTF, which next/og can read.
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko)" },
      }).then((r) => r.text());
      const url = css.match(/src: url\((.+?)\) format/)?.[1];
      if (!url) return null;
      return await fetch(url).then((r) => r.arrayBuffer());
    } catch {
      return null;
    }
  })();
  return fontPromise;
}

/**
 * Brand Open Graph card: title on a blue glass panel over the ocean glow.
 * Colours are literal because next/og cannot read CSS variables; keep them in
 * step with globals.css.
 */
export async function renderOgCard({ eyebrow, title, meta }: { eyebrow: string; title: string; meta?: string }) {
  const font = await loadDisplayFont();
  const size = title.length > 60 ? 56 : title.length > 36 ? 68 : 80;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#050B18",
          padding: 64,
          fontFamily: font ? "Inter Tight" : "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -220,
            left: -160,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background: "radial-gradient(circle at center, rgba(31,94,255,0.95) 0%, rgba(31,94,255,0.4) 40%, rgba(31,94,255,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            right: -140,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background: "radial-gradient(circle at center, rgba(25,195,217,0.7) 0%, rgba(25,195,217,0.28) 40%, rgba(25,195,217,0) 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: 56,
            borderRadius: 40,
            background: "rgba(10,26,60,0.5)",
            border: "1.5px solid rgba(111,184,255,0.28)",
            boxShadow: "inset 0 1px 0 rgba(111,184,255,0.25)",
            color: "#FFFFFF",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 9999,
                background: "radial-gradient(circle at 30% 25%, #6FB8FF, #1F5EFF 65%)",
              }}
            />
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1 }}>Mubil Foundation</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#19C3D9", letterSpacing: 2, textTransform: "uppercase" }}>
              {eyebrow}
            </div>
            <div style={{ fontSize: size, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 960 }}>{title}</div>
            {meta && <div style={{ fontSize: 28, color: "rgba(255,255,255,0.75)" }}>{meta}</div>}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font ? [{ name: "Inter Tight", data: font, weight: 700, style: "normal" }] : undefined,
    },
  );
}
