"use client";

interface Props {
  countries: string[];
  conditions: string[];
}

export default function AtlasFilters({ countries, conditions }: Props) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <label className="block">
        <span className="meta block mb-1">Country</span>
        <select className="w-full bg-background border border-rule px-3 py-2">
          <option value="">All</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="meta block mb-1">Condition</span>
        <select className="w-full bg-background border border-rule px-3 py-2">
          <option value="">All</option>
          {conditions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="meta block mb-1">UNESCO status</span>
        <select className="w-full bg-background border border-rule px-3 py-2">
          <option value="">All</option>
          <option value="world-heritage">World Heritage</option>
          <option value="tentative">Tentative</option>
          <option value="national-heritage">National heritage</option>
        </select>
      </label>
      <label className="block">
        <span className="meta block mb-1">Typology</span>
        <select className="w-full bg-background border border-rule px-3 py-2">
          <option value="">All</option>
        </select>
      </label>
    </div>
  );
}
