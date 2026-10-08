import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: the wordmark's blue orb. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 9999,
            background: "radial-gradient(circle at 30% 25%, #6FB8FF 0%, #1F5EFF 55%, #0A2A6B 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          M
        </div>
      </div>
    ),
    size,
  );
}
