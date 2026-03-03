import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  ChartLine,
  CheckCircle,
  Download,
  Eye,
  FilePdf,
  ShareNetwork,
  Star,
} from "@phosphor-icons/react/dist/ssr";
import { listProfiles } from "@/lib/site-data";
import { use } from "react";

export const metadata: Metadata = {
  title: "foliopage - Link in bio for careers",
  description: "A resume-first link in bio for students and early careers. Build once, share everywhere.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "foliopage - A link in bio built for careers",
    description: "Build your resume, projects, and contact into one clean profile link.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "foliopage - A link in bio built for careers",
    description: "Build your resume, projects, and contact into one clean profile link.",
  },
};

const faqs = [
  { q: "Is foliopage free to start?", a: "Yes — launch your full page for free. No credit card. No catch. Upgrade when you're ready for unlimited projects and custom domains." },
  { q: "Can I use my own domain?", a: "Member users can connect a custom domain. yourname.com becomes your career hub." },
  { q: "How fast can I launch?", a: "Most users are live in under 10 minutes. Upload resume, add projects, publish." },
  { q: "Can recruiters download my resume?", a: "Yes. Your PDF is front and center with a one-click download — exactly what recruiters expect." },
];

const testimonials = [
  { name: "Riya S.", handle: "@riya_builds", role: "CS student", quote: "I replaced three links with one foliopage and started getting faster recruiter replies. This is the move.", stars: 5 },
  { name: "Marcus T.", handle: "@marcustdev", role: "Eng student", quote: "The project format helped me explain impact clearly during technical interviews. Recruiters actually referenced it.", stars: 5 },
  { name: "Nina R.", handle: "@ninarecruiter", role: "Technical recruiter", quote: "Much easier to scan than a typical profile. Resume and project evidence are exactly where I expect them.", stars: 5 },
  { name: "Priya M.", handle: "@priya_m", role: "Bootcamp grad", quote: "Built my page on Sunday, got two LinkedIn DMs from recruiters by Tuesday. Insane ROI.", stars: 5 },
  { name: "Jordan K.", handle: "@jkfolio", role: "CS student", quote: "Sent my foliopage link instead of a resume PDF. Hiring manager said it was the most professional submission they saw.", stars: 5 },
  { name: "Arun D.", handle: "@arun_ships", role: "Early engineer", quote: "Finally — a portfolio page that doesn't take a week to build. I was live before my morning coffee cooled.", stars: 5 },
];

export default function Home() {
  const featuredProfile = {
    username: "jasn",
  }

  return (
    <div className="min-h-dvh bg-[#f0ece2] font-[family-name:var(--font-cabinet)] text-[#0e0e0e]">

      {/* ── NAV ───────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-[#0e0e0e]/10 bg-[#f0ece2]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
          <div className="flex items-center gap-6 sm:gap-10">
            <p className="text-sm font-black tracking-tight">
              folio<span className="text-[#e8320a]">page</span>
            </p>
            <div className="hidden items-center gap-8 text-[11px] font-black uppercase tracking-[0.18em] text-[#0e0e0e]/35 sm:flex">
              <Link href="#features" className="transition-colors hover:text-[#0e0e0e]">Features</Link>
              <Link href="#pricing" className="transition-colors hover:text-[#0e0e0e]">Pricing</Link>
              <Link href={`/${featuredProfile.username}`} className="transition-colors hover:text-[#0e0e0e]">Demo</Link>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/sign-up" className="hidden px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[#0e0e0e]/35 transition-colors hover:text-[#0e0e0e] sm:block">
              Sign in
            </Link>
            <Link href="/sign-up" className="group inline-flex items-center gap-1.5 border border-[#e8320a] bg-[#e8320a] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-[#e8320a] sm:gap-2 sm:px-4 sm:text-[11px]">
              Start free
              <ArrowRight size={10} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#0e0e0e]/10">
        <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 select-none text-[30vw] font-black leading-none tracking-[-0.05em] text-[#0e0e0e]/[0.04] lg:text-[20vw]">fp</span>

        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid items-stretch lg:grid-cols-[1fr_1px_480px]">

            {/* Left — headline */}
            <div className="flex flex-col justify-between py-10 sm:py-14 lg:py-16 lg:pr-12">
              <div>
                <p className="inline-block border border-[#0e0e0e]/15 bg-[#0e0e0e]/[0.04] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[#0e0e0e]/40">
                  Link in bio for careers
                </p>
                <h1 className="mt-6 text-[clamp(3rem,11vw,7rem)] font-black leading-[0.88] tracking-[-0.04em] text-[#0e0e0e]">
                  Showcase<br />your career<br />
                  <em className="not-italic text-[#e8320a]">story.</em>
                </h1>
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#0e0e0e]/50 sm:mt-7 sm:text-base">
                  One clean link for your resume, projects, and contact. Built for students and early-career builders who want more interview callbacks.
                </p>
              </div>

              {/* Mobile-only profile card preview */}
              <div className="my-8 border border-[#0e0e0e]/12 bg-[#0e0e0e] lg:hidden">
                <div className="border-b border-white/8 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#e8320a] text-xs font-black text-white">A</div>
                    <div>
                      <p className="text-xs font-black text-white">Alex Chen</p>
                      <p className="font-mono text-[8px] text-white/30">Stanford CS · Class of 2025</p>
                    </div>
                    <span className="ml-auto border border-[#e8320a]/40 bg-[#e8320a]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#e8320a]">Live</span>
                  </div>
                </div>
                <div className="divide-y divide-white/6">
                  {[
                    { label: "Resume — Stanford CS 2025", sub: "Click to download PDF", prefix: "01" },
                    { label: "ML Trading Bot", sub: "Python · 34% returns", prefix: "02" },
                    { label: "Campus Connect App", sub: "React Native · 2k users", prefix: "03" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 px-4 py-3">
                      <span className="font-mono text-[8px] text-white/20">{item.prefix}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-white">{item.label}</p>
                        <p className="font-mono text-[8px] text-white/30">{item.sub}</p>
                      </div>
                      <ArrowUpRight size={10} className="shrink-0 text-white/20" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 divide-x divide-white/8 border-t border-white/8">
                  {[["251", "views"], ["72", "dl"], ["16", "shares"]].map(([v, l]) => (
                    <div key={l} className="py-2.5 text-center">
                      <p className="tabular-nums text-sm font-black text-[#e8320a]">{v}</p>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-white/25">{l}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                  <Link href="/sign-up" className="group inline-flex items-center justify-center gap-2 border border-[#e8320a] bg-[#e8320a] px-5 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-[#e8320a]">
                    Build your page free
                    <ArrowRight size={12} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link href={`/${featuredProfile.username}?view=recruiter`} className="group inline-flex items-center justify-center gap-2 border border-[#0e0e0e]/15 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-[#0e0e0e]/50 transition-all hover:border-[#0e0e0e] hover:text-[#0e0e0e]">
                    See live demo
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
                <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/25">
                  No credit card · Live in 10 minutes · Free forever plan
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden bg-[#0e0e0e]/10 lg:block" />

            {/* Right — profile mockup desktop only */}
            <div className="hidden flex-col justify-center bg-[#0e0e0e] px-8 py-12 lg:flex">
              <div className="mb-3 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/10" />
                <span className="h-2 w-2 rounded-full bg-white/10" />
                <span className="h-2 w-2 rounded-full bg-white/10" />
                <span className="ml-3 flex-1 rounded bg-white/5 px-3 py-1 font-mono text-[9px] text-white/25">foliopage.app/alexchen</span>
              </div>
              <div className="border border-white/8 bg-white/[0.03]">
                <div className="border-b border-white/8 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#e8320a] text-sm font-black text-white">A</div>
                    <div>
                      <p className="text-sm font-black text-white">Alex Chen</p>
                      <p className="font-mono text-[9px] text-white/30">Stanford CS · Class of 2025</p>
                    </div>
                    <span className="ml-auto border border-[#e8320a]/40 bg-[#e8320a]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#e8320a]">Live</span>
                  </div>
                </div>
                <div className="divide-y divide-white/6">
                  {[
                    { label: "Resume — Stanford CS 2025", sub: "Click to download PDF", prefix: "01" },
                    { label: "ML Trading Bot", sub: "Python · 34% returns", prefix: "02" },
                    { label: "Campus Connect App", sub: "React Native · 2k users", prefix: "03" },
                    { label: "GitHub · LinkedIn · Twitter", sub: "All links, one place", prefix: "04" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.03]">
                      <span className="font-mono text-[9px] text-white/20">{item.prefix}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-white">{item.label}</p>
                        <p className="font-mono text-[9px] text-white/30">{item.sub}</p>
                      </div>
                      <ArrowUpRight size={11} className="shrink-0 text-white/20" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 divide-x divide-white/8 border-t border-white/8">
                  {[["251", "views"], ["72", "dl"], ["16", "shares"]].map(([v, l]) => (
                    <div key={l} className="py-3 text-center">
                      <p className="tabular-nums text-base font-black text-[#e8320a]">{v}</p>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-white/25">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schools strip */}
        <div className="border-t border-[#0e0e0e]/10 bg-[#0e0e0e]/[0.03] px-4 py-4 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto sm:gap-6">
            <p className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/30">Used at</p>
            <div className="flex shrink-0 items-center gap-5 sm:flex-wrap sm:gap-6">
              {["Stanford", "MIT", "Berkeley", "CMU", "Georgia Tech", "UT Austin", "NYU"].map((s) => (
                <span key={s} className="shrink-0 text-[11px] font-black uppercase tracking-widest text-[#0e0e0e]/20">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 01 — create ────────────────────────────────── */}
      <section className="border-b border-[#0e0e0e]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_1px_1fr]">
            <div className="py-12 sm:py-16 lg:pr-16">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#0e0e0e]/30">01 — Create</p>
              <h2 className="mt-4 text-[clamp(2rem,7vw,3.8rem)] font-black leading-[0.9] tracking-[-0.03em]">
                Show your<br />unique career<br /><em className="not-italic text-[#e8320a]">story.</em>
              </h2>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#0e0e0e]/50">
                Upload your resume, add your top three projects, and publish. foliopage turns your work history into something recruiters can't ignore.
              </p>
              <Link href="/sign-up" className="group mt-7 inline-flex items-center gap-2 border border-[#0e0e0e] bg-[#0e0e0e] px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-[#0e0e0e]">
                Build your story <ArrowRight size={11} weight="bold" />
              </Link>
            </div>
            <div className="hidden bg-[#0e0e0e]/10 lg:block" />
            <div className="border-t border-[#0e0e0e]/10 py-12 sm:py-16 lg:border-t-0 lg:pl-16">
              <div className="w-full border border-[#0e0e0e]/12 bg-white">
                <div className="border-b border-[#0e0e0e]/8 px-5 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/30">Your profile structure</p>
                </div>
                <div className="divide-y divide-[#0e0e0e]/8">
                  {[
                    { num: "01", label: "Resume block", sub: "One-click download" },
                    { num: "02", label: "Project cards", sub: "With impact metrics" },
                    { num: "03", label: "Skills & tech stack", sub: "Structured display" },
                    { num: "04", label: "Contact & socials", sub: "All links in one place" },
                  ].map((item) => (
                    <div key={item.num} className="group flex items-center gap-5 px-5 py-4 transition-colors hover:bg-[#0e0e0e]/[0.02]">
                      <span className="font-mono text-[9px] text-[#0e0e0e]/25">{item.num}</span>
                      <div className="flex-1">
                        <p className="text-sm font-black">{item.label}</p>
                        <p className="text-xs text-[#0e0e0e]/40">{item.sub}</p>
                      </div>
                      <ArrowRight size={11} className="text-[#0e0e0e]/15 transition-all group-hover:translate-x-0.5 group-hover:text-[#e8320a]" />
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#0e0e0e]/8 bg-[#0e0e0e] px-5 py-3 text-center font-mono text-[10px] font-bold text-[#e8320a]">
                  foliopage.app/yourname ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="border-b border-[#0e0e0e]/10 bg-[#0e0e0e]">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 divide-x divide-white/8 sm:grid-cols-4">
            {[
              { value: "10 min", label: "avg. setup time" },
              { value: "1 link", label: "for every application" },
              { value: "3×", label: "more recruiter replies" },
              { value: "free", label: "to start, forever" },
            ].map((stat, i) => (
              <div key={stat.value} className={`px-4 py-10 text-center sm:px-8 sm:py-12 ${i === 2 ? "border-t border-white/8 sm:border-t-0" : ""} ${i === 3 ? "border-t border-white/8 sm:border-t-0" : ""}`}>
                <p className="tabular-nums text-[clamp(1.5rem,5vw,3.5rem)] font-black leading-none tracking-[-0.04em] text-[#e8320a]">{stat.value}</p>
                <p className="mt-2 font-mono text-[8px] uppercase tracking-widest text-white/30 sm:text-[9px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="border-b border-[#0e0e0e]/10">

        {/* Analytics */}
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid items-stretch lg:grid-cols-[1fr_1px_1fr]">
            <div className="border-b border-[#0e0e0e]/10 py-12 sm:py-16 lg:border-b-0 lg:pr-16">
              <div className="w-full border border-[#0e0e0e]/12 bg-white">
                <div className="border-b border-[#0e0e0e]/8 px-5 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/30">Analytics dashboard</p>
                </div>
                <div className="grid grid-cols-2 divide-x divide-y divide-[#0e0e0e]/8">
                  {[
                    { value: "251", label: "Profile views", Icon: Eye },
                    { value: "72", label: "Resume downloads", Icon: Download },
                    { value: "34%", label: "Project click rate", Icon: ChartLine },
                    { value: "16", label: "Recruiter shares", Icon: ShareNetwork },
                  ].map(({ value, label, Icon }) => (
                    <div key={label} className="px-4 py-4 sm:px-5 sm:py-5">
                      <Icon size={14} className="mb-2 text-[#e8320a]" />
                      <p className="tabular-nums text-2xl font-black text-[#0e0e0e] sm:text-3xl">{value}</p>
                      <p className="mt-0.5 font-mono text-[8px] uppercase tracking-widest text-[#0e0e0e]/30">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#0e0e0e]/8 p-4">
                  <div className="flex h-10 items-end gap-0.5">
                    {[30, 45, 38, 60, 48, 72, 55, 80, 65, 90, 75, 100, 85, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-[#e8320a]" style={{ height: `${h}%`, opacity: 0.3 + (i / 14) * 0.7 }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden bg-[#0e0e0e]/10 lg:block" />
            <div className="flex flex-col justify-center py-12 sm:py-16 lg:pl-16">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#0e0e0e]/30">02 — Analytics</p>
              <h2 className="mt-4 text-[clamp(2rem,7vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em]">
                Get exposure<br />for your<br /><em className="not-italic text-[#e8320a]">profile.</em>
              </h2>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#0e0e0e]/50">
                See exactly what recruiters open, what they download, and what they skip. Iterate your profile like a product.
              </p>
              <ul className="mt-6 space-y-3">
                {["Profile view counts by day", "Resume download tracking", "Project click-through rates", "Recruiter share events"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-xs text-[#0e0e0e]/60">
                    <span className="h-px w-4 shrink-0 bg-[#e8320a]" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Share — ink */}
        <div className="border-t border-[#0e0e0e]/10 bg-[#0e0e0e]">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="grid items-stretch lg:grid-cols-[1fr_1px_1fr]">
              <div className="flex flex-col justify-center border-b border-white/8 py-12 sm:py-16 lg:border-b-0 lg:pr-16">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">03 — Share</p>
                <h2 className="mt-4 text-[clamp(2rem,7vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
                  One link.<br /><em className="not-italic text-[#e8320a]">Everywhere.</em>
                </h2>
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/45">
                  Drop it in your LinkedIn bio, email signature, or GitHub README. One URL that always shows your best work.
                </p>
                <Link href="/sign-up" className="group mt-7 inline-flex w-fit items-center gap-2 border border-[#e8320a] bg-[#e8320a] px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-[#e8320a]">
                  Claim your link <ArrowRight size={11} weight="bold" />
                </Link>
              </div>
              <div className="hidden bg-white/8 lg:block" />
              <div className="flex items-center py-12 sm:py-16 lg:pl-16">
                <div className="w-full space-y-2">
                  {[
                    { platform: "LinkedIn Bio", url: "foliopage.app/alexchen", badge: "2.3k views" },
                    { platform: "Email Signature", url: "foliopage.app/alexchen", badge: "147 clicks" },
                    { platform: "GitHub README", url: "foliopage.app/alexchen", badge: "432 views" },
                  ].map((item) => (
                    <div key={item.platform} className="flex items-center justify-between border border-white/10 bg-white/[0.04] px-4 py-4 sm:px-5">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">{item.platform}</p>
                        <p className="mt-0.5 text-xs font-bold text-white">{item.url}</p>
                      </div>
                      <span className="border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-white/40">{item.badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resume-first */}
        <div className="border-t border-[#0e0e0e]/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="grid items-stretch lg:grid-cols-[1fr_1px_1fr]">
              <div className="border-b border-[#0e0e0e]/10 py-12 sm:py-16 lg:border-b-0 lg:pr-16">
                <div className="w-full border border-[#0e0e0e]/12 bg-white">
                  <div className="border-b border-[#0e0e0e]/8 px-5 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/30">Resume block</p>
                      <span className="border border-[#e8320a]/30 bg-[#e8320a]/8 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#e8320a]">One-click download</span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#e8320a]/20 bg-[#e8320a]/8 sm:h-11 sm:w-11">
                        <FilePdf size={18} className="text-[#e8320a]" />
                      </div>
                      <div>
                        <p className="text-sm font-black">Alex_Chen_Resume_2025.pdf</p>
                        <p className="mt-0.5 font-mono text-[9px] text-[#0e0e0e]/35">Stanford CS · Available Summer 2025</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {["Python", "React", "ML"].map((t) => (
                            <span key={t} className="border border-[#0e0e0e]/10 bg-[#0e0e0e]/[0.04] px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#0e0e0e]/40">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-[#0e0e0e]/8 border-t border-[#0e0e0e]/8">
                    {["ML Engineer", "Full-Stack", "Data Science"].map((role) => (
                      <div key={role} className="py-3 text-center font-mono text-[8px] uppercase tracking-wider text-[#0e0e0e]/35">{role}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden bg-[#0e0e0e]/10 lg:block" />
              <div className="flex flex-col justify-center py-12 sm:py-16 lg:pl-16">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#0e0e0e]/30">04 — Resume-first</p>
                <h2 className="mt-4 text-[clamp(2rem,7vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em]">
                  Own your career<br /><em className="not-italic text-[#e8320a]">narrative.</em>
                </h2>
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#0e0e0e]/50">
                  Your resume isn't buried. It's the centerpiece — alongside projects that show impact, not just effort.
                </p>
                <ul className="mt-6 space-y-3">
                  {["PDF resume with instant download", "Impact-framed project cards", "Skills and tech stack display", "Custom domain support on Member"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-xs text-[#0e0e0e]/60">
                      <span className="h-px w-4 shrink-0 bg-[#e8320a]" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="border-b border-[#0e0e0e]/10 bg-[#0e0e0e]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
          <div className="mb-10 flex items-end justify-between border-b border-white/8 pb-6 sm:mb-12">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">Social proof</p>
              <h2 className="mt-2 text-[clamp(1.6rem,6vw,3rem)] font-black leading-[0.9] tracking-[-0.03em] text-white">
                What people<br />are saying.
              </h2>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">{testimonials.length} reviews</span>
          </div>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {testimonials.map((t) => (
              <div key={t.name} className="mb-4 break-inside-avoid border border-white/8 bg-white/[0.03] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#e8320a] text-xs font-black text-white">{t.name[0]}</div>
                  <div>
                    <p className="text-xs font-black text-white">{t.name}</p>
                    <p className="font-mono text-[8px] text-white/30">{t.handle} · {t.role}</p>
                  </div>
                  <div className="ml-auto flex shrink-0 text-[#e8320a]">
                    {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={10} weight="fill" />)}
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-white/55">&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section id="pricing" className="border-b border-[#0e0e0e]/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
          <div className="mb-10 sm:mb-12">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#0e0e0e]/30">Pricing</p>
            <h2 className="mt-2 text-[clamp(2rem,7vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em]">
              Build your page<br /><em className="not-italic text-[#e8320a]">for free.</em>
            </h2>
          </div>
          <div className="grid gap-px bg-[#0e0e0e]/10 sm:grid-cols-2">
            {[
              { plan: "Free", price: "Rs.0", note: "/forever", features: ["1 page", "Up to 3 projects", "Resume block", "Basic analytics"], cta: "Start free", highlight: false },
              { plan: "Member", price: "Rs.499", note: "/month", features: ["Everything in Free", "Unlimited projects", "Custom domain", "Full analytics", "Priority support"], cta: "Go Member", highlight: true },
            ].map((tier) => (
              <div key={tier.plan} className={`relative flex flex-col p-6 sm:p-8 ${tier.highlight ? "bg-[#0e0e0e]" : "bg-[#f0ece2]"}`}>
                {tier.highlight && (
                  <span className="mb-4 inline-block w-fit border border-[#e8320a]/40 bg-[#e8320a]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#e8320a]">Most popular</span>
                )}
                <p className={`font-mono text-[9px] uppercase tracking-widest ${tier.highlight ? "text-white/30" : "text-[#0e0e0e]/30"}`}>{tier.plan}</p>
                <div className="mt-3 flex items-end gap-1">
                  <p className={`tabular-nums text-4xl font-black leading-none sm:text-5xl ${tier.highlight ? "text-white" : "text-[#0e0e0e]"}`}>{tier.price}</p>
                  <p className={`mb-1 font-mono text-[9px] uppercase tracking-wider ${tier.highlight ? "text-white/30" : "text-[#0e0e0e]/30"}`}>{tier.note}</p>
                </div>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-xs ${tier.highlight ? "text-white/60" : "text-[#0e0e0e]/60"}`}>
                      <CheckCircle size={12} weight="fill" className="shrink-0 text-[#e8320a]" />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up" className={`mt-7 block border px-4 py-3 text-center text-[10px] font-black uppercase tracking-widest transition-all ${tier.highlight ? "border-[#e8320a] bg-[#e8320a] text-white hover:bg-transparent hover:text-[#e8320a]" : "border-[#0e0e0e]/20 bg-transparent text-[#0e0e0e] hover:border-[#0e0e0e] hover:bg-[#0e0e0e] hover:text-white"}`}>
                  {tier.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="border-b border-[#0e0e0e]/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#0e0e0e]/30">FAQ</p>
              <h2 className="mt-2 text-[clamp(1.8rem,7vw,2.8rem)] font-black leading-[0.9] tracking-[-0.03em]">
                Questions?<br /><em className="not-italic text-[#e8320a]">Answered.</em>
              </h2>
            </div>
            <div className="divide-y divide-[#0e0e0e]/8">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="text-sm font-black">{faq.q}</span>
                    <span className="shrink-0 font-mono text-[10px] text-[#0e0e0e]/30 transition-all group-open:text-[#e8320a]">+ / −</span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-[#0e0e0e]/50">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-[#0e0e0e]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_400px] lg:gap-12">
            <div>
              <h2 className="text-[clamp(2.8rem,11vw,7rem)] font-black leading-[0.88] tracking-[-0.04em] text-white">
                Showcase<br />your career<br /><em className="not-italic text-[#e8320a]">today.</em>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/40">
                Join thousands of students and early-career builders who landed interviews with foliopage.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input type="email" placeholder="you@university.edu" className="flex-1 border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#e8320a]" />
                <button type="button" className="shrink-0 border border-[#e8320a] bg-[#e8320a] px-5 py-3.5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-[#e8320a]">
                  Claim link →
                </button>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {["Free forever plan", "Live in 10 minutes", "No credit card"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-white/25">
                    <CheckCircle size={9} weight="fill" className="text-[#e8320a]" />{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-[#0e0e0e]/10 bg-[#f0ece2]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-black tracking-tight">folio<span className="text-[#e8320a]">page</span></p>
            <div className="flex flex-wrap gap-5 sm:gap-8">
              {["About", "Features", "Pricing", "Blog", "Privacy", "Terms"].map((l) => (
                <Link key={l} href="#" className="font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/30 transition-colors hover:text-[#0e0e0e]">{l}</Link>
              ))}
            </div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/20">© 2025 foliopage</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
