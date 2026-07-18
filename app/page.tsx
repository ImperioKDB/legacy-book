import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";
import { HomeGalleryRotator } from "@/components/HomeGalleryRotator";
import { Photo } from "@/lib/types";

export const revalidate = 0;

export default async function Home() {
  const { data: allPhotos } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  // Shuffle server-side per request so the homepage feels different
  // each visit, without needing client-side re-randomization (which
  // would cause a hydration mismatch since server and client would
  // pick different random orders for the same markup).
  const shuffled = [...(allPhotos ?? [])].sort(() => Math.random() - 0.5);
  const photos = shuffled.slice(0, 16);

  return (
    <>
      <main className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-xl w-full">
          <div className="relative w-full aspect-[4/3] rounded-card overflow-hidden mb-8 bg-accent-soft shadow-[0_20px_50px_-20px_rgba(43,36,32,0.3)]">
            <Image
              src="https://gwxiwvpqmcrkrdiqaokp.supabase.co/storage/v1/object/public/legacy-book-assets/site/hero.jpg"
              alt="Graduating class"
              fill
              className="object-cover"
              priority
            />
          </div>

          <h1 className="font-heading text-4xl md:text-5xl text-ink mb-4">
            The Legacy Book
          </h1>

          <p className="font-body text-lg text-muted italic mb-2">
            "For I know the plans I have for you..." — Jeremiah 29:11
          </p>

          <p className="font-body text-base text-ink mb-10">
            Luminaire: The Lightbearers
          </p>

          <Link href="/students" className="btn-hero">
            Meet the Class
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>

      <HomeGalleryRotator photos={(photos as Photo[]) ?? []} />
    </>
  );
}
