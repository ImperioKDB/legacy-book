"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/students", label: "Students" },
  { href: "/gallery", label: "Gallery" },
  { href: "/memory-wall", label: "Memory Wall" },
  { href: "/letters", label: "Letters" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-accent-soft">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading text-lg text-ink">
          The Legacy Book
        </Link>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="w-11 h-11 flex items-center justify-center text-ink"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`block h-0.5 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`block h-0.5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`block h-0.5 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-accent-soft bg-bg">
          <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-body text-ink py-3 border-b border-accent-soft/50 last:border-0 min-h-[44px] flex items-center"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
