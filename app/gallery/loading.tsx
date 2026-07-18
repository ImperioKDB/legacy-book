export default function GalleryLoading() {
  return (
    <main className="px-6 py-12 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="h-8 w-32 bg-accent-soft rounded-card mx-auto mb-2 animate-pulse" />
        <div className="h-4 w-40 bg-accent-soft/60 rounded-card mx-auto animate-pulse" />
      </div>
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="w-full rounded-card bg-accent-soft animate-pulse break-inside-avoid"
            style={{ height: `${140 + (i % 3) * 60}px` }}
          />
        ))}
      </div>
    </main>
  );
}
