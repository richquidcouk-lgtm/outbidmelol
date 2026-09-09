import { ImageResponse } from "next/og";

export const alt = "How it works — Outbid Me";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
          padding: 80,
          backgroundColor: "#06070c",
          backgroundImage:
            "radial-gradient(1000px 500px at 88% -10%, rgba(156,139,255,0.35), transparent 60%), radial-gradient(900px 500px at 0% 0%, rgba(47,225,126,0.30), transparent 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #2fe17e, #9c8bff 55%, #ffd166)",
              color: "#fff",
              fontSize: 32,
              fontWeight: 900,
            }}
          >
            $
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: "#97a0b3" }}>
            OUTBID ME
          </div>
        </div>
        <div style={{ fontSize: 66, fontWeight: 900, color: "#f3f5fa" }}>
          How it works
        </div>
        <div style={{ fontSize: 28, color: "#97a0b3", maxWidth: 900 }}>
          Rank is cumulative money paid, highest first. No votes, no
          algorithm.
        </div>
      </div>
    ),
    { ...size },
  );
}
