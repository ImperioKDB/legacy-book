import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-xl w-full">
        <div className="relative w-full aspect-[4/3] rounded-card overflow-hidden mb-8 bg-accent-soft">
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
          Class Motto Goes Here
        </p>

        <Link href="/students" className="btn-primary inline-block">
          Meet the Class
        </Link>
      </div>
    </main>
  );
}
