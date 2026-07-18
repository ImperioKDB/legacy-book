"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types";

export function HomeGalleryRotator({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || photos.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, photos.length]);

  if (photos.length === 0) return null;

  return (
    <section className="px-6 py-16 max-w-2xl mx-auto text-center">
      <h2 className="font-heading text-2xl text-ink mb-6">Moments from the Year</h2>

      <div className="relative w-full aspect-[4/3] rounded-card overflow-hidden bg-accent-soft shadow-[0_20px_50px_-20px_rgba(43,36,32,0.3)]">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={photo.image_url}
              alt={photo.caption ?? "Gallery photo"}
              fill
              className="object-cover"
            />
          </div>
        ))}

        {photos.length > 1 && (
          <>
            <button
              onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center text-ink"
            >
              ‹
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % photos.length)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center text-ink"
            >
              ›
            </button>
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
              className="absolute bottom-2 right-2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-ink text-sm"
            >
              {paused ? "▶" : "❚❚"}
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === index ? "bg-accent" : "bg-accent-soft"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
