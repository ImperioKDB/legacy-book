import { supabase } from "@/lib/supabase-client";
import { SectionHeading } from "@/components/SectionHeading";
import { LetterForm } from "@/components/LetterForm";
import { Student } from "@/lib/types";

export const revalidate = 0;

export default async function LettersPage() {
  const { data: students } = await supabase
    .from("students")
    .select("*")
    .eq("approved", true)
    .order("full_name", { ascending: true });

  return (
    <main className="px-6 py-12 max-w-2xl mx-auto">
      <SectionHeading subtitle="Write to your future self">
        Letter to Future Me
      </SectionHeading>

      {students && students.length > 0 ? (
        <LetterForm students={students as Student[]} />
      ) : (
        <p className="font-body text-muted text-center">
          Student profiles aren't loaded yet — check back soon.
        </p>
      )}
    </main>
  );
}
