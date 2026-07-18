"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";

export function MemoryWallForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");

    const { error } = await supabase.from("memory_wall").insert({
      author_name: authorName,
      message,
    });

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("done");
    setAuthorName("");
    setMessage("");
    onSubmitted();
  }

  if (status === "done") {
    return (
      <div className="bg-surface rounded-card shadow-sm p-6 text-center">
        <p className="font-body text-ink">
          Thank you — your message will appear once approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-card shadow-sm p-6 space-y-4">
      <div>
        <label className="block font-body text-sm text-ink mb-1">Your Name *</label>
        <input
          required
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body"
        />
      </div>

      <div>
        <label className="block font-body text-sm text-ink mb-1">Your Message *</label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          maxLength={500}
          className="w-full px-3 py-2 rounded-card border border-muted/30 font-body"
        />
      </div>

      {status === "error" && (
        <p className="font-body text-sm text-red-600">
          Something went wrong — please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full bg-accent text-white font-body font-medium min-h-[44px] rounded-card disabled:opacity-50"
      >
        {status === "saving" ? "Submitting..." : "Leave a Message"}
      </button>
    </form>
  );
}
