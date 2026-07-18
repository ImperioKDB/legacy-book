import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/Card";
import { Student } from "@/lib/types";

export function StudentCard({ student }: { student: Student }) {
  return (
    <Link href={`/students/${student.id}`}>
      <Card className="cursor-pointer hover:opacity-90 transition-opacity">
        <div className="relative w-full aspect-square rounded-card overflow-hidden mb-4 bg-accent-soft">
          {student.portrait_url ? (
            <Image
              src={student.portrait_url}
              alt={student.full_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted font-body text-sm">
              No photo yet
            </div>
          )}
        </div>
        <h3 className="font-heading text-lg text-ink">{student.full_name}</h3>
        {student.department && (
          <p className="font-body text-sm text-muted">{student.department}</p>
        )}
      </Card>
    </Link>
  );
}
