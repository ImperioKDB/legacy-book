"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";
import { Student } from "@/lib/types";

export function StudentPortraitManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

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

  async function handleUpload(studentId: string, file: File) {
    setUploadingId(studentId);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/admin/students/${studentId}/portrait`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      loadStudents();
    }
    setUploadingId(null);
  }

  if (loading) return <p className="font-body text-muted">Loading students...</p>;
  if (students.length === 0) return <p className="font-body text-muted">No students yet.</p>;

  return (
    <div className="space-y-3">
      {students.map((student) => (
        <div key={student.id} className="bg-surface rounded-card shadow-sm p-4 flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-card overflow-hidden bg-accent-soft shrink-0">
            {student.portrait_url ? (
              <Image src={student.portrait_url} alt={student.full_name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted text-xs font-body text-center px-1">
                No photo
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-body text-sm text-ink truncate">{student.full_name}</p>
            <label className="inline-block mt-1">
              <span className="font-body text-xs text-accent underline cursor-pointer">
                {uploadingId === student.id
                  ? "Uploading..."
                  : student.portrait_url
                  ? "Replace photo"
                  : "Upload photo"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingId === student.id}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(student.id, file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
