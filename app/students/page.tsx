import { supabase } from "@/lib/supabase-client";
import { StudentCard } from "@/components/StudentCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ScrollFade } from "@/components/ScrollFade";
import { Student } from "@/lib/types";

export const revalidate = 0;

export default async function StudentsPage() {
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .eq("approved", true)
    .order("full_name", { ascending: true });

  if (error) {
    return (
      <main className="px-6 py-16 text-center">
        <p className="font-body text-muted">Couldn't load students right now.</p>
      </main>
    );
  }

  return (
    <main className="px-6 py-12 max-w-5xl mx-auto">
      <SectionHeading subtitle="The Graduating Class">
        Our Students
      </SectionHeading>

      {students && students.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(students as Student[]).map((student, i) => (
            <ScrollFade key={student.id} delay={i * 60}>
              <StudentCard student={student} />
            </ScrollFade>
          ))}
        </div>
      ) : (
        <p className="font-body text-muted text-center">
          No profiles yet — check back soon.
        </p>
      )}
    </main>
  );
}
