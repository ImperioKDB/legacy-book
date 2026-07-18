"use client";

import { useEffect, useState } from "react";
import { AdminGate } from "@/components/AdminGate";
import { ModerationPanel } from "@/components/ModerationPanel";
import { PhotoUploadForm } from "@/components/PhotoUploadForm";
import { PhotoManagementPanel } from "@/components/PhotoManagementPanel";
import { HeroUploadForm } from "@/components/HeroUploadForm";
import { StudentPicker } from "@/components/StudentPicker";
import { supabase } from "@/lib/supabase-client";
import { Student } from "@/lib/types";

type Tab = "students" | "moderate" | "photos" | "manage" | "hero";

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>("moderate");
  const [students, setStudents] = useState<Student[]>([]);

  const [form, setForm] = useState({
    full_name: "",
    department: "",
    favorite_scripture: "",
    testimony: "",
    portrait_url: "",
  });
  const [studentStatus, setStudentStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  useEffect(() => {
    supabase
      .from("students")
      .select("*")
      .order("full_name", { ascending: true })
      .then(({ data }) => setStudents((data as Student[]) ?? []));
  }, [studentStatus]);

  async function handleStudentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStudentStatus("saving");

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
      setStudentStatus("done");
      setForm({
        full_name: "",
        department: "",
        favorite_scripture: "",
        testimony: "",
        portrait_url: "",
      });
    } else {
      setStudentStatus("error");
    }
  }

  return (
    <AdminGate>
      <main className="px-6 py-12 max-w-xl mx-auto">
        <h1 className="font-heading text-2xl text-ink mb-6">Admin Dashboard</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button onClick={() => setTab("moderate")} className={`px-4 py-2 rounded-card font-body text-sm whitespace-nowrap min-h-[44px] ${tab === "moderate" ? "bg-accent text-white" : "bg-white text-ink border border-muted/30"}`}>
            Moderate Wall
          </button>
          <button onClick={() => setTab("students")} className={`px-4 py-2 rounded-card font-body text-sm whitespace-nowrap min-h-[44px] ${tab === "students" ? "bg-accent text-white" : "bg-white text-ink border border-muted/30"}`}>
            Add Student
          </button>
          <button onClick={() => setTab("photos")} className={`px-4 py-2 rounded-card font-body text-sm whitespace-nowrap min-h-[44px] ${tab === "photos" ? "bg-accent text-white" : "bg-white text-ink border border-muted/30"}`}>
            Upload Photos
          </button>
          <button onClick={() => setTab("manage")} className={`px-4 py-2 rounded-card font-body text-sm whitespace-nowrap min-h-[44px] ${tab === "manage" ? "bg-accent text-white" : "bg-white text-ink border border-muted/30"}`}>
            Manage Photos
          </button>
          <button onClick={() => setTab("hero")} className={`px-4 py-2 rounded-card font-body text-sm whitespace-nowrap min-h-[44px] ${tab === "hero" ? "bg-accent text-white" : "bg-white text-ink border border-muted/30"}`}>
            Hero Photo
          </button>
        </div>

        {tab === "moderate" && <ModerationPanel />}
        {tab === "photos" && <PhotoUploadForm students={students} />}
        {tab === "manage" && <PhotoManagementPanel students={students} />}
        {tab === "hero" && <HeroUploadForm />}

        {tab === "students" && (
          <form onSubmit={handleStudentSubmit} className="bg-surface rounded-card shadow-sm p-6 space-y-4">
            <div>
              <label className="block font-body text-sm text-ink mb-1">Full Name *</label>
              <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body" />
            </div>
            <div>
              <label className="block font-body text-sm text-ink mb-1">Department</label>
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body" />
            </div>
            <div>
              <label className="block font-body text-sm text-ink mb-1">Favorite Scripture</label>
              <input value={form.favorite_scripture} onChange={(e) => setForm({ ...form, favorite_scripture: e.target.value })} className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body" />
            </div>
            <div>
              <label className="block font-body text-sm text-ink mb-1">Testimony</label>
              <textarea value={form.testimony} onChange={(e) => setForm({ ...form, testimony: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-card border border-muted/30 font-body" />
            </div>
            <div>
              <label className="block font-body text-sm text-ink mb-1">Portrait URL</label>
              <input value={form.portrait_url} onChange={(e) => setForm({ ...form, portrait_url: e.target.value })} placeholder="Or leave blank and use Upload Photos tab after" className="w-full min-h-[44px] px-3 rounded-card border border-muted/30 font-body text-sm" />
            </div>
            <button type="submit" disabled={studentStatus === "saving"} className="btn-primary w-full disabled:active:scale-100">
              {studentStatus === "saving" ? "Saving..." : "Add Student"}
            </button>
            {studentStatus === "done" && <p className="font-body text-sm text-green-700">Student added.</p>}
            {studentStatus === "error" && <p className="font-body text-sm text-red-600">Something went wrong.</p>}
          </form>
        )}
      </main>
    </AdminGate>
  );
}
