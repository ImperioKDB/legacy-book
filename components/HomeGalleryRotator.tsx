"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types";

const AUTOPLAY_MS = 4000;
const MAX_VISIBLE_OFFSET = 2;
const SWIPE_THRESHOLD = 40;

function circularOffset(i: number, index: number, length: number) {
  let offset = i - index;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function cardStyle(offset: number): React.CSSProperties {
  const abs = Math.abs(offset);
  const scale = abs === 0 ? 1 : abs === 1 ? 0.78 : 0.6;
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.85 : 0.5;
  const translateX = offset * 58;

  return {
    transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale})`,
    opacity,
    zIndex: 100 - abs,
  };
}

export function HomeGalleryRotator({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused || photos.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, photos.length]);

  if (photos.length === 0) return null;

  function goTo(i: number) {
    setIndex(((i % photos.length) + photos.length) % photos.length);
    setPaused(true);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      goTo(index + (deltaX < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  }

  const visible = photos
    .map((photo, i) => ({ photo, i, offset: circularOffset(i, index, photos.length) }))
    .filter(({ offset }) => Math.abs(offset) <= MAX_VISIBLE_OFFSET);

  const activePhoto = photos[index];

  return (
    <section className="px-6 py-16 max-w-3xl mx-auto text-center">
      <h2 className="font-heading text-2xl text-ink mb-8">Moments from the Year</h2>

      <div
        className="relative w-full h-72 sm:h-96"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="sr-only" aria-live="polite">
          {activePhoto.caption ?? `Photo ${index + 1} of ${photos.length}`}
        </div>

        {visible.map(({ photo, i, offset }) => {
          const isCenter = offset === 0;

          return (
            <button
              key={photo.id}
              type="button"
              aria-label={isCenter ? undefined : `Go to photo ${i + 1} of ${photos.length}`}
              aria-current={isCenter ? "true" : undefined}
              aria-hidden={isCenter ? undefined : "true"}
              tabIndex={isCenter ? -1 : 0}
              onClick={() => !isCenter && goTo(i)}
              className="absolute left-1/2 top-1/2 w-[70%] aspect-[4/3] rounded-card overflow-hidden shadow-[0_20px_50px_-20px_rgba(43,36,32,0.35)] transition-all duration-500 ease-out motion-reduce:transition-none"
              style={cardStyle(offset)}
            >
              <Image
                src={photo.image_url}
                alt={photo.caption ?? "Gallery photo"}
                fill
                sizes="(max-width: 640px) 70vw, 500px"
                className="object-cover"
                priority={isCenter}
              />
              {!isCenter && <div className="absolute inset-0 bg-ink/15" />}
            </button>
          );
        })}
      </div>

      {photos.length > 1 && (
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Previous photo"
            className="w-11 h-11 bg-white shadow-sm rounded-full flex items-center justify-center text-accent shrink-0"
          >
            ‹
          </button>

          {photos.length <= 8 ? (
            <div className="flex gap-1.5">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-5 bg-accent" : "w-1.5 bg-accent/30"
                  }`}
                />
              ))}
            </div>
          ) : (
            <span className="font-body text-sm text-muted tabular-nums">
              {index + 1} / {photos.length}
            </span>
          )}

          <button
            onClick={() => goTo(index + 1)}
            aria-label="Next photo"
            className="w-11 h-11 bg-white shadow-sm rounded-full flex items-center justify-center text-accent shrink-0"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
