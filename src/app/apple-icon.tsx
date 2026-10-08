import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home screen icon for iOS. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0A2A6B 0%, #1F5EFF 70%, #19C3D9 100%)",
          color: "#FFFFFF",
          fontSize: 104,
          fontWeight: 700,
        }}
      >
        M
      </div>
    ),
    size,
  );
}
