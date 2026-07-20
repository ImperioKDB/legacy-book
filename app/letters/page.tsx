import { SectionHeading } from "@/components/SectionHeading";
import { LetterForm } from "@/components/LetterForm";
import { BackButton } from "@/components/BackButton";

export default function LettersPage() {
  return (
    <main className="px-6 py-12 max-w-2xl mx-auto">
      <BackButton />
      <SectionHeading subtitle="Write to your future self">
        Letter to Future Me
      </SectionHeading>

      <LetterForm />
    </main>
  );
}
