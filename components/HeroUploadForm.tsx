"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";

export function HeroUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setStatus("saving");

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/hero", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setStatus(res.ok ? "done" : "error");
    if (res.ok) setFile(null);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-card shadow-sm p-6 space-y-4">
      <div>
        <label className="block font-body text-sm text-ink mb-1">Landing Page Hero Photo</label>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full font-body text-sm"
        />
        <p className="font-body text-xs text-muted mt-1">
          Replaces the current hero photo immediately across the live site.
        </p>
      </div>

      {status === "error" && (
        <p className="font-body text-sm text-red-600">Upload failed — please try again.</p>
      )}
      {status === "done" && (
        <p className="font-body text-sm text-green-700">Hero photo updated.</p>
      )}

      <button
        type="submit"
        disabled={status === "saving" || !file}
        className="w-full bg-accent text-white font-body font-medium min-h-[44px] rounded-card active:scale-[0.98] transition-transform disabled:opacity-50"
      >
        {status === "saving" ? "Uploading..." : "Set Hero Photo"}
      </button>
    </form>
  );
}
