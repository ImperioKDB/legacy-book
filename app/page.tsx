import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-xl w-full">
        <div className="relative w-full aspect-[4/3] rounded-card overflow-hidden mb-8 bg-accent-soft">
          {/* Replace src once a hero photo is uploaded to Storage */}
          <Image
            src="/hero-placeholder.jpg"
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
          {/* Replace with final scripture verse */}
          "For I know the plans I have for you..." — Jeremiah 29:11
        </p>

        <p className="font-body text-base text-ink mb-10">
          {/* Replace with final class motto */}
          Class Motto Goes Here
        </p>

        <Link
          href="/students"
          className="inline-block bg-accent text-white font-body font-medium px-8 py-3 rounded-card hover:opacity-90 transition-opacity min-h-[44px]"
        >
          Meet the Class
        </Link>
      </div>
    </main>
  );
}
