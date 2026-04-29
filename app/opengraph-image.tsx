import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Ksour — A synthesis archive of earthen architectural heritage";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#f4ede1",
          color: "#2b2520",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#b8543a",
            fontFamily: "monospace",
          }}
        >
          Ksour
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.08,
              fontWeight: 400,
              maxWidth: 1000,
            }}
          >
            A synthesis archive of earthen architectural heritage across the
            Saharan-Maghreb region.
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#5c5249",
              maxWidth: 900,
            }}
          >
            Kasbahs · ksour · igherman · agadirs · tighremts · ghorfas
          </div>
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#7a6e63",
            fontFamily: "monospace",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>ksour.org</span>
          <span>Morocco · Mauritania · Algeria · Libya · Tunisia · Mali · Niger</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
