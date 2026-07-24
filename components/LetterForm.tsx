"use client";

import { useState } from "react";

export function LetterForm() {
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [letterText, setLetterText] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");

    const res = await fetch("/api/letters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName,
        letter_text: letterText,
        unlock_date: unlockDate,
        contact_number: contactNumber,
        email,
      }),
    });

    if (res.ok) {
      setStatus("done");
    } else {
      const json = await res.json();
      setErrorMsg(json.error ?? "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-surface rounded-card shadow-sm p-6 text-center">
        <p className="font-body text-ink mb-1">Your letter has been received.</p>
        <p className="font-body text-sm text-muted">
          We'll reach out to confirm on WhatsApp before it's officially saved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-card shadow-sm p-6 space-y-4">
      <div>
        <label className="block font-body text-sm text-ink mb-1">Your Full Name *</label>
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Type your full name"
          className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body"
        />
        <p className="font-body text-xs text-muted mt-1">
          Only Final Year Brethren can use this form.
        </p>
      </div>

      <div>
        <label className="block font-body text-sm text-ink mb-1">WhatsApp Number *</label>
        <input
          required
          type="tel"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="We'll confirm your submission here"
          className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body"
        />
      </div>

      <div>
        <label className="block font-body text-sm text-ink mb-1">Email *</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body"
        />
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
          Once confirmed, your letter stays private until this date.
        </p>
      </div>

      <p className="font-body text-xs text-muted bg-accent-soft/40 rounded-card p-3">
        We'll confirm this submission with you directly on WhatsApp before it's saved. Nobody else can read your letter — even our admin team only sees your name and contact details, never the letter itself.
      </p>

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-card p-3">
          <p className="font-body text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="btn-primary w-full disabled:active:scale-100"
      >
        {status === "saving" ? "Submitting..." : "Submit for Confirmation"}
      </button>
    </form>
  );
}
