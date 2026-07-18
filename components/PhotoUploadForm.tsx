"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Student } from "@/lib/types";
import { StudentPicker } from "@/components/StudentPicker";

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
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setStatus(res.ok ? "done" : "error");
  }

  function reset() {
    setFile(null);
    setStudentId("");
    setCaption("");
    setStatus("idle");
  }

  if (status === "done") {
    return (
      <div className="bg-surface rounded-card shadow-sm p-6 text-center">
        <p className="font-body text-ink mb-4">Photo uploaded successfully.</p>
        <button onClick={reset} className="btn-secondary">
          Upload Another
        </button>
      </div>
    );
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
          Assign to Student (optional)
        </label>
        <StudentPicker students={students} value={studentId} onChange={setStudentId} />
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

      <button
        type="submit"
        disabled={status === "saving" || !file}
        className="btn-primary w-full disabled:active:scale-100"
      >
        {status === "saving" ? "Uploading..." : "Upload Photo"}
      </button>
    </form>
  );
}
