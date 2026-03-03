import Link from "next/link";
import type { Metadata } from "next";
import { SignUpForm } from "@/components/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up | foliopage",
  description: "Create your foliopage account and launch your profile.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="min-h-dvh bg-[#f0ece2] font-[family-name:var(--font-cabinet)] text-[#0e0e0e]">

      {/* Top nav bar */}
      <header className="flex items-center justify-between border-b border-[#0e0e0e]/10 px-4 py-3 sm:px-8 sm:py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0e0e0e]/40 transition-colors group-hover:text-[#0e0e0e] sm:text-xs">
            ← Back
          </span>
        </Link>
        <p className="text-sm font-black tracking-tight">
          folio<span className="text-[#e8320a]">page</span>
        </p>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e8320a]" />
          <span className="hidden text-[10px] font-black uppercase tracking-widest text-[#0e0e0e]/40 sm:block">MVP Build</span>
        </div>
      </header>

      <main className="grid min-h-[calc(100dvh-49px)] sm:min-h-[calc(100dvh-57px)] lg:grid-cols-[1fr_520px]">

        {/* Left — editorial side, hidden on mobile */}
        <div className="relative hidden flex-col justify-between overflow-hidden border-r border-[#0e0e0e]/10 px-8 py-12 lg:flex lg:px-16">
          <span aria-hidden className="pointer-events-none absolute -bottom-6 -left-4 select-none text-[18vw] font-black leading-none text-[#0e0e0e]/[0.04]">01</span>

          <div>
            <p className="inline-block border border-[#0e0e0e]/15 bg-[#0e0e0e]/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#0e0e0e]/50">
              Account Creation
            </p>
            <h1 className="mt-6 max-w-lg text-[clamp(2.8rem,5vw,4.5rem)] font-black leading-[0.92] tracking-[-0.03em] text-[#0e0e0e]">
              Launch your<br />
              <em className="not-italic text-[#e8320a]">portfolio</em><br />
              in minutes.
            </h1>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-[#0e0e0e]/50">
              Email + password auth before profile setup. No credit card. Free plan included.
            </p>
          </div>

          <div className="relative mt-12 space-y-0">
            {[
              { num: "01", label: "Resume-first setup", sub: "Import your CV and generate your page." },
              { num: "02", label: "Recruiter-ready pages", sub: "Public profiles with analytics." },
              { num: "03", label: "Free & Member tiers", sub: "Upgrade when you're ready." },
            ].map((item) => (
              <div key={item.num} className="group flex items-start gap-6 border-t border-[#0e0e0e]/10 py-5 transition-colors last:border-b hover:bg-[#0e0e0e]/[0.02]">
                <span className="mt-0.5 font-mono text-[10px] font-bold tracking-widest text-[#0e0e0e]/25">{item.num}</span>
                <div>
                  <p className="text-sm font-black text-[#0e0e0e]">{item.label}</p>
                  <p className="mt-0.5 text-xs text-[#0e0e0e]/40">{item.sub}</p>
                </div>
                <span className="ml-auto self-center text-[#0e0e0e]/15 transition-all group-hover:translate-x-1 group-hover:text-[#e8320a]">→</span>
              </div>
            ))}
          </div>

          <p className="mt-10 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/20">
            foliopage · 2025 · All rights reserved
          </p>
        </div>

        {/* Right — form side */}
        <div className="flex items-start justify-center border-t border-[#0e0e0e]/10 bg-[#0e0e0e] px-4 py-10 sm:items-center sm:px-8 sm:py-14 lg:border-t-0">
          <div className="w-full max-w-sm">
            {/* Mobile-only mini header */}
            <div className="mb-8 lg:hidden">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">foliopage</p>
              <p className="mt-1 text-xs text-white/30">Create your account to get started.</p>
            </div>
            <SignUpForm />
          </div>
        </div>
      </main>
    </div>
  );
}
