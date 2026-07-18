"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Student } from "@/lib/types";

export function LetterForm({ students }: { students: Student[] }) {
  const [studentId, setStudentId] = useState("");
  const [letterText, setLetterText] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");

    const { error } = await supabase.from("letters").insert({
      student_id: studentId,
      letter_text: letterText,
      unlock_date: unlockDate,
    });

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="bg-surface rounded-card shadow-sm p-6 text-center">
        <p className="font-body text-ink">
          Your letter has been saved. It will unlock on the date you chose.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-card shadow-sm p-6 space-y-4">
      <div>
        <label className="block font-body text-sm text-ink mb-1">Which profile is this for? *</label>
        <select
          required
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body bg-white"
        >
          <option value="" disabled>
            Select your name
          </option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-body text-sm text-ink mb-1">Your Letter *</label>
        <textarea
          required
          value={letterText}
          onChange={(e) => setLetterText(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 rounded-card border border-muted/30 font-body"
        />
      </div>

      <div>
        <label className="block font-body text-sm text-ink mb-1">Unlock Date *</label>
        <input
          type="date"
          required
          min={today}
          value={unlockDate}
          onChange={(e) => setUnlockDate(e.target.value)}
          className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body"
        />
        <p className="font-body text-xs text-muted mt-1">
          Your letter stays private until this date, then anyone can read it.
        </p>
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
        {status === "saving" ? "Saving..." : "Save My Letter"}
      </button>
    </form>
  );
}
