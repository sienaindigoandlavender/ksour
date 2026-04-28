import clsx, { type ClassValue } from "clsx";

export function cn(...args: ClassValue[]) {
  return clsx(...args);
}

export function proseDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return String(input);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function isoDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toISOString().slice(0, 10);
}
