"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { MemoryWallMessage } from "@/lib/types";

export function ModerationPanel() {
  const [pending, setPending] = useState<MemoryWallMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPending() {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch("/api/admin/memory-wall", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const json = await res.json();
      setPending(json.messages ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadPending();
  }, []);

  async function handleApprove(id: string) {
    const previous = pending;
    setPending((p) => p.filter((m) => m.id !== id));

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch(`/api/admin/memory-wall/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ approved: true }),
    });

    if (!res.ok) {
      setPending(previous);
    }
  }

  async function handleReject(id: string) {
    if (!confirm("Reject and permanently delete this message?")) return;

    const previous = pending;
    setPending((p) => p.filter((m) => m.id !== id));

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch(`/api/admin/memory-wall/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      setPending(previous);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-card shadow-sm p-5">
            <div className="h-4 w-full bg-accent-soft/60 rounded animate-pulse mb-2" />
            <div className="h-3 w-1/3 bg-accent-soft/40 rounded animate-pulse mb-4" />
            <div className="flex gap-3">
              <div className="flex-1 h-11 bg-accent-soft rounded-card animate-pulse" />
              <div className="flex-1 h-11 bg-accent-soft/50 rounded-card animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (pending.length === 0) {
    return <p className="font-body text-muted">No messages waiting for approval.</p>;
  }

  return (
    <div className="space-y-4">
      {pending.map((msg) => (
        <div key={msg.id} className="bg-surface rounded-card shadow-sm p-5">
          <p className="font-body text-ink mb-1">{msg.message}</p>
          <p className="font-body text-sm text-muted mb-4">— {msg.author_name}</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleApprove(msg.id)}
              className="flex-1 bg-accent text-white font-body font-medium min-h-[44px] rounded-card active:scale-[0.98] transition-transform"
            >
              Approve
            </button>
            <button
              onClick={() => handleReject(msg.id)}
              className="flex-1 bg-white border border-muted/40 text-ink font-body font-medium min-h-[44px] rounded-card active:scale-[0.98] transition-transform"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
