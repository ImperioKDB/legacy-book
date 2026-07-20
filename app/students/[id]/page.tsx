import { supabase } from "@/lib/supabase-client";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { BackButton } from "@/components/BackButton";
import { Student, Photo } from "@/lib/types";

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

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("student_id", s.id)
    .order("created_at", { ascending: true });

  return (
    <main className="px-6 py-12 max-w-2xl mx-auto">
      <BackButton label="Back to Students" />

      <Card>
        <div className="relative w-full aspect-square rounded-card overflow-hidden mb-6 bg-accent-soft">
          {s.portrait_url ? (
            <Image src={s.portrait_url} alt={s.full_name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted font-body text-sm">
              No photo yet
            </div>
          )}
        </div>

        <h1 className="font-heading text-2xl text-ink mb-1">{s.full_name}</h1>
        {s.department && <p className="font-body text-muted mb-4">{s.department}</p>}

        {s.favorite_scripture && (
          <p className="font-body italic text-ink mb-4 border-l-2 border-accent pl-4">
            {s.favorite_scripture}
          </p>
        )}

        {s.testimony && <p className="font-body text-ink leading-relaxed">{s.testimony}</p>}
      </Card>

      {photos && photos.length > 0 && (
        <div className="mt-6">
          <h2 className="font-heading text-lg text-ink mb-3">Photos</h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 -mx-6 px-6">
            {(photos as Photo[]).map((photo) => (
              <div
                key={photo.id}
                className="relative shrink-0 w-full snap-center rounded-card overflow-hidden bg-accent-soft aspect-[4/5]"
              >
                <Image src={photo.image_url} alt={photo.caption ?? s.full_name} fill className="object-cover" />
                {photo.caption && (
                  <p className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent text-white text-sm font-body p-3">
                    {photo.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
          {photos.length > 1 && (
            <p className="font-body text-xs text-muted text-center mt-2">Swipe for more</p>
          )}
        </div>
      )}
    </main>
  );
}
