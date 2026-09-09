import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

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
          // iOS applies its own corner mask, so this fills the full square.
          background: "linear-gradient(135deg, #2fe17e, #9c8bff 55%, #ffd166)",
          color: "#fff",
          fontSize: 108,
          fontWeight: 900,
          fontFamily: "sans-serif",
        }}
      >
        $
      </div>
    ),
    { ...size },
  );
}
