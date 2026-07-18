"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Photo } from "@/lib/types";

export function PhotoLightbox({ photos }: { photos: Photo[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
            onClick={close}
          >
            <div
              className="relative max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[activeIndex].image_url}
                alt={photos[activeIndex].caption ?? "Gallery photo"}
                width={800}
                height={800}
                className="w-full h-auto rounded-card"
              />
              {photos[activeIndex].caption && (
                <p className="font-body text-white text-sm text-center mt-3">
                  {photos[activeIndex].caption}
                </p>
              )}

              <button
                onClick={close}
                aria-label="Close"
                className="absolute -top-3 -right-3 w-11 h-11 bg-white rounded-full flex items-center justify-center text-ink font-bold"
              >
                ✕
              </button>

              {photos.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center text-ink"
                  >
                    ‹
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center text-ink"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
