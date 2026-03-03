import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#f0ece2] font-[family-name:var(--font-cabinet)] text-[#0e0e0e]">

      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-[#0e0e0e]/10 px-4 py-3 sm:px-8 sm:py-4">
        <Link href="/" className="text-sm font-black tracking-tight">
          folio<span className="text-[#e8320a]">page</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e8320a]" />
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#0e0e0e]/40">Error</span>
        </div>
      </header>

      {/* Main */}
      <main className="relative flex flex-1 flex-col justify-between overflow-hidden px-4 py-10 sm:px-8 sm:py-12">

        {/* Giant background 404 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[38vw] font-black leading-none tracking-[-0.05em] text-[#0e0e0e]/[0.04] sm:text-[28vw]"
        >
          404
        </span>

        {/* Top label */}
        <p className="inline-block self-start border border-[#0e0e0e]/15 bg-[#0e0e0e]/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#0e0e0e]/50">
          Page not found
        </p>

        {/* Center content */}
        <div className="relative z-10 my-8 max-w-xl sm:my-0">
          <h1 className="text-[clamp(3rem,11vw,7rem)] font-black leading-[0.88] tracking-[-0.04em] text-[#0e0e0e]">
            This page<br />
            doesn&apos;t<br />
            <em className="not-italic text-[#e8320a]">exist yet.</em>
          </h1>

          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#0e0e0e]/50">
            Maybe it&apos;s yours to claim. Create a profile and own this space before someone else does.
          </p>

          <div className="mt-7 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 border border-[#0e0e0e]/15 bg-transparent px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#0e0e0e]/60 transition-all hover:border-[#0e0e0e] hover:text-[#0e0e0e]"
            >
              <span className="transition-transform group-hover:-translate-x-0.5">←</span>
              Back to home
            </Link>
            <Link
              href="/sign-up"
              className="group inline-flex items-center justify-center gap-2 border border-[#e8320a] bg-[#e8320a] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-[#e8320a]"
            >
              Claim your page
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom rule */}
        <p className="font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/20">
          foliopage · 2025 · All rights reserved
        </p>
      </main>
    </div>
  );
}