import Link from "next/link";
import {
  Briefcase,
  ClockCounterClockwise,
  EnvelopeSimple,
  FilePdf,
  GraduationCap,
  LinkSimple,
  MapPin,
  Notepad,
  Sparkle,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import type { ChildPageData, ProfileData } from "@/lib/site-data";

interface ProfileShellProps {
  profile: ProfileData;
  recruiterMode: boolean;
  childPage?: ChildPageData;
}

function sectionClassName(theme: "light" | "blue" | "sage"): string {
  if (theme === "blue") {
    return "border border-black/15 bg-[#2f63c9] p-6 text-white sm:p-7";
  }

  if (theme === "sage") {
    return "border border-black/15 bg-[#d8dac7] p-6 sm:p-7";
  }

  return "border border-black/15 bg-white p-6 sm:p-7";
}

function resumeDateLabel(value: string): string {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProfileShell({
  profile,
  recruiterMode,
  childPage,
}: ProfileShellProps) {
  const showExpandedSections = !recruiterMode;
  const skillGroups: Array<{ label: string; values: string[] }> = [
    { label: "Languages", values: profile.skills.languages },
    { label: "Frameworks", values: profile.skills.frameworks },
    { label: "Tools", values: profile.skills.tools },
    { label: "Other", values: profile.skills.other },
  ];

  return (
    <div className="min-h-dvh bg-[#f2eee3] text-[#161616]">
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-6 sm:px-8">
        <header className="border border-black/15 bg-white px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link href="/" className="text-sm font-semibold">
              foliopage
            </Link>
            <div className="flex items-center gap-2 text-xs">
              <span className="border border-black/15 px-2 py-1">resume-first</span>
              {recruiterMode && (
                <span className="bg-[#f04939] px-2 py-1 font-semibold text-white">
                  recruiter view
                </span>
              )}
            </div>
          </div>
        </header>

        <section className="relative mt-8 border border-black/15 bg-[#c8ea2d] px-6 py-8 sm:px-10">
          <div className="absolute right-0 top-0 h-full w-2 bg-[#f04939]" />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex items-center gap-2 border border-black/20 bg-white/65 px-3 py-1 text-sm font-semibold">
                <GraduationCap size={16} aria-hidden />
                {profile.university} - Class of {profile.gradYear}
              </p>
              <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight sm:text-5xl">
                {profile.name}
              </h1>
              <p className="mt-3 max-w-2xl text-pretty text-base sm:text-lg">
                {profile.headline}
              </p>
              <p className="mt-3 max-w-2xl text-pretty text-sm text-black/75">
                {profile.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 border border-black/20 bg-white/75 px-3 py-1 font-semibold">
                  <Sparkle size={14} aria-hidden />
                  {profile.internshipStatus}
                </span>
                {profile.location && (
                  <span className="inline-flex items-center gap-1 border border-black/20 bg-white/75 px-3 py-1">
                    <MapPin size={14} aria-hidden />
                    {profile.location}
                  </span>
                )}
              </div>
            </div>

            <aside className="border border-black/15 bg-white/70 p-4">
              <p className="text-sm font-semibold">Profile actions</p>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={profile.resume.url}
                  className="inline-flex items-center justify-between bg-[#f04939] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d73d2e]"
                >
                  <span>Download resume</span>
                  <FilePdf size={16} aria-hidden />
                </a>
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="inline-flex items-center justify-between border border-black/15 bg-white px-4 py-2 text-sm font-medium hover:border-black"
                >
                  <span>Email contact</span>
                  <EnvelopeSimple size={16} aria-hidden />
                </a>
              </div>
              <div className="mt-4 border border-black/15 bg-white px-3 py-2 text-xs">
                <p className="inline-flex items-center gap-1">
                  <LinkSimple size={13} aria-hidden />
                  /{profile.username}
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className={`mt-8 ${sectionClassName("light")}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="inline-flex items-center gap-2 text-2xl font-semibold">
              <FilePdf size={20} aria-hidden className="text-[#f04939]" />
              Resume
            </h2>
            <p className="inline-flex items-center gap-1 text-xs text-black/70 tabular-nums">
              <ClockCounterClockwise size={14} aria-hidden />
              Updated {resumeDateLabel(profile.resume.lastUpdated)}
            </p>
          </div>
          <p className="mt-1 text-sm text-black/70">{profile.resume.fileSizeLabel}</p>
          <div className="mt-4 border border-dashed border-black/25 bg-[#f2eee3] p-6 text-sm text-black/65">
            Embedded resume preview area.
          </div>
        </section>

        <section
          className={`mt-8 ${sectionClassName(recruiterMode ? "light" : "blue")}`}
        >
          <h2 className="inline-flex items-center gap-2 text-2xl font-semibold">
            <Briefcase size={20} aria-hidden className={recruiterMode ? "text-[#f04939]" : ""} />
            Projects
          </h2>
          <div className="mt-5 grid gap-3">
            {profile.projects.map((project) => (
              <article
                key={project.title}
                className={
                  recruiterMode
                    ? "border border-black/15 bg-white p-4"
                    : "border border-white/30 bg-black/10 p-4"
                }
              >
                <h3
                  className={
                    recruiterMode
                      ? "text-base font-semibold text-black"
                      : "text-base font-semibold text-white"
                  }
                >
                  {project.title}
                </h3>
                <p
                  className={
                    recruiterMode
                      ? "mt-1 text-sm text-black/70"
                      : "mt-1 text-sm text-white/85"
                  }
                >
                  {project.summary}
                </p>
                <div
                  className={
                    recruiterMode
                      ? "mt-3 space-y-1 text-sm text-black/75"
                      : "mt-3 space-y-1 text-sm text-white/90"
                  }
                >
                  <p>
                    <span className="font-semibold">Problem:</span> {project.problem}
                  </p>
                  <p>
                    <span className="font-semibold">Solution:</span> {project.solution}
                  </p>
                  <p>
                    <span className="font-semibold">Impact:</span> {project.impact}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className={
                        recruiterMode
                          ? "border border-black/20 px-2 py-1"
                          : "border border-white/35 bg-black/10 px-2 py-1 text-white"
                      }
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      className={
                        recruiterMode
                          ? "border border-black/20 px-3 py-1 hover:border-black"
                          : "border border-white/40 bg-white px-3 py-1 font-semibold text-[#2f63c9]"
                      }
                    >
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      className={
                        recruiterMode
                          ? "border border-black/20 px-3 py-1 hover:border-black"
                          : "border border-white/40 bg-white px-3 py-1 font-semibold text-[#2f63c9]"
                      }
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {childPage && (
          <section className={`mt-8 ${sectionClassName("sage")}`}>
            <p className="text-xs text-black/65">
              /{profile.username}/{childPage.slugSegments.join("/")}
            </p>
            <h2 className="mt-2 text-balance text-3xl font-semibold">{childPage.title}</h2>
            <p className="mt-2 text-pretty text-sm text-black/70">{childPage.subtitle}</p>
            <div className="mt-4 grid gap-3">
              {childPage.blocks.map((block) => (
                <article key={block.heading} className="border border-black/15 bg-white p-4">
                  <h3 className="text-base font-semibold">{block.heading}</h3>
                  <p className="mt-2 text-pretty text-sm text-black/70">{block.body}</p>
                  {block.links && block.links.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {block.links.map((entry) => (
                        <a
                          key={entry.href}
                          href={entry.href}
                          className="border border-black/20 px-3 py-1 hover:border-black"
                        >
                          {entry.label}
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {showExpandedSections && (
          <section className={`mt-8 ${sectionClassName("light")}`}>
            <h2 className="inline-flex items-center gap-2 text-2xl font-semibold">
              <Notepad size={20} aria-hidden className="text-[#f04939]" />
              Skills
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <article key={group.label} className="border border-black/15 p-4">
                  <h3 className="text-sm font-semibold">{group.label}</h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {group.values.map((value) => (
                      <span key={value} className="border border-black/20 px-2 py-1">
                        {value}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {showExpandedSections && profile.experiences.length > 0 && (
          <section className={`mt-8 ${sectionClassName("light")}`}>
            <h2 className="inline-flex items-center gap-2 text-2xl font-semibold">
              <UserCircle size={20} aria-hidden className="text-[#f04939]" />
              Experience
            </h2>
            <div className="mt-4 grid gap-3">
              {profile.experiences.map((experience) => (
                <article
                  key={`${experience.role}-${experience.org}`}
                  className="border border-black/15 p-4"
                >
                  <p className="font-semibold">{experience.role}</p>
                  <p className="text-sm text-black/65">
                    {experience.org} - {experience.period}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-black/75">
                    {experience.bullets.map((bullet) => (
                      <li key={bullet}>- {bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className={`mt-8 ${sectionClassName("light")}`}>
          <h2 className="inline-flex items-center gap-2 text-2xl font-semibold">
            <EnvelopeSimple size={20} aria-hidden className="text-[#f04939]" />
            Contact
          </h2>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <a
              href={`mailto:${profile.contact.email}`}
              className="border border-black/20 px-3 py-2 hover:border-black"
            >
              {profile.contact.email}
            </a>
            <a
              href={profile.contact.linkedin}
              className="border border-black/20 px-3 py-2 hover:border-black"
            >
              LinkedIn
            </a>
            <a
              href={profile.contact.github}
              className="border border-black/20 px-3 py-2 hover:border-black"
            >
              GitHub
            </a>
            {profile.contact.calendar && (
              <a
                href={profile.contact.calendar}
                className="border border-black/20 px-3 py-2 hover:border-black"
              >
                Calendar
              </a>
            )}
          </div>
        </section>

        {profile.plan === "free" && !recruiterMode && (
          <footer className="mt-8 border border-black/15 bg-white px-4 py-3 text-center text-xs text-black/60">
            Built with foliopage
          </footer>
        )}
      </main>
    </div>
  );
}

