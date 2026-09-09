import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          background: "linear-gradient(135deg, #2fe17e, #9c8bff 55%, #ffd166)",
          color: "#fff",
          fontSize: 20,
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
