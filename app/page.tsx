import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Briefcase,
  ChartLine,
  CheckCircle,
  FilePdf,
  LinkSimple,
  RocketLaunch,
  ShareNetwork,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { listProfiles } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "foliopage - Link in bio for careers",
  description:
    "A resume-first link in bio for students and early careers. Build once, share everywhere.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "foliopage - A link in bio built for careers",
    description:
      "Build your resume, projects, and contact into one clean profile link.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "foliopage - A link in bio built for careers",
    description:
      "Build your resume, projects, and contact into one clean profile link.",
  },
};

const faqs = [
  "Is foliopage free to start?",
  "Can I use my own domain?",
  "How fast can I launch?",
  "Can recruiters download my resume?",
];

function bandClip(offset: number): React.CSSProperties {
  return {
    clipPath: `polygon(0 ${offset}%, 100% 0, 100% ${100 - offset}%, 0 100%)`,
  };
}

export default function Home() {
  const [featuredProfile] = listProfiles();

  return (
    <div className="min-h-dvh bg-[#f2eee3] text-[#161616]">
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-6 sm:px-8">
        <header className="border border-black/15 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">foliopage</p>
            <div className="flex items-center gap-2">
              <Link
                href={`/${featuredProfile.username}`}
                className="border border-black/25 px-4 py-2 text-sm font-medium hover:border-black"
              >
                Demo
              </Link>
              <Link
                href="/sign-up"
                className="bg-[#f04939] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d73d2e]"
              >
                Start free
              </Link>
            </div>
          </div>
        </header>

        <section className="relative mt-8 border border-black/15 bg-[#c8ea2d] px-6 py-10 sm:px-10 sm:py-14">
          <div className="absolute right-0 top-0 h-full w-2 bg-[#f04939]" />
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="inline-flex items-center gap-2 border border-black/25 bg-white/60 px-3 py-1 text-sm font-semibold">
                <RocketLaunch size={16} aria-hidden />
                link in bio for careers
              </p>
              <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-tight sm:text-6xl">
                Less profile noise.
                <br />
                More interview callbacks.
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-base text-black/75 sm:text-lg">
                Build one clean link for your resume, projects, and contact.
                Share it across every internship application.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-[#1f2937]"
                >
                  Build your page
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link
                  href={`/${featuredProfile.username}?view=recruiter`}
                  className="border border-black/25 px-5 py-3 text-sm font-medium hover:border-black"
                >
                  Recruiter preview
                </Link>
              </div>
            </div>
            <aside className="border border-black/20 bg-white/70 p-4">
              <p className="text-sm font-semibold">live structure</p>
              <div className="mt-3 space-y-2 text-sm">
                <p className="border border-black/15 bg-white p-2">Resume block</p>
                <p className="border border-black/15 bg-white p-2">
                  Project cards with impact
                </p>
                <p className="border border-black/15 bg-white p-2">Skills + contact</p>
              </div>
              <p className="mt-4 border border-black/15 bg-white p-2 text-sm">
                domain.com/username
              </p>
            </aside>
          </div>
        </section>

        <section className="mt-8 grid gap-0 border border-black/15 sm:grid-cols-3">
          <article className="border-b border-black/15 bg-[#2f63c9] p-6 text-white sm:border-b-0 sm:border-r">
            <p className="tabular-nums text-4xl font-semibold">10 min</p>
            <p className="mt-1 text-pretty text-sm text-white/85">average setup time</p>
          </article>
          <article className="border-b border-black/15 bg-[#8a0b24] p-6 text-white sm:border-b-0 sm:border-r">
            <p className="tabular-nums text-4xl font-semibold">1 link</p>
            <p className="mt-1 text-pretty text-sm text-white/85">
              for applications, referrals, DMs
            </p>
          </article>
          <article className="bg-[#d8dac7] p-6">
            <p className="tabular-nums text-4xl font-semibold">251</p>
            <p className="mt-1 text-pretty text-sm text-black/70">profile views example</p>
          </article>
        </section>

        <section className="relative mt-10 border border-black/15 bg-[#2f63c9] px-6 py-12 text-white sm:px-10">
          <div className="absolute inset-0 opacity-20" style={bandClip(6)} />
          <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="border border-white/25 bg-black/10 p-5">
              <p className="text-sm font-semibold">Create in minutes</p>
              <ul className="mt-4 space-y-2 text-sm text-white/85">
                <li className="border border-white/25 px-3 py-2">Upload resume PDF</li>
                <li className="border border-white/25 px-3 py-2">Add top 3 projects</li>
                <li className="border border-white/25 px-3 py-2">Publish your link</li>
              </ul>
            </article>
            <div>
              <h2 className="text-balance text-4xl font-semibold leading-tight">
                A launch page that looks ready for hiring season.
              </h2>
              <p className="mt-3 max-w-xl text-pretty text-sm text-white/85">
                You bring proof of work. foliopage handles clean presentation and
                shareability.
              </p>
              <Link
                href="/dashboard"
                className="mt-5 inline-flex items-center gap-2 bg-[#f04939] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d73d2e]"
              >
                Start now
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 border border-black/15 bg-[#8a0b24] px-6 py-12 text-white sm:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-balance text-4xl font-semibold leading-tight">
                Share everywhere. Stay consistent.
              </h2>
              <p className="mt-3 text-pretty text-sm text-white/85">
                Use the same profile for internships, hackathons, recruiter outreach,
                and portfolio submissions.
              </p>
              <Link
                href={`/${featuredProfile.username}`}
                className="mt-5 inline-flex items-center gap-2 bg-white px-4 py-2 text-sm font-semibold text-[#8a0b24] hover:bg-[#f3f1e8]"
              >
                Copy link format
                <LinkSimple size={16} aria-hidden />
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                "Applications",
                "Referrals",
                "LinkedIn bio",
                "Career fairs",
              ].map((item) => (
                <p key={item} className="border border-white/25 bg-black/10 px-4 py-4 text-sm">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 border border-black/15 bg-[#d8dac7] px-6 py-12 sm:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="grid gap-2 sm:grid-cols-2">
              <p className="border border-black/10 bg-[#f2eee3] p-4 text-sm">
                <span className="block tabular-nums text-2xl font-semibold">251</span>
                profile views
              </p>
              <p className="border border-black/10 bg-[#f2eee3] p-4 text-sm">
                <span className="block tabular-nums text-2xl font-semibold">72</span>
                resume downloads
              </p>
              <p className="border border-black/10 bg-[#f2eee3] p-4 text-sm">
                <span className="block tabular-nums text-2xl font-semibold">34%</span>
                project clicks
              </p>
              <p className="border border-black/10 bg-[#f2eee3] p-4 text-sm">
                <span className="block tabular-nums text-2xl font-semibold">16</span>
                recruiter shares
              </p>
            </article>
            <div>
              <h2 className="text-balance text-4xl font-semibold leading-tight">
                Analytics that help you iterate faster.
              </h2>
              <p className="mt-3 text-pretty text-sm text-black/70">
                See what recruiters open, what they click, and where to improve your
                profile for better response rates.
              </p>
              <Link
                href={`/${featuredProfile.username}`}
                className="mt-5 inline-flex items-center gap-2 bg-[#f04939] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d73d2e]"
              >
                Explore analytics
                <ChartLine size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 border border-black/15 bg-[#f7f5ee] px-6 py-10 sm:px-10">
          <h2 className="text-center text-balance text-3xl font-semibold">
            Trusted by student builders and early-career teams.
          </h2>
          <div className="mt-6 grid gap-2 sm:grid-cols-4">
            {["Hackathons", "CS Clubs", "Career Centers", "Founders"].map((item) => (
              <p key={item} className="border border-black/10 bg-white px-3 py-4 text-center text-sm">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-10 border border-black/15 bg-white px-6 py-10 sm:px-10">
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="border border-black/10 p-4">
              <FilePdf size={20} className="text-[#f04939]" aria-hidden />
              <p className="mt-3 text-balance text-lg font-semibold">Resume-first design</p>
              <p className="mt-2 text-pretty text-sm text-black/70">
                Keep your most important artifact at the center.
              </p>
            </article>
            <article className="border border-black/10 p-4">
              <ShareNetwork size={20} className="text-[#f04939]" aria-hidden />
              <p className="mt-3 text-balance text-lg font-semibold">Share-ready structure</p>
              <p className="mt-2 text-pretty text-sm text-black/70">
                Built for DMs, submissions, and recruiter follow-ups.
              </p>
            </article>
            <article className="border border-black/10 p-4">
              <Briefcase size={20} className="text-[#f04939]" aria-hidden />
              <p className="mt-3 text-balance text-lg font-semibold">Hiring-focused copy</p>
              <p className="mt-2 text-pretty text-sm text-black/70">
                Project cards frame outcomes, not just features.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-10 border border-black/15 bg-[#8a0b24] px-6 py-10 text-white sm:px-10">
          <h2 className="text-center text-balance text-3xl font-semibold">Questions, answered.</h2>
          <div className="mx-auto mt-6 max-w-3xl divide-y divide-white/20 border border-white/20">
            {faqs.map((item) => (
              <details key={item} className="bg-black/10 px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-semibold">
                  {item}
                </summary>
                <p className="mt-2 text-pretty text-sm text-white/80">
                  foliopage keeps this simple so you can launch quickly and update as
                  your experience grows.
                </p>
              </details>
            ))}
          </div>
        </section>

        <section
          id="start"
          className="mt-10 border border-black/15 bg-[#5b2c86] px-6 py-12 text-white sm:px-10"
        >
          <h2 className="mx-auto max-w-2xl text-center text-balance text-4xl font-semibold">
            Jumpstart your corner of the internet.
          </h2>
          <div className="mx-auto mt-6 flex w-full max-w-xl flex-col gap-2 border border-white/30 bg-black/10 p-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border border-white/25 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f04939]"
            />
            <button
              type="button"
              className="bg-[#f04939] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d73d2e]"
            >
              Claim your link
            </button>
          </div>
          <div className="mt-6 grid gap-4 border border-white/20 bg-black/10 p-4 text-sm sm:grid-cols-3">
            <div>
              <p className="font-semibold">Free</p>
              <p className="tabular-nums text-3xl font-semibold">$0</p>
              <p className="mt-1 text-white/80">Up to 3 projects</p>
            </div>
            <div>
              <p className="font-semibold">Pro monthly</p>
              <p className="tabular-nums text-3xl font-semibold">$6</p>
              <p className="mt-1 text-white/80">Unlimited projects</p>
            </div>
            <div>
              <p className="font-semibold">Pro annual</p>
              <p className="tabular-nums text-3xl font-semibold">$29</p>
              <p className="mt-1 text-white/80">Best value</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/70">
            <p className="inline-flex items-center gap-1">
              <UsersThree size={14} aria-hidden />
              foliopage
            </p>
            <p className="inline-flex items-center gap-1 tabular-nums">
              <CheckCircle size={14} aria-hidden />
              domain.com/username
            </p>
          </div>
        </section>

        <section className="mt-10 border border-black/15 bg-white px-6 py-10 sm:px-10">
          <h2 className="text-center text-balance text-3xl font-semibold">
            What students and recruiters say
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="border border-black/10 bg-[#f7f5ee] p-5">
              <p className="text-sm font-semibold text-[#f04939]">5/5 rating</p>
              <p className="mt-2 text-pretty text-sm text-black/75">
                &quot;I replaced three links with one foliopage and started getting
                faster recruiter replies.&quot;
              </p>
              <p className="mt-3 text-sm font-semibold">Riya S.</p>
              <p className="text-xs text-black/60">CS student, internship seeker</p>
            </article>
            <article className="border border-black/10 bg-[#f7f5ee] p-5">
              <p className="text-sm font-semibold text-[#f04939]">5/5 rating</p>
              <p className="mt-2 text-pretty text-sm text-black/75">
                &quot;The project format helped me explain impact clearly during technical
                interviews.&quot;
              </p>
              <p className="mt-3 text-sm font-semibold">Marcus T.</p>
              <p className="text-xs text-black/60">Software engineering student</p>
            </article>
            <article className="border border-black/10 bg-[#f7f5ee] p-5">
              <p className="text-sm font-semibold text-[#f04939]">Recruiter feedback</p>
              <p className="mt-2 text-pretty text-sm text-black/75">
                &quot;Much easier to scan than a typical profile. Resume and project
                evidence are exactly where I expect them.&quot;
              </p>
              <p className="mt-3 text-sm font-semibold">Nina R.</p>
              <p className="text-xs text-black/60">Technical recruiter</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
