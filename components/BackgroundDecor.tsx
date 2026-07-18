export function BackgroundDecor() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent-soft/60 blur-3xl" />
      <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-accent-soft/40 blur-3xl" />
    </div>
  );
}
