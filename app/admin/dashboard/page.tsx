"use client";

import { useState } from "react";
import { AdminGate } from "@/components/AdminGate";
import { supabase } from "@/lib/supabase-client";

export default function AdminDashboardPage() {
  const [form, setForm] = useState({
    full_name: "",
    department: "",
    favorite_scripture: "",
    testimony: "",
    portrait_url: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("done");
      setForm({
        full_name: "",
        department: "",
        favorite_scripture: "",
        testimony: "",
        portrait_url: "",
      });
    } else {
      setStatus("error");
    }
  }

  return (
    <AdminGate>
      <main className="px-6 py-12 max-w-xl mx-auto">
        <h1 className="font-heading text-2xl text-ink mb-6">Add Student</h1>

        <form onSubmit={handleSubmit} className="bg-surface rounded-card shadow-sm p-6 space-y-4">
          <div>
            <label className="block font-body text-sm text-ink mb-1">Full Name *</label>
            <input
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body"
            />
          </div>

          <div>
            <label className="block font-body text-sm text-ink mb-1">Department</label>
            <input
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body"
            />
          </div>

          <div>
            <label className="block font-body text-sm text-ink mb-1">Favorite Scripture</label>
            <input
              value={form.favorite_scripture}
              onChange={(e) => setForm({ ...form, favorite_scripture: e.target.value })}
              className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body"
            />
          </div>

          <div>
            <label className="block font-body text-sm text-ink mb-1">Testimony</label>
            <textarea
              value={form.testimony}
              onChange={(e) => setForm({ ...form, testimony: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 rounded-card border border-muted/30 font-body"
            />
          </div>

          <div>
            <label className="block font-body text-sm text-ink mb-1">Portrait URL</label>
            <input
              value={form.portrait_url}
              onChange={(e) => setForm({ ...form, portrait_url: e.target.value })}
              placeholder="Paste Supabase Storage URL — upload flow comes Day 6"
              className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full bg-accent text-white font-body font-medium min-h-[44px] rounded-card disabled:opacity-50"
          >
            {status === "saving" ? "Saving..." : "Add Student"}
          </button>

          {status === "done" && (
            <p className="font-body text-sm text-green-700">Student added.</p>
          )}
          {status === "error" && (
            <p className="font-body text-sm text-red-600">Something went wrong.</p>
          )}
        </form>
      </main>
    </AdminGate>
  );
}
