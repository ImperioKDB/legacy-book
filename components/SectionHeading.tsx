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
      <div className="mx-auto mt-3 w-10 h-0.5 bg-accent" />
      {subtitle && (
        <p className="font-body text-muted mt-3 text-base">{subtitle}</p>
      )}
    </div>
  );
}
