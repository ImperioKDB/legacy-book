"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types";

const QUILT_WIDTHS = ["w-36", "w-52", "w-44", "w-60", "w-40"];

export function PhotoLightbox({ groups }: { groups: Photo[][] }) {
  const photos = groups.flat();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());
  const touchStartX = useRef<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  function close() {
    setActiveIndex(null);
  }

  function next() {
    setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }

  function prev() {
    setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
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
    if (deltaX > SWIPE_THRESHOLD) prev();
    else if (deltaX < -SWIPE_THRESHOLD) next();
    touchStartX.current = null;
  }

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") close();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  // Scale/brighten each tile based on how centered it is within its
  // own horizontal strip, using IntersectionObserver — the same proven
  // mechanism as ScrollFade elsewhere. Styles are set directly on the
  // DOM node (not via React state) to avoid a re-render on every scroll
  // tick across a gallery with 100+ photos.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const strips = gridRef.current?.querySelectorAll<HTMLDivElement>(
      ".gallery-scroll-strip"
    );
    if (!strips) return;

    const observers: IntersectionObserver[] = [];
    const thresholdSteps = Array.from({ length: 21 }, (_, i) => i / 20);

    strips.forEach((strip) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;
            const ratio = entry.intersectionRatio;
            const scale = 0.85 + ratio * 0.15;
            const brightness = 0.8 + ratio * 0.2;
            el.style.transform = `scale(${scale})`;
            el.style.filter = `brightness(${brightness})`;
          });
        },
        { root: strip, threshold: thresholdSteps }
      );

      strip.querySelectorAll("button").forEach((btn) => observer.observe(btn));
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [groups]);

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;
  const isLoaded = activePhoto ? loadedIds.has(activePhoto.id) : false;

  const nextPhoto =
    activeIndex !== null && photos.length > 1 ? photos[(activeIndex + 1) % photos.length] : null;
  const prevPhoto =
    activeIndex !== null && photos.length > 1
      ? photos[(activeIndex - 1 + photos.length) % photos.length]
      : null;

  let runningIndex = 0;

  return (
    <>
      <div ref={gridRef} className="space-y-8">
        {groups.map((group, groupIdx) => {
          const startIndex = runningIndex;
          runningIndex += group.length;

          return (
            <div
              key={groupIdx}
              className="gallery-scroll-strip flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 px-6"
            >
              {group.map((photo, i) => (
                <button
                  key={photo.id}
                  onClick={() => setActiveIndex(startIndex + i)}
                  className={`relative shrink-0 h-52 ${QUILT_WIDTHS[i % QUILT_WIDTHS.length]} snap-center rounded-card overflow-hidden bg-accent-soft transition-[transform,filter] duration-200 ease-out active:scale-[0.96]`}
                >
                  <Image
                    src={photo.image_url}
                    alt={photo.caption ?? "Gallery photo"}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {activePhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center px-4"
          style={{ height: "100dvh", width: "100vw" }}
          onClick={close}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {nextPhoto && (
            <Image src={nextPhoto.image_url} alt="" aria-hidden="true" width={800} height={800} className="hidden" />
          )}
          {prevPhoto && (
            <Image src={prevPhoto.image_url} alt="" aria-hidden="true" width={800} height={800} className="hidden" />
          )}

          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full rounded-card overflow-hidden">
              <Image
                src={activePhoto.image_url}
                alt=""
                aria-hidden="true"
                width={40}
                height={40}
                className={`w-full h-auto blur-xl scale-105 transition-opacity duration-500 ${isLoaded ? "opacity-0" : "opacity-100"}`}
              />
              <Image
                key={activePhoto.id}
                src={activePhoto.image_url}
                alt={activePhoto.caption ?? "Gallery photo"}
                width={800}
                height={800}
                onLoad={() => markLoaded(activePhoto.id)}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
              />
            </div>

            {activePhoto.caption && (
              <p className="font-body text-white text-sm text-center mt-3">{activePhoto.caption}</p>
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
