import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(640px 340px at 50% 18%, rgba(99,102,241,0.22), transparent 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(2,6,23,0.5), transparent 38%, transparent 72%, rgba(2,6,23,0.55))",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(2,6,23,0.5), transparent 30%, transparent 70%, rgba(2,6,23,0.5))",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 44,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #6366f1, #2563eb)",
              boxShadow:
                "0 32px 90px rgba(30,27,75,0.75), inset 0 2px 0 rgba(255,255,255,0.3)",
            }}
          >
            <svg viewBox="0 0 120 120" width={116} height={116}>
              <path
                d="M30 84 C 36 68, 52 60, 50 44 C 49 34, 68 26, 72 34 C 74 40, 78 38, 80 40 C 82 52, 74 72, 62 84"
                fill="none"
                stroke="#ffffff"
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 98 L 98 98"
                fill="none"
                stroke="#ffffff"
                strokeOpacity={0.55}
                strokeWidth={6}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 74,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -2,
            }}
          >
            Suite Firma&nbsp;
            <span style={{ color: "#818cf8" }}>B2B</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}