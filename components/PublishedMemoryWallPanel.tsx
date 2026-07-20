"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { MemoryWallMessage } from "@/lib/types";

export function PublishedMemoryWallPanel() {
  const [messages, setMessages] = useState<MemoryWallMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    setLoading(true);
    const { data } = await supabase
      .from("memory_wall")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });
    setMessages((data as MemoryWallMessage[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function handleDelete(id: string, authorName: string) {
    if (!confirm(`Permanently remove this message from ${authorName}? This cannot be undone.`)) return;

    const previous = messages;
    setMessages((m) => m.filter((msg) => msg.id !== id));

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch(`/api/admin/memory-wall/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) setMessages(previous);
  }

  if (loading) return <p className="font-body text-muted">Loading messages...</p>;
  if (messages.length === 0) return <p className="font-body text-muted">No published messages yet.</p>;

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className="bg-surface rounded-card shadow-sm p-5">
          <p className="font-body text-ink mb-1">{msg.message}</p>
          <p className="font-body text-sm text-muted mb-3">— {msg.author_name}</p>
          <button
            onClick={() => handleDelete(msg.id, msg.author_name)}
            className="font-body text-xs text-red-600 underline"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
