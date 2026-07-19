import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";
import { HomeGalleryRotator } from "@/components/HomeGalleryRotator";
import { ScrollFade } from "@/components/ScrollFade";
import { Photo } from "@/lib/types";

export const revalidate = 0;

export default async function Home() {
  const { data: allPhotos } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const { count: studentCount } = await supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("approved", true);

  const photoPool = allPhotos ?? [];
  const shuffled = [...photoPool].sort(() => Math.random() - 0.5);
  const rotatorPhotos = shuffled.slice(0, 16);
  const collageTiles = shuffled.slice(0, 6);

  const tilePositions = [
    "top-0 left-2 w-20 -rotate-[14deg]",
    "top-4 right-0 w-24 rotate-[10deg]",
    "bottom-8 left-0 w-20 rotate-[8deg]",
    "bottom-0 right-4 w-24 -rotate-[9deg]",
    "top-1/3 left-[-8px] w-16 rotate-[18deg]",
    "top-1/4 right-[-8px] w-16 -rotate-[16deg]",
  ];

  return (
    <>
      <main className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-xl w-full">
          <div className="relative mx-auto max-w-sm h-72 sm:h-80 mb-10">
            {collageTiles.map((photo, i) => (
              <div
                key={photo.id}
                className={`absolute bg-surface p-1.5 pb-4 rounded shadow-md opacity-80 ${tilePositions[i % tilePositions.length]}`}
              >
                <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-accent-soft">
                  <Image src={photo.image_url} alt="" fill className="object-cover" />
                </div>
              </div>
            ))}

            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-surface p-3 pb-7 rounded-card shadow-[0_20px_50px_-20px_rgba(43,36,32,0.4)] -rotate-1 w-full max-w-[260px]">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-accent-soft">
                  <Image
                    src="https://gwxiwvpqmcrkrdiqaokp.supabase.co/storage/v1/object/public/legacy-book-assets/site/hero.jpg"
                    alt="Graduating class"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <p className="text-center text-xs text-muted mt-3 font-body italic">
                  &quot;Let no man despise thy youth&quot; — 1 Timothy 4:12
                </p>
              </div>
            </div>
          </div>

          <h1 className="font-display text-4xl md:text-6xl text-accent mb-2 leading-tight">
            The Legacy Book
          </h1>
          <div className="mx-auto w-10 h-0.5 bg-accent mb-4" />

          <p className="font-body text-lg text-muted italic mb-4">
            "For I know the plans I have for you..." — Jeremiah 29:11
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-accent text-sm">✦</span>
            <p className="font-body text-ink font-medium tracking-wide uppercase text-sm">
              Luminaire: The Lightbearers
            </p>
            <span className="text-accent text-sm">✦</span>
          </div>

          <Link href="/students" className="btn-hero">
            Meet the Class
            <span aria-hidden="true">→</span>
          </Link>

          {typeof studentCount === "number" && studentCount > 0 && (
            <p className="font-body text-muted text-xs mt-3">
              {studentCount} graduating student{studentCount !== 1 ? "s" : ""} • One legacy
            </p>
          )}
        </div>
      </main>

      <div className="bg-surface">
        <ScrollFade>
          <HomeGalleryRotator photos={rotatorPhotos as Photo[]} />
        </ScrollFade>
      </div>
    </>
  );
}
