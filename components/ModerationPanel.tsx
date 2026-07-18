"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { MemoryWallMessage } from "@/lib/types";

export function ModerationPanel() {
  const [pending, setPending] = useState<MemoryWallMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

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

  async function handleAction(id: string, approved: boolean) {
    setActingId(id);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    await fetch(`/api/admin/memory-wall/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ approved }),
    });

    setActingId(null);
    loadPending();
  }

  if (loading) {
    return <p className="font-body text-muted">Loading pending messages...</p>;
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
              onClick={() => handleAction(msg.id, true)}
              disabled={actingId === msg.id}
              className="flex-1 bg-accent text-white font-body font-medium min-h-[44px] rounded-card disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction(msg.id, false)}
              disabled={actingId === msg.id}
              className="flex-1 bg-white border border-muted/40 text-ink font-body font-medium min-h-[44px] rounded-card disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
