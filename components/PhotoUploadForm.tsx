"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Student } from "@/lib/types";

export function PhotoUploadForm({ students }: { students: Student[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [studentId, setStudentId] = useState("");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setStatus("saving");

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("student_id", studentId);
    formData.append("caption", caption);

    const res = await fetch("/api/admin/photos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      setStatus("done");
      setFile(null);
      setStudentId("");
      setCaption("");
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-card shadow-sm p-6 space-y-4">
      <div>
        <label className="block font-body text-sm text-ink mb-1">Photo *</label>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full font-body text-sm"
        />
      </div>

      <div>
        <label className="block font-body text-sm text-ink mb-1">
          Assign to Student (optional — leave blank for general gallery)
        </label>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body bg-white"
        >
          <option value="">General gallery photo</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-body text-sm text-ink mb-1">Caption (optional)</label>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body"
        />
      </div>

      {status === "error" && (
        <p className="font-body text-sm text-red-600">Upload failed — please try again.</p>
      )}
      {status === "done" && (
        <p className="font-body text-sm text-green-700">Photo uploaded.</p>
      )}

      <button
        type="submit"
        disabled={status === "saving" || !file}
        className="w-full bg-accent text-white font-body font-medium min-h-[44px] rounded-card disabled:opacity-50"
      >
        {status === "saving" ? "Uploading..." : "Upload Photo"}
      </button>
    </form>
  );
}
