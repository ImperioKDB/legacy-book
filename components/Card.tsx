import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-surface rounded-card shadow-sm p-5 animate-fade-up ${className}`}
    >
      {children}
    </div>
  );
}
