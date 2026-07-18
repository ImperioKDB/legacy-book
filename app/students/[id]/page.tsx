import { supabase } from "@/lib/supabase-client";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { Student } from "@/lib/types";

export const revalidate = 0;

export default async function StudentProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", params.id)
    .eq("approved", true)
    .single();

  if (error || !student) {
    notFound();
  }

  const s = student as Student;

  return (
    <main className="px-6 py-12 max-w-2xl mx-auto">
      <Card>
        <div className="relative w-full aspect-square rounded-card overflow-hidden mb-6 bg-accent-soft">
          {s.portrait_url ? (
            <Image
              src={s.portrait_url}
              alt={s.full_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted font-body text-sm">
              No photo yet
            </div>
          )}
        </div>

        <h1 className="font-heading text-2xl text-ink mb-1">{s.full_name}</h1>
        {s.department && (
          <p className="font-body text-muted mb-4">{s.department}</p>
        )}

        {s.favorite_scripture && (
          <p className="font-body italic text-ink mb-4 border-l-2 border-accent pl-4">
            {s.favorite_scripture}
          </p>
        )}

        {s.testimony && (
          <p className="font-body text-ink leading-relaxed">{s.testimony}</p>
        )}
      </Card>
    </main>
  );
}
