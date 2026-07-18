"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Student } from "@/lib/types";
import { StudentPicker } from "@/components/StudentPicker";

export function PhotoUploadForm({ students }: { students: Student[] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [studentId, setStudentId] = useState("");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [failedCount, setFailedCount] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;

    setStatus("saving");
    setProgress({ done: 0, total: files.length });
    setFailedCount(0);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    let failures = 0;

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("student_id", studentId);
      formData.append("caption", caption);

      try {
        const res = await fetch("/api/admin/photos", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) failures++;
      } catch {
        failures++;
      }

      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    setFailedCount(failures);
    setStatus("done");
  }

  function reset() {
    setFiles([]);
    setStudentId("");
    setCaption("");
    setStatus("idle");
    setProgress({ done: 0, total: 0 });
    setFailedCount(0);
  }

  if (status === "done") {
    const successCount = progress.total - failedCount;
    return (
      <div className="bg-surface rounded-card shadow-sm p-6 text-center">
        <p className="font-body text-ink mb-1">
          {successCount} of {progress.total} photo{progress.total !== 1 ? "s" : ""} uploaded.
        </p>
        {failedCount > 0 && (
          <p className="font-body text-sm text-red-600 mb-2">
            {failedCount} failed — try uploading those again.
          </p>
        )}
        <button onClick={reset} className="btn-secondary mt-3">
          Upload More
        </button>
      </div>
    );
  }

  if (status === "saving") {
    return (
      <div className="bg-surface rounded-card shadow-sm p-6 text-center">
        <p className="font-body text-ink mb-3">
          Uploading {progress.done} of {progress.total}...
        </p>
        <div className="w-full h-2 bg-accent-soft rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(progress.done / progress.total) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-card shadow-sm p-6 space-y-4">
      <div>
        <label className="block font-body text-sm text-ink mb-1">Photos *</label>
        <input
          type="file"
          accept="image/*"
          multiple
          required
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="w-full font-body text-sm"
        />
        {files.length > 0 && (
          <p className="font-body text-xs text-muted mt-1">
            {files.length} photo{files.length !== 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      <div>
        <label className="block font-body text-sm text-ink mb-1">
          Assign to Student (optional — applies to all selected photos)
        </label>
        <StudentPicker students={students} value={studentId} onChange={setStudentId} />
      </div>

      <div>
        <label className="block font-body text-sm text-ink mb-1">
          Caption (optional — applies to all selected photos)
        </label>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body"
        />
      </div>

      <button
        type="submit"
        disabled={files.length === 0}
        className="btn-primary w-full disabled:active:scale-100"
      >
        Upload {files.length > 0 ? `${files.length} Photo${files.length !== 1 ? "s" : ""}` : "Photos"}
      </button>
    </form>
  );
}
