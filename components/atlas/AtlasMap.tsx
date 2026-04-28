"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { AtlasEntity, Condition } from "@/lib/types";

interface Props {
  sites: AtlasEntity[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const conditionColors: Record<Condition, string> = {
  intact: "#16a34a",
  restored: "#2563eb",
  partial: "#ca8a04",
  ruin: "#dc2626",
  unknown: "#737373",
};

export default function AtlasMap({ sites, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [tokenMissing, setTokenMissing] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setTokenMissing(true);
      return;
    }
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-5, 30],
      zoom: 4,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    sites.forEach((site) => {
      const el = document.createElement("div");
      el.className = "ksour-marker";
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.borderRadius = "50%";
      el.style.background = conditionColors[site.condition];
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.25)";
      el.style.cursor = "pointer";
      el.style.transition = "transform 0.15s ease";

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.3)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = selectedId === site.id ? "scale(1.4)" : "scale(1)";
      });
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelect(site.id);
      });

      const marker = new mapboxgl.Marker(el).setLngLat([site.lng, site.lat]).addTo(map);

      markersRef.current.set(site.id, marker);
    });

    if (sites.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      sites.forEach((s) => bounds.extend([s.lng, s.lat]));
      map.fitBounds(bounds, { padding: 60, duration: 600, maxZoom: 7 });
    } else if (sites.length === 1) {
      map.flyTo({ center: [sites[0].lng, sites[0].lat], zoom: 8, duration: 600 });
    }
  }, [sites, onSelect, selectedId]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      if (id === selectedId) {
        el.style.transform = "scale(1.4)";
        el.style.borderWidth = "3px";
      } else {
        el.style.transform = "scale(1)";
        el.style.borderWidth = "2px";
      }
    });

    if (selectedId && mapRef.current) {
      const site = sites.find((s) => s.id === selectedId);
      if (site) {
        mapRef.current.flyTo({
          center: [site.lng, site.lat],
          zoom: Math.max(mapRef.current.getZoom(), 6),
          duration: 600,
        });
      }
    }
  }, [selectedId, sites]);

  if (tokenMissing) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-codebg border border-border">
        <div className="text-center max-w-prose px-6">
          <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-2">
            Mapbox token missing
          </p>
          <p className="text-sm text-secondary">
            Add{" "}
            <code className="font-mono bg-white px-1 py-0.5 border border-border">
              NEXT_PUBLIC_MAPBOX_TOKEN
            </code>{" "}
            to{" "}
            <code className="font-mono bg-white px-1 py-0.5 border border-border">
              .env.local
            </code>{" "}
            to enable the map.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
