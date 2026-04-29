"use client";

import { useEffect, useRef, useState } from "react";
import type { AtlasPoint, Condition } from "@/lib/types";

const conditionColors: Record<Condition, string> = {
  intact: "#16a34a",
  restored: "#2563eb",
  partial: "#ca8a04",
  ruin: "#dc2626",
  unknown: "#737373",
};

interface Props {
  points: AtlasPoint[];
}

export default function HomeAtlasMap({ points }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tokenMissing, setTokenMissing] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setTokenMissing(true);
      return;
    }
    if (!containerRef.current) return;

    let cleanup = () => {};

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container: containerRef.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-5, 27],
        zoom: 3.2,
        attributionControl: false,
        interactive: true,
      });
      map.addControl(
        new mapboxgl.AttributionControl({ compact: true }),
        "bottom-right"
      );

      points.forEach((p) => {
        const slug = p.id.replace(/^atlas-/, "");

        const el = document.createElement("div");
        el.style.width = "12px";
        el.style.height = "12px";
        el.style.borderRadius = "50%";
        el.style.background = conditionColors[p.condition] ?? "#737373";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.25)";
        el.style.cursor = "pointer";
        el.style.transition = "transform 0.15s ease";
        el.setAttribute("aria-label", p.name);

        const popup = new mapboxgl.Popup({
          offset: 12,
          closeButton: false,
          closeOnClick: false,
        }).setText(p.name);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([p.lng, p.lat])
          .setPopup(popup)
          .addTo(map);

        let popupVisible = false;
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.3)";
          if (!popupVisible) {
            marker.togglePopup();
            popupVisible = true;
          }
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
          if (popupVisible) {
            marker.togglePopup();
            popupVisible = false;
          }
        });
        el.addEventListener("click", () => {
          window.location.href = `/atlas/${slug}`;
        });
      });

      if (points.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        points.forEach((p) => bounds.extend([p.lng, p.lat]));
        map.fitBounds(bounds, { padding: 40, maxZoom: 5, duration: 0 });
      }

      cleanup = () => map.remove();
    })();

    return () => cleanup();
  }, [points]);

  if (tokenMissing) {
    return (
      <div className="h-80 lg:h-[28rem] w-full flex items-center justify-center bg-codebg border border-border">
        <p className="font-mono text-meta text-tertiary text-center px-6 max-w-prose">
          Map requires <code className="font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</code> in <code className="font-mono">.env.local</code>.
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className="h-80 lg:h-[28rem] w-full border border-border" />;
}
