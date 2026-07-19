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
  const accentPhotos = shuffled.slice(0, 2);

  return (
    <>
      <main className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden">
        <div className="max-w-xl w-full relative">
          {accentPhotos[0] && (
            <div className="hidden sm:block absolute -left-16 top-8 w-28 bg-surface p-2 pb-5 rounded-md shadow-lg -rotate-12 opacity-90">
              <div className="relative w-full aspect-square rounded overflow-hidden bg-accent-soft">
                <Image src={accentPhotos[0].image_url} alt="" fill className="object-cover" />
              </div>
            </div>
          )}
          {accentPhotos[1] && (
            <div className="hidden sm:block absolute -right-14 top-24 w-24 bg-surface p-2 pb-5 rounded-md shadow-lg rotate-[10deg] opacity-90">
              <div className="relative w-full aspect-square rounded overflow-hidden bg-accent-soft">
                <Image src={accentPhotos[1].image_url} alt="" fill className="object-cover" />
              </div>
            </div>
          )}

          <div className="mx-auto max-w-sm relative z-10">
            <div className="bg-surface p-3 pb-7 rounded-card shadow-[0_20px_50px_-20px_rgba(43,36,32,0.35)] -rotate-1">
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

          <h1 className="font-display text-4xl md:text-6xl text-accent mt-10 mb-2 leading-tight relative z-10">
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
