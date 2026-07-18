import { supabase } from "@/lib/supabase-client";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { Letter } from "@/lib/types";

export const revalidate = 0;

export default async function LetterViewPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: letter, error } = await supabase
    .from("letters")
    .select("*")
    .eq("id", params.id)
    .single();

  // RLS silently excludes locked letters from the result set —
  // error or null here means either it doesn't exist, or it's not
  // unlocked yet. Both cases correctly resolve to a 404.
  if (error || !letter) {
    notFound();
  }

  const l = letter as Letter;

  const { data: student } = await supabase
    .from("students")
    .select("full_name")
    .eq("id", l.student_id)
    .single();

  return (
    <main className="px-6 py-12 max-w-xl mx-auto">
      <Card>
        {student?.full_name && (
          <p className="font-body text-sm text-muted mb-2">
            A letter from {student.full_name}
          </p>
        )}
        <p className="font-body text-ink whitespace-pre-wrap leading-relaxed">
          {l.letter_text}
        </p>
      </Card>
    </main>
  );
}
