"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types";

export function PhotoLightbox({ photos }: { photos: Photo[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());
  const touchStartX = useRef<number | null>(null);

  function close() {
    setActiveIndex(null);
  }

  function next() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % photos.length);
  }

  function prev() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + photos.length) % photos.length);
  }

  function markLoaded(id: string) {
    setLoadedIds((prev) => new Set(prev).add(id));
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 50;

    if (deltaX > SWIPE_THRESHOLD) {
      prev();
    } else if (deltaX < -SWIPE_THRESHOLD) {
      next();
    }
    touchStartX.current = null;
  }

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;
  const isLoaded = activePhoto ? loadedIds.has(activePhoto.id) : false;

  return (
    <>
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setActiveIndex(i)}
            className="block w-full rounded-card overflow-hidden bg-accent-soft break-inside-avoid"
          >
            <Image
              src={photo.image_url}
              alt={photo.caption ?? "Gallery photo"}
              width={400}
              height={400}
              className="w-full h-auto object-cover"
            />
          </button>
        ))}
      </div>

      {activePhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center px-4"
          style={{ height: "100dvh", width: "100vw" }}
          onClick={close}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full rounded-card overflow-hidden">
              {/* Same photo, small size — likely already cached from the grid,
                  so it appears near-instantly and gives visual continuity
                  instead of a blank stall. */}
              <Image
                src={activePhoto.image_url}
                alt=""
                aria-hidden="true"
                width={40}
                height={40}
                className={`w-full h-auto blur-xl scale-105 transition-opacity duration-500 ${
                  isLoaded ? "opacity-0" : "opacity-100"
                }`}
              />

              {/* Full-resolution photo, fades in sharp on top once ready */}
              <Image
                key={activePhoto.id}
                src={activePhoto.image_url}
                alt={activePhoto.caption ?? "Gallery photo"}
                width={800}
                height={800}
                onLoad={() => markLoaded(activePhoto.id)}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>

            {activePhoto.caption && (
              <p className="font-body text-white text-sm text-center mt-3">
                {activePhoto.caption}
              </p>
            )}

            <p className="font-body text-white/60 text-xs text-center mt-2">
              {activeIndex! + 1} of {photos.length}
            </p>

            <button
              onClick={close}
              aria-label="Close"
              className="absolute -top-3 -right-3 w-11 h-11 bg-white rounded-full flex items-center justify-center text-ink font-bold z-10"
            >
              ✕
            </button>

            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center text-ink z-10"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center text-ink z-10"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
