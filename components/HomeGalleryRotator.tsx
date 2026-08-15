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

  function goTo(i: number) {
    setIndex(i);
    setPaused(true);
  }

  return (
    <section className="px-6 py-16 max-w-2xl mx-auto text-center">
      <h2 className="font-heading text-2xl text-ink mb-6">Moments from the Year</h2>

      <div className="relative w-full aspect-[4/3] rounded-card overflow-hidden shadow-[0_20px_50px_-20px_rgba(43,36,32,0.3)]">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Blurred fill layer — same photo, zoomed and blurred, sits behind */}
            <Image
              src={photo.image_url}
              alt=""
              aria-hidden="true"
              fill
              className="object-cover scale-110 blur-2xl brightness-75"
            />
            {/* Sharp full photo on top, never cropped */}
            <Image
              src={photo.image_url}
              alt={photo.caption ?? "Gallery photo"}
              fill
              className="object-contain relative"
            />
          </div>
        ))}

        {photos.length > 1 && (
          <>
            <button
              onClick={() => goTo((index - 1 + photos.length) % photos.length)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center text-ink z-10"
            >
              ‹
            </button>
            <button
              onClick={() => goTo((index + 1) % photos.length)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center text-ink z-10"
            >
              ›
            </button>
          </>
        )}
      </div>
    </section>
  );
}
