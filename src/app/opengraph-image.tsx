import { ImageResponse } from "next/og";
import { formatMoney } from "@/lib/money";
import { getBoardStats, getLeaderListing } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export const alt = "Outbid Me — the board where money is the only ranking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Same freshness window as the leaderboard itself (page.tsx's revalidate) so
// a share preview can't drift far from what the board actually shows.
export const revalidate = 15;

export default async function OpengraphImage() {
  const [stats, leader] = await Promise.all([getBoardStats(), getLeaderListing()]);

  // Vercel Blob uploads are validated JPG/PNG/WebP and render fine here;
  // an inline SVG mark (shouldn't occur once Blob upload lands, but a
  // defensive fallback costs nothing) can't be reliably rasterized by
  // Satori's image loader, so fall back to an initials badge for those
  // rather than risk a broken image in the share preview.
  const leaderImageUrl =
    leader && !leader.imageUrl.endsWith(".svg")
      ? new URL(leader.imageUrl, SITE_URL).toString()
      : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
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
          <div style={{ fontSize: 40, fontWeight: 900, color: "#f3f5fa" }}>
            OUTBID ME
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              fontSize: 30,
              color: "#97a0b3",
              display: "flex",
              gap: 10,
            }}
          >
            <span>Rank is bought, not earned.</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 20,
              fontWeight: 900,
              color: "#2fe17e",
            }}
          >
            <span style={{ fontSize: 84 }}>
              {formatMoney(stats.totalRaisedCents)}
            </span>
            <span style={{ fontSize: 32, color: "#f3f5fa", fontWeight: 700 }}>
              raised · {stats.listingCount} listings
            </span>
          </div>
        </div>

        {leader ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20,
              padding: "20px 28px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 72,
                height: 72,
                borderRadius: 16,
                overflow: "hidden",
                background: "linear-gradient(135deg, #ffd166, #9c8bff)",
                color: "#12151f",
                fontSize: 30,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              {leaderImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Satori (next/og) renders its own <img>, not the DOM element
                <img
                  src={leaderImageUrl}
                  width={72}
                  height={72}
                  style={{ objectFit: "cover" }}
                  alt=""
                />
              ) : (
                leader.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 22, color: "#97a0b3" }}>
                🥇 #1 right now
              </span>
              <span style={{ fontSize: 34, fontWeight: 800, color: "#f3f5fa" }}>
                {leader.name}
              </span>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 28, color: "#97a0b3" }}>
            The board is empty — $5 takes #1.
          </div>
        )}
      </div>
    ),
    { ...size },
  );
}
