import { ReactNode } from "react";

export function SectionHeading({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-8">
      <h2 className="font-heading text-2xl md:text-3xl text-ink">{children}</h2>
      {subtitle && (
        <p className="font-body text-muted mt-2 text-base">{subtitle}</p>
      )}
    </div>
  );
}
