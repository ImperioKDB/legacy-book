export default function StudentsLoading() {
  return (
    <main className="px-6 py-12 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="h-8 w-40 bg-accent-soft rounded-card mx-auto mb-2 animate-pulse" />
        <div className="h-4 w-32 bg-accent-soft/60 rounded-card mx-auto animate-pulse" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-card shadow-sm p-5">
            <div className="w-full aspect-square rounded-card bg-accent-soft animate-pulse mb-4" />
            <div className="h-4 w-3/4 bg-accent-soft/60 rounded animate-pulse mb-2" />
            <div className="h-3 w-1/2 bg-accent-soft/40 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  );
}
