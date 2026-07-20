"use client";

import { useRouter } from "next/navigation";

export function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1 font-body text-sm text-accent mb-4"
    >
      <span aria-hidden="true">←</span> {label}
    </button>
  );
}
