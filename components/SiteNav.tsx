"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
    <>
      <nav className="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-accent-soft">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative w-14 h-14 shrink-0">
              <Image
                src="https://gwxiwvpqmcrkrdiqaokp.supabase.co/storage/v1/object/public/legacy-book-assets/site/file_0000000054088246b79aebd9c67c00f7.png"
                alt="TACSFON"
                fill
                className="object-contain"
              />
            </div>
            <span className="sr-only">The Legacy Book — Home</span>
          </Link>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="w-11 h-11 flex items-center justify-center text-ink"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className="block h-0.5 bg-ink" />
              <span className="block h-0.5 bg-ink" />
              <span className="block h-0.5 bg-ink" />
            </div>
          </button>
        </div>
      </nav>

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity duration-300 motion-reduce:transition-none ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed top-0 right-0 z-50 h-full w-72 max-w-[80vw] bg-bg shadow-xl
          transform transition-transform duration-300 ease-out motion-reduce:transition-none
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-accent-soft">
          <span className="font-heading text-lg text-ink">Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="w-11 h-11 flex items-center justify-center text-ink text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col px-6 py-4">
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
    </>
  );
}
