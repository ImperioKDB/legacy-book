"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { PendingLetter } from "@/lib/types";

export function LetterApprovalPanel() {
  const [letters, setLetters] = useState<PendingLetter[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLetters() {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch("/api/admin/letters", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const json = await res.json();
      setLetters(json.letters ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadLetters();
  }, []);

  async function handleApprove(id: string, name: string) {
    if (!confirm(`Confirm you've verified this with ${name} on WhatsApp, and approve their letter?`)) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    await fetch(`/api/admin/letters/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadLetters();
  }

  async function handleReject(id: string, name: string) {
    if (!confirm(`Reject and permanently delete this letter from ${name}? This cannot be undone.`)) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    await fetch(`/api/admin/letters/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadLetters();
  }

  if (loading) return <p className="font-body text-muted">Loading pending letters...</p>;
  if (letters.length === 0) return <p className="font-body text-muted">No letters awaiting confirmation.</p>;

  return (
    <div className="space-y-3">
      <p className="font-body text-xs text-muted bg-accent-soft/40 rounded-card p-3">
        Letter content is never shown here. Confirm identity via WhatsApp before approving.
      </p>
      {letters.map((l) => (
        <div key={l.id} className="bg-surface rounded-card shadow-sm p-4">
          <p className="font-body text-ink">{l.student_name}</p>
          <p className="font-body text-xs text-muted mt-1">
            Unlocks: {new Date(l.unlock_date).toLocaleDateString()}
          </p>
          {l.contact_number && (
            <p className="font-body text-xs text-muted">WhatsApp: {l.contact_number}</p>
          )}
          {l.email && <p className="font-body text-xs text-muted">Email: {l.email}</p>}
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => handleApprove(l.id, l.student_name)}
              className="btn-primary text-sm px-4 min-h-[36px]"
            >
              Confirmed — Approve
            </button>
            <button
              onClick={() => handleReject(l.id, l.student_name)}
              className="font-body text-xs text-red-600 underline"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
