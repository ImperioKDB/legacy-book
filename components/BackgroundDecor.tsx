export function BackgroundDecor() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-accent-soft/60 blur-2xl animate-drift-slow motion-reduce:animate-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent-soft/40 blur-2xl animate-drift-slow-reverse motion-reduce:animate-none" />
    </div>
  );
}
