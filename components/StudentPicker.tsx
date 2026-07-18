"use client";

import { useEffect, useRef, useState } from "react";
import { Student } from "@/lib/types";

export function StudentPicker({
  students,
  value,
  onChange,
}: {
  students: Student[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = students.find((s) => s.id === value);
  const filtered = students.filter((s) =>
    s.full_name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body bg-white text-left flex items-center justify-between"
      >
        <span className={selected ? "text-ink" : "text-muted"}>
          {selected ? selected.full_name : "General gallery photo"}
        </span>
        <span className="text-muted text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-card border border-muted/30 shadow-md max-h-64 overflow-y-auto">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search..."
            className="w-full min-h-[44px] px-3 font-body text-sm border-b border-muted/20 outline-none"
          />
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
              setQuery("");
            }}
            className="w-full text-left px-3 py-3 font-body text-sm text-muted hover:bg-accent-soft/40 min-h-[44px]"
          >
            General gallery photo
          </button>
          {filtered.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                onChange(s.id);
                setOpen(false);
                setQuery("");
              }}
              className="w-full text-left px-3 py-3 font-body text-sm text-ink hover:bg-accent-soft/40 min-h-[44px]"
            >
              {s.full_name}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-3 font-body text-sm text-muted">No matches.</p>
          )}
        </div>
      )}
    </div>
  );
}
