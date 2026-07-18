"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";
import { Photo, Student } from "@/lib/types";
import { StudentPicker } from "@/components/StudentPicker";

export function PhotoManagementPanel({ students }: { students: Student[] }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editStudentId, setEditStudentId] = useState("");

  async function loadPhotos() {
    setLoading(true);
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });
    setPhotos((data as Photo[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  function startEdit(photo: Photo) {
    setEditingId(photo.id);
    setEditCaption(photo.caption ?? "");
    setEditStudentId(photo.student_id ?? "");
  }

  async function saveEdit(id: string) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    await fetch(`/api/admin/photos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ caption: editCaption, student_id: editStudentId }),
    });

    setEditingId(null);
    loadPhotos();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this photo permanently? This cannot be undone.")) return;

    const previous = photos;
    setPhotos((p) => p.filter((photo) => photo.id !== id));

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch(`/api/admin/photos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) setPhotos(previous);
  }

  if (loading) {
    return <p className="font-body text-muted">Loading photos...</p>;
  }

  if (photos.length === 0) {
    return <p className="font-body text-muted">No photos uploaded yet.</p>;
  }

  return (
    <div className="space-y-4">
      {photos.map((photo) => {
        const student = students.find((s) => s.id === photo.student_id);
        const isEditing = editingId === photo.id;

        return (
          <div key={photo.id} className="bg-surface rounded-card shadow-sm p-4 flex gap-3">
            <div className="relative w-20 h-20 rounded-card overflow-hidden bg-accent-soft shrink-0">
              <Image src={photo.image_url} alt={photo.caption ?? ""} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="Caption"
                    className="w-full min-h-[40px] px-2 rounded-card border border-muted/30 font-body text-sm"
                  />
                  <StudentPicker students={students} value={editStudentId} onChange={setEditStudentId} />
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(photo.id)} className="btn-primary text-sm px-4 min-h-[36px]">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn-secondary text-sm px-4 min-h-[36px]">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-body text-sm text-ink truncate">
                    {photo.caption || <span className="text-muted italic">No caption</span>}
                  </p>
                  <p className="font-body text-xs text-muted mb-2">
                    {student ? student.full_name : "General gallery"}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(photo)}
                      className="font-body text-xs text-accent underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="font-body text-xs text-red-600 underline"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
