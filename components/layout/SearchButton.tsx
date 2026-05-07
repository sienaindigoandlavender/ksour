"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchItem } from "@/lib/search";
import type { EntityType } from "@/lib/types";

const TYPE_LABEL: Record<EntityType, string> = {
  typology: "Typology",
  atlas: "Atlas",
  library: "Library",
  actor: "Actor",
  person: "Person",
  glossary: "Glossary",
  timeline: "Timeline",
  essay: "Essay",
};

const MAX_RESULTS = 12;

interface Props {
  index: SearchItem[];
}

export default function SearchButton({ index }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    const scored: { item: SearchItem; score: number }[] = [];
    for (const item of index) {
      let total = 0;
      let allMatched = true;
      for (const tok of tokens) {
        let best = 0;
        for (const kw of item.keywords) {
          if (kw === tok) best = Math.max(best, 100);
          else if (kw.startsWith(tok)) best = Math.max(best, 50);
          else if (kw.includes(tok)) best = Math.max(best, 10);
        }
        if (best === 0) {
          allMatched = false;
          break;
        }
        total += best;
      }
      if (allMatched) scored.push({ item, score: total });
    }
    return scored
      .sort(
        (a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name),
      )
      .slice(0, MAX_RESULTS)
      .map((x) => x.item);
  }, [query, index]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inField =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (!open) {
        if (e.key === "/" && !inField) {
          e.preventDefault();
          setOpen(true);
        } else if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen(true);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
    setActive(0);
  }

  function go(item: SearchItem) {
    close();
    router.push(item.url);
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(0, results.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) go(item);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the archive"
        title="Search (press /)"
        className="text-secondary hover:text-accent transition-colors flex items-center"
      >
        <SearchIcon />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search the archive"
          onClick={close}
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/30 px-4 pt-20 sm:pt-24"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-md border border-border bg-white shadow-xl flex flex-col"
          >
            <div className="border-b border-border px-4 py-3 flex items-center gap-3">
              <SearchIcon className="text-tertiary" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search sites, types, terms, sources, people…"
                className="flex-1 bg-transparent outline-none text-ink placeholder:text-tertiary text-base"
                aria-label="Search query"
                aria-controls="search-results"
                aria-activedescendant={
                  results[active] ? `search-result-${active}` : undefined
                }
              />
              <kbd className="font-mono text-meta text-tertiary border border-border rounded px-1.5 py-0.5">
                esc
              </kbd>
            </div>

            <div
              id="search-results"
              role="listbox"
              className="max-h-[60vh] overflow-y-auto"
            >
              {query.trim() === "" ? (
                <p className="px-4 py-6 text-meta text-tertiary font-mono">
                  Type to search across typology, atlas, library, actors,
                  people, glossary, essays, and timeline.
                </p>
              ) : results.length === 0 ? (
                <p className="px-4 py-6 text-meta text-tertiary font-mono">
                  No matches.
                </p>
              ) : (
                <ul>
                  {results.map((item, i) => (
                    <li key={`${item.type}:${item.id}`}>
                      <button
                        id={`search-result-${i}`}
                        role="option"
                        aria-selected={i === active}
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(item)}
                        className={`w-full text-left px-4 py-3 flex items-baseline gap-3 ${
                          i === active ? "bg-codebg" : "hover:bg-codebg"
                        }`}
                      >
                        <span className="font-mono text-meta uppercase tracking-wide text-tertiary w-20 shrink-0">
                          {TYPE_LABEL[item.type]}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-ink truncate">
                            {item.name}
                          </span>
                          {item.detail ? (
                            <span className="block text-meta text-tertiary truncate">
                              {item.detail}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-border px-4 py-2 font-mono text-meta text-tertiary flex flex-wrap gap-x-4 gap-y-1">
              <span>
                <Kbd>↑</Kbd> <Kbd>↓</Kbd> navigate
              </span>
              <span>
                <Kbd>↵</Kbd> open
              </span>
              <span>
                <Kbd>/</Kbd> focus
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="border border-border rounded px-1 py-0.5 not-italic">
      {children}
    </kbd>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-5 h-5 ${className}`}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
