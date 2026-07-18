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
    .select("*, students(full_name)")
    .eq("id", params.id)
    .single();

  // RLS silently excludes locked letters from the result set —
  // error or null here means either it doesn't exist, or it's not
  // unlocked yet. Both cases correctly resolve to a 404.
  if (error || !letter) {
    notFound();
  }

  const l = letter as Letter & { students: { full_name: string } | null };

  return (
    <main className="px-6 py-12 max-w-xl mx-auto">
      <Card>
        {l.students?.full_name && (
          <p className="font-body text-sm text-muted mb-2">
            A letter from {l.students.full_name}
          </p>
        )}
        <p className="font-body text-ink whitespace-pre-wrap leading-relaxed">
          {l.letter_text}
        </p>
      </Card>
    </main>
  );
}
