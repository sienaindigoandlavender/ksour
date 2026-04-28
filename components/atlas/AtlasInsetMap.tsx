"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

interface Props {
  lat: number;
  lng: number;
  name: string;
}

export default function AtlasInsetMap({ lat, lng }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tokenMissing, setTokenMissing] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setTokenMissing(true);
      return;
    }
    if (!containerRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [lng, lat],
      zoom: 8,
      interactive: true,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    const el = document.createElement("div");
    el.style.width = "14px";
    el.style.height = "14px";
    el.style.borderRadius = "50%";
    el.style.background = "#b8543a";
    el.style.border = "2px solid white";
    el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.25)";

    new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);

    return () => {
      map.remove();
    };
  }, [lat, lng]);

  if (tokenMissing) {
    return (
      <div className="h-48 w-full flex items-center justify-center bg-codebg border border-border">
        <p className="font-mono text-meta text-tertiary">Map requires Mapbox token</p>
      </div>
    );
  }

  return <div ref={containerRef} className="h-48 w-full border border-border" />;
}
