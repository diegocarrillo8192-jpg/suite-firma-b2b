import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const dynamic = "force-static";

const Swoosh = (
  <svg viewBox="0 0 120 120" width={92} height={92}>
    <path
      d="M30 84 C 36 68, 52 60, 50 44 C 49 34, 68 26, 72 34 C 74 40, 78 38, 80 40 C 82 52, 74 72, 62 84"
      fill="none"
      stroke="#ffffff"
      strokeWidth={7}
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
);

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0f172a",
          color: "#e2e8f0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(99,102,241,0.18), transparent 45%), linear-gradient(90deg, rgba(37,99,235,0.1), transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 190,
            background:
              "linear-gradient(180deg, transparent, rgba(99,102,241,0.10))",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "72px 80px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", gap: 28 }}>
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #6366f1, #2563eb)",
                boxShadow:
                  "0 24px 60px rgba(30,27,75,0.6), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              {Swoosh}
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: -1,
                }}
              >
                Suite Firma B2B
              </div>
              <div style={{ fontSize: 22, color: "#94a3b8" }}>
                Generador de firmas · Lienzo digital · Extractor PNG
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              maxWidth: 760,
            }}
          >
            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: "#e2e8f0",
              }}
            >
              Firmas profesionales para correo electrónico
            </div>
            <div style={{ fontSize: 22, color: "#64748b", lineHeight: 1.5 }}>
              HTML para Gmail y Outlook · Firma digital táctil en HD · Fotos
              con firmas en papel a PNG con transparencia real. Todo procesado
              100% en tu navegador.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              marginTop: 56,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: "#34d399",
              }}
            />
            <div style={{ fontSize: 20, color: "#94a3b8" }}>
              Procesamiento 100% local · tus datos nunca salen de tu
              dispositivo
            </div>
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