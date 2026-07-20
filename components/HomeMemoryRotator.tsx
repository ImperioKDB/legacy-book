"use client";

import { useEffect, useState } from "react";
import { MemoryWallMessage } from "@/lib/types";

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

      <div className="relative min-h-[180px] flex items-center justify-center">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none flex flex-col items-center justify-center bg-surface rounded-card shadow-sm p-6 ${
              i === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <p className="font-body text-ink text-lg italic leading-relaxed">
              &quot;{msg.message}&quot;
            </p>
            <p className="font-body text-sm text-muted mt-4">— {msg.author_name}</p>
          </div>
        ))}
      </div>

      {messages.length > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => goTo((index - 1 + messages.length) % messages.length)}
            aria-label="Previous message"
            className="w-9 h-9 flex items-center justify-center text-accent"
          >
            ‹
          </button>
          <button
            onClick={() => goTo((index + 1) % messages.length)}
            aria-label="Next message"
            className="w-9 h-9 flex items-center justify-center text-accent"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
