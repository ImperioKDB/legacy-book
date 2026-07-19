"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Student } from "@/lib/types";

export function StudentManagementPanel() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    department: "",
    favorite_scripture: "",
    testimony: "",
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadStudents() {
    setLoading(true);
    const { data } = await supabase
      .from("students")
      .select("*")
      .order("full_name", { ascending: true });
    setStudents((data as Student[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function startEdit(s: Student) {
    setEditingId(s.id);
    setErrorMsg(null);
    setEditForm({
      full_name: s.full_name,
      department: s.department ?? "",
      favorite_scripture: s.favorite_scripture ?? "",
      testimony: s.testimony ?? "",
    });
  }

  async function saveEdit(id: string, approved: boolean) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    await fetch(`/api/admin/students/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...editForm, approved }),
    });

    setEditingId(null);
    loadStudents();
  }

  async function toggleHidden(s: Student) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    await fetch(`/api/admin/students/${s.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        full_name: s.full_name,
        department: s.department,
        favorite_scripture: s.favorite_scripture,
        testimony: s.testimony,
        approved: !s.approved,
      }),
    });

    loadStudents();
  }

  async function handleDelete(s: Student) {
    if (!confirm(`Permanently delete ${s.full_name}? This cannot be undone.`)) return;

    setErrorMsg(null);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch(`/api/admin/students/${s.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      loadStudents();
    } else {
      const json = await res.json();
      setErrorMsg(json.error ?? "Something went wrong.");
    }
  }

  if (loading) return <p className="font-body text-muted">Loading students...</p>;
  if (students.length === 0) return <p className="font-body text-muted">No students yet.</p>;

  return (
    <div className="space-y-3">
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-card p-3">
          <p className="font-body text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      {students.map((s) => {
        const isEditing = editingId === s.id;

        return (
          <div key={s.id} className="bg-surface rounded-card shadow-sm p-4">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="Full name"
                  className="w-full min-h-[40px] px-2 rounded-card border border-muted/30 font-body text-sm"
                />
                <input
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  placeholder="Department"
                  className="w-full min-h-[40px] px-2 rounded-card border border-muted/30 font-body text-sm"
                />
                <input
                  value={editForm.favorite_scripture}
                  onChange={(e) => setEditForm({ ...editForm, favorite_scripture: e.target.value })}
                  placeholder="Favorite scripture"
                  className="w-full min-h-[40px] px-2 rounded-card border border-muted/30 font-body text-sm"
                />
                <textarea
                  value={editForm.testimony}
                  onChange={(e) => setEditForm({ ...editForm, testimony: e.target.value })}
                  placeholder="Testimony"
                  rows={3}
                  className="w-full px-2 py-2 rounded-card border border-muted/30 font-body text-sm"
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(s.id, s.approved)} className="btn-primary text-sm px-4 min-h-[36px]">
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="btn-secondary text-sm px-4 min-h-[36px]">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="font-body text-ink">{s.full_name}</p>
                  {!s.approved && (
                    <span className="font-body text-xs text-muted bg-accent-soft px-2 py-1 rounded-full">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="font-body text-xs text-muted mb-3">{s.department || "No department"}</p>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => startEdit(s)} className="font-body text-xs text-accent underline">
                    Edit
                  </button>
                  <button onClick={() => toggleHidden(s)} className="font-body text-xs text-accent underline">
                    {s.approved ? "Hide" : "Unhide"}
                  </button>
                  <button onClick={() => handleDelete(s)} className="font-body text-xs text-red-600 underline">
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
