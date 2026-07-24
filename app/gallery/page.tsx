import { supabase } from "@/lib/supabase-client";
import { SectionHeading } from "@/components/SectionHeading";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { BackButton } from "@/components/BackButton";
import { Photo } from "@/lib/types";

export const revalidate = 0;

function chunkRandomly(photos: Photo[]): Photo[][] {
  const groups: Photo[][] = [];
  let i = 0;
  while (i < photos.length) {
    const size = 5 + Math.floor(Math.random() * 4); // groups of 5-8
    groups.push(photos.slice(i, i + size));
    i += size;
  }
  return groups;
}

export default async function GalleryPage() {
  const { data: photos, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="px-6 py-16 text-center">
        <p className="font-body text-muted">Couldn't load the gallery right now.</p>
      </main>
    );
  }

  const count = photos?.length ?? 0;
  const shuffled = [...(photos ?? [])].sort(() => Math.random() - 0.5);
  const groups = chunkRandomly(shuffled as Photo[]);

  return (
    <main className="px-6 py-12 max-w-5xl mx-auto">
      <BackButton />
      <SectionHeading
        subtitle={count > 0 ? `${count} memor${count === 1 ? "y" : "ies"} and counting` : "Moments from the year"}
      >
        Gallery
      </SectionHeading>

      {photos && photos.length > 0 ? (
        <PhotoLightbox groups={groups} />
      ) : (
        <p className="font-body text-muted text-center">
          No photos yet — check back soon.
        </p>
      )}
    </main>
  );
}
