"use client";

import { useEffect, useState } from "react";
import type { AtlasPoint } from "@/lib/types";

interface Props {
  token?: string;
}

export default function AtlasMap({ token }: Props) {
  const [points, setPoints] = useState<AtlasPoint[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/atlas-points.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: AtlasPoint[]) => setPoints(data))
      .catch(() => setPoints([]))
      .finally(() => setLoaded(true));
  }, []);

  if (!token) {
    return (
      <div className="rule-top rule-bottom bg-codebg">
        <div className="mx-auto max-w-page px-6 py-16">
          <p className="meta mb-3">Map</p>
          <p className="text-secondary text-sm leading-relaxed max-w-prose">
            Mapbox layer pending token. Set <code>NEXT_PUBLIC_MAPBOX_TOKEN</code>{" "}
            in <code>.env.local</code> to enable the geographic view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rule-top rule-bottom bg-codebg">
      <div className="mx-auto max-w-page px-6 py-16">
        <p className="meta mb-3">Map</p>
        <p className="text-secondary text-sm leading-relaxed">
          {loaded
            ? `${points.length} site(s) ready to render. Mapbox component implementation pending.`
            : "Loading atlas points…"}
        </p>
      </div>
    </div>
  );
}
