"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MemoryWallMessage } from "@/lib/types";

const MAX_PREVIEW_LENGTH = 140;

function truncateAtWord(text: string, maxLength: number): { preview: string; wasTruncated: boolean } {
  if (text.length <= maxLength) {
    return { preview: text, wasTruncated: false };
  }
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  const safeCut = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return { preview: safeCut.trimEnd() + "…", wasTruncated: true };
}

export function HomeMemoryRotator({ messages }: { messages: MemoryWallMessage[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || messages.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, messages.length]);

  if (messages.length === 0) return null;

  function goTo(i: number) {
    setIndex(i);
    setPaused(true);
  }

  return (
    <section className="px-6 py-16 max-w-xl mx-auto text-center">
      <h2 className="font-heading text-2xl text-ink mb-6">Words of Love</h2>

      <div className="relative h-64 overflow-hidden">
        {messages.map((msg, i) => {
          const { preview, wasTruncated } = truncateAtWord(msg.message, MAX_PREVIEW_LENGTH);

          return (
            <div
              key={msg.id}
              className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none flex flex-col items-center justify-center bg-surface rounded-card shadow-sm px-6 py-6 overflow-hidden ${
                i === index ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <p className="font-body text-ink text-base italic leading-relaxed max-w-sm mx-auto break-words line-clamp-4">
                &quot;{preview}&quot;
              </p>
              <p className="font-body text-sm text-muted mt-3 shrink-0">— {msg.author_name}</p>
              {wasTruncated && (
                <Link
                  href="/memory-wall"
                  className="font-body text-xs text-accent underline mt-1 shrink-0"
                >
                  Read full message
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {messages.length > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => goTo((index - 1 + messages.length) % messages.length)}
            aria-label="Previous message"
            className="w-10 h-10 bg-surface shadow-sm rounded-full flex items-center justify-center text-accent"
          >
            ‹
          </button>
          <button
            onClick={() => goTo((index + 1) % messages.length)}
            aria-label="Next message"
            className="w-10 h-10 bg-surface shadow-sm rounded-full flex items-center justify-center text-accent"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
