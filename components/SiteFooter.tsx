export function SiteFooter() {
  return (
    <footer className="bg-accent text-bg py-10 px-6 text-center mt-12">
      <div className="flex justify-center items-center gap-2 mb-3">
        <span className="text-bg text-lg">✦</span>
        <span className="font-heading text-xl">The Legacy Book</span>
        <span className="text-bg text-lg">✦</span>
      </div>
      <p className="font-body text-bg/80 text-sm">
        Made with love by the Luminaire Class
      </p>
      <p className="mt-1 font-body text-bg/60 text-xs">TACSFON UNIBEN</p>
      <div className="mt-6 w-10 h-0.5 bg-bg/40 mx-auto" />
      <p className="mt-4 font-body text-bg/60 text-xs italic">
        &quot;For I know the plans I have for you...&quot; — Jeremiah 29:11
      </p>
    </footer>
  );
}
