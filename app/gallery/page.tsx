import { supabase } from "@/lib/supabase-client";
import { SectionHeading } from "@/components/SectionHeading";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { Photo } from "@/lib/types";

export const revalidate = 0;

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

  return (
    <main className="px-6 py-12 max-w-5xl mx-auto">
      <SectionHeading subtitle="Moments from the year">Gallery</SectionHeading>

      {photos && photos.length > 0 ? (
        <PhotoLightbox photos={photos as Photo[]} />
      ) : (
        <p className="font-body text-muted text-center">
          No photos yet — check back soon.
        </p>
      )}
    </main>
  );
}
