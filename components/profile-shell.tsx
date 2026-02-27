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
  ArrowUpRight,
  GithubLogo,
  LinkedinLogo,
  TwitterLogo,
  InstagramLogo,
  CalendarBlank,
} from "@phosphor-icons/react/dist/ssr";
import { resolveProfileTemplate } from "@/lib/profile-templates";
import type {
  ChildPageData,
  ProfileData,
  ResumeData,
  ResumeDisplayMode,
} from "@/lib/site-data";
import type { ProfileTemplateStyles } from "@/lib/profile-templates";

interface ProfileShellProps {
  profile: ProfileData;
  recruiterMode: boolean;
  childPage?: ChildPageData;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resumeDateLabel(value: string): string {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isPreviewableResumeUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return false;
  const normalized = trimmed.split("?")[0]?.split("#")[0]?.toLowerCase() ?? "";
  return normalized.endsWith(".pdf");
}

function resolveResumeDisplayMode(resume: ResumeData): ResumeDisplayMode {
  const selected = resume.displayMode ?? "without_preview";
  if (selected === "with_preview" && !isPreviewableResumeUrl(resume.previewUrl ?? resume.url)) {
    return "without_preview";
  }
  return selected;
}

type ContactEntry = { label: string; href: string; type: string };

function buildContactLinks(profile: ProfileData): ContactEntry[] {
  return [
    ...(profile.contact.email
      ? [{ label: profile.contact.email, href: `mailto:${profile.contact.email}`, type: "email" }]
      : []),
    ...(profile.contact.linkedin
      ? [{ label: "LinkedIn", href: profile.contact.linkedin, type: "linkedin" }]
      : []),
    ...(profile.contact.github
      ? [{ label: "GitHub", href: profile.contact.github, type: "github" }]
      : []),
    ...(profile.contact.twitter
      ? [{ label: "Twitter / X", href: profile.contact.twitter, type: "twitter" }]
      : []),
    ...(profile.contact.instagram
      ? [{ label: "Instagram", href: profile.contact.instagram, type: "instagram" }]
      : []),
    ...(profile.contact.calendar
      ? [{ label: "Book a call", href: profile.contact.calendar, type: "calendar" }]
      : []),
  ];
}

function ContactIcon({ type }: { type: string }) {
  const size = 15;
  switch (type) {
    case "email": return <EnvelopeSimple size={size} aria-hidden />;
    case "github": return <GithubLogo size={size} aria-hidden />;
    case "linkedin": return <LinkedinLogo size={size} aria-hidden />;
    case "twitter": return <TwitterLogo size={size} aria-hidden />;
    case "instagram": return <InstagramLogo size={size} aria-hidden />;
    case "calendar": return <CalendarBlank size={size} aria-hidden />;
    default: return <LinkSimple size={size} aria-hidden />;
  }
}

// ─── Shared section blocks ────────────────────────────────────────────────────

function HeroPills({
  profile,
  t,
}: {
  profile: ProfileData;
  t: ProfileTemplateStyles;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className={t.pill}>
        <GraduationCap size={12} aria-hidden />
        {profile.university} · {profile.gradYear}
      </span>
      {profile.location && (
        <span className={t.pill}>
          <MapPin size={12} aria-hidden />
          {profile.location}
        </span>
      )}
      <span className={t.pillAccent}>
        <Sparkle size={12} aria-hidden />
        {profile.internshipStatus}
      </span>
    </div>
  );
}

function HeroText({
  profile,
  t,
}: {
  profile: ProfileData;
  t: ProfileTemplateStyles;
}) {
  return (
    <>
      <h1 className={t.heroName}>{profile.name}</h1>
      <p className={t.heroHeadline}>{profile.headline}</p>
      <p className={t.heroBio}>{profile.summary}</p>
    </>
  );
}

function HeroCTAs({
  profile,
  t,
  hasResumeUrl,
}: {
  profile: ProfileData;
  t: ProfileTemplateStyles;
  hasResumeUrl: boolean;
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {hasResumeUrl && (
        <a href={profile.resume.url} download className={t.ctaPrimary}>
          <FilePdf size={16} aria-hidden />
          Download résumé
        </a>
      )}
      {profile.contact.email && (
        <a href={`mailto:${profile.contact.email}`} className={t.ctaOutline}>
          <EnvelopeSimple size={16} aria-hidden />
          Get in touch
        </a>
      )}
    </div>
  );
}

function ConnectSection({
  contactLinks,
  t,
}: {
  contactLinks: ContactEntry[];
  t: ProfileTemplateStyles;
}) {
  if (contactLinks.length === 0) return null;
  return (
    <section className={t.section}>
      <h2 className={t.sectionTitle}>
        <LinkSimple size={14} aria-hidden />
        Connect
      </h2>
      <div className="mt-3 flex flex-col gap-2">
        {contactLinks.map((entry) => (
          <a
            key={`${entry.type}-${entry.href}`}
            href={entry.href}
            target={entry.type !== "email" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={t.linkRow}
          >
            <span className={t.linkRowIcon}>
              <ContactIcon type={entry.type} />
            </span>
            <span className="flex-1 text-sm font-medium">{entry.label}</span>
            <ArrowUpRight size={13} className="opacity-35" aria-hidden />
          </a>
        ))}
      </div>
    </section>
  );
}

function ResumeSection({
  profile,
  t,
  hasResumeUrl,
  resumeMode,
  resumePreviewUrl,
}: {
  profile: ProfileData;
  t: ProfileTemplateStyles;
  hasResumeUrl: boolean;
  resumeMode: ResumeDisplayMode;
  resumePreviewUrl: string;
}) {
  return (
    <section className={t.section}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className={t.sectionTitle}>
          <FilePdf size={14} aria-hidden />
          Résumé
        </h2>
        <span className="inline-flex items-center gap-1 text-[11px] opacity-40 tabular-nums">
          <ClockCounterClockwise size={11} aria-hidden />
          {resumeDateLabel(profile.resume.lastUpdated)}
        </span>
      </div>
      {profile.resume.fileSizeLabel && (
        <p className="mt-0.5 text-[11px] opacity-40">{profile.resume.fileSizeLabel}</p>
      )}
      {resumeMode === "with_preview" && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
          <iframe
            src={resumePreviewUrl}
            title={`${profile.name} résumé`}
            className="h-[480px] w-full border-0 bg-[#f5f4ef]"
          />
        </div>
      )}
      {hasResumeUrl ? (
        <a href={profile.resume.url} download className={`${t.ctaOutline} mt-4`}>
          <FilePdf size={16} aria-hidden />
          Download PDF
        </a>
      ) : (
        <p className="mt-4 text-sm opacity-45">Résumé available on request.</p>
      )}
    </section>
  );
}

function ProjectsSection({
  profile,
  recruiterMode,
  t,
}: {
  profile: ProfileData;
  recruiterMode: boolean;
  t: ProfileTemplateStyles;
}) {
  return (
    <section className={t.section}>
      <h2 className={t.sectionTitle}>
        <Briefcase size={14} aria-hidden />
        Projects
      </h2>
      <div className="mt-3 flex flex-col gap-3">
        {profile.projects.map((project) => (
          <article
            key={project.title}
            className={recruiterMode ? t.projectCardAlt : t.projectCard}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold leading-tight">{project.title}</h3>
              <div className="flex shrink-0 gap-1">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={t.iconBtn}
                    aria-label="Live demo"
                  >
                    <ArrowUpRight size={13} aria-hidden />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={t.iconBtn}
                    aria-label="GitHub"
                  >
                    <GithubLogo size={13} aria-hidden />
                  </a>
                )}
              </div>
            </div>
            <p className="mt-1.5 text-sm opacity-65">{project.summary}</p>
            <div className="mt-3 grid gap-1 text-sm">
              <p>
                <span className="font-semibold opacity-85">Problem — </span>
                <span className="opacity-60">{project.problem}</span>
              </p>
              <p>
                <span className="font-semibold opacity-85">Solution — </span>
                <span className="opacity-60">{project.solution}</span>
              </p>
              <p>
                <span className="font-semibold opacity-85">Impact — </span>
                <span className="opacity-60">{project.impact}</span>
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span key={tech} className={t.chip}>{tech}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SkillsSection({ t, profile }: { t: ProfileTemplateStyles; profile: ProfileData }) {
  const skillGroups = [
    { label: "Languages", values: profile.skills.languages },
    { label: "Frameworks", values: profile.skills.frameworks },
    { label: "Tools", values: profile.skills.tools },
    { label: "Other", values: profile.skills.other },
  ].filter((g) => g.values.length > 0);

  return (
    <section className={t.section}>
      <h2 className={t.sectionTitle}>
        <Notepad size={14} aria-hidden />
        Skills
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <article key={group.label} className="rounded-2xl border border-black/8 bg-black/3 p-3">
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
              {group.label}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {group.values.map((value) => (
                <span key={value} className={t.chip}>{value}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection({ t, profile }: { t: ProfileTemplateStyles; profile: ProfileData }) {
  if (profile.experiences.length === 0) return null;
  return (
    <section className={t.section}>
      <h2 className={t.sectionTitle}>
        <UserCircle size={14} aria-hidden />
        Experience
      </h2>
      <div className="mt-3 flex flex-col gap-3">
        {profile.experiences.map((exp) => (
          <article
            key={`${exp.role}-${exp.org}`}
            className="rounded-2xl border border-black/8 bg-black/2 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-1">
              <p className="font-semibold leading-tight">{exp.role}</p>
              <p className="text-[11px] opacity-40 tabular-nums">{exp.period}</p>
            </div>
            <p className="mt-0.5 text-sm font-medium opacity-50">{exp.org}</p>
            <ul className="mt-2.5 space-y-1 text-sm">
              {exp.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 opacity-60">
                  <span aria-hidden className="mt-[3px] shrink-0 text-[9px]">▸</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function ChildPageSection({
  profile,
  childPage,
  t,
}: {
  profile: ProfileData;
  childPage: ChildPageData;
  t: ProfileTemplateStyles;
}) {
  return (
    <section className={t.section}>
      <p className="text-[11px] opacity-35">
        /{profile.username}/{childPage.slugSegments.join("/")}
      </p>
      <h2 className="mt-2 text-balance text-2xl font-semibold leading-tight">
        {childPage.title}
      </h2>
      <p className="mt-1 text-sm opacity-55">{childPage.subtitle}</p>
      <div className="mt-4 flex flex-col gap-3">
        {childPage.blocks.map((block) => (
          <article
            key={block.heading}
            className="rounded-2xl border border-black/10 bg-white/50 p-4"
          >
            <h3 className="text-sm font-semibold">{block.heading}</h3>
            <p className="mt-1.5 text-sm opacity-60">{block.body}</p>
            {block.links && block.links.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {block.links.map((entry) => (
                  <a
                    key={entry.href}
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={t.ctaOutline}
                  >
                    <LinkSimple size={13} aria-hidden />
                    {entry.label}
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── Layout renderers ─────────────────────────────────────────────────────────

/**
 * STACK — single centered column at every breakpoint.
 *
 * The column itself widens on larger screens (stackMain controls max-w).
 * Individual section internals reflow into denser grids at lg+:
 *   • Hero        — larger type, horizontal pill row
 *   • Connect     — 2-col link grid on lg+
 *   • Projects    — 2-col card grid on lg+
 *   • Skills      — 4-col chip groups on lg+
 *   • Experience  — 2-col entry grid on lg+
 *   • Résumé      — wider iframe preview
 */
function StackLayout({
  profile,
  recruiterMode,
  childPage,
  t,
  hasResumeUrl,
  resumeMode,
  resumePreviewUrl,
  contactLinks,
}: RenderProps) {
  const skillGroups = [
    { label: "Languages", values: profile.skills.languages },
    { label: "Frameworks", values: profile.skills.frameworks },
    { label: "Tools", values: profile.skills.tools },
    { label: "Other", values: profile.skills.other },
  ].filter((g) => g.values.length > 0);

  return (
    <main className={t.stackMain}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className={t.stackHeroCard}>
        {/* Pills: wrap on mobile, row on desktop */}
        <div className="flex flex-wrap gap-2">
          <span className={t.pill}>
            <GraduationCap size={12} aria-hidden />
            {profile.university} · {profile.gradYear}
          </span>
          {profile.location && (
            <span className={t.pill}>
              <MapPin size={12} aria-hidden />
              {profile.location}
            </span>
          )}
          <span className={t.pillAccent}>
            <Sparkle size={12} aria-hidden />
            {profile.internshipStatus}
          </span>
        </div>

        {/* Name + text — bigger on desktop */}
        <h1 className={t.heroName}>{profile.name}</h1>
        <p className={t.heroHeadline}>{profile.headline}</p>
        <p className={t.heroBio}>{profile.summary}</p>

        {/* CTAs — inline row, never stacked */}
        <div className="mt-5 flex flex-wrap gap-3">
          {hasResumeUrl && (
            <a href={profile.resume.url} download className={t.ctaPrimary}>
              <FilePdf size={16} aria-hidden />
              Download résumé
            </a>
          )}
          {profile.contact.email && (
            <a href={`mailto:${profile.contact.email}`} className={t.ctaOutline}>
              <EnvelopeSimple size={16} aria-hidden />
              Get in touch
            </a>
          )}
        </div>
      </section>

      {/* ── CONNECT — 1 col mobile → 2 col lg+ ───────────────────────────── */}
      {contactLinks.length > 0 && (
        <section className={t.section}>
          <h2 className={t.sectionTitle}>
            <LinkSimple size={14} aria-hidden />
            Connect
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
            {contactLinks.map((entry) => (
              <a
                key={`${entry.type}-${entry.href}`}
                href={entry.href}
                target={entry.type !== "email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={t.linkRow}
              >
                <span className={t.linkRowIcon}>
                  <ContactIcon type={entry.type} />
                </span>
                <span className="flex-1 truncate text-sm font-medium">{entry.label}</span>
                <ArrowUpRight size={13} className="shrink-0 opacity-35" aria-hidden />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── RÉSUMÉ ────────────────────────────────────────────────────────── */}
      <section className={t.section}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className={t.sectionTitle}>
            <FilePdf size={14} aria-hidden />
            Résumé
          </h2>
          <span className="inline-flex items-center gap-1 text-[11px] opacity-40 tabular-nums">
            <ClockCounterClockwise size={11} aria-hidden />
            {resumeDateLabel(profile.resume.lastUpdated)}
          </span>
        </div>
        {profile.resume.fileSizeLabel && (
          <p className="mt-0.5 text-[11px] opacity-40">{profile.resume.fileSizeLabel}</p>
        )}
        {resumeMode === "with_preview" && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
            <iframe
              src={resumePreviewUrl}
              title={`${profile.name} résumé`}
              className="h-[420px] w-full border-0 bg-[#f5f4ef] lg:h-[560px]"
            />
          </div>
        )}
        {hasResumeUrl ? (
          <a href={profile.resume.url} download className={`${t.ctaOutline} mt-4`}>
            <FilePdf size={16} aria-hidden />
            Download PDF
          </a>
        ) : (
          <p className="mt-4 text-sm opacity-45">Résumé available on request.</p>
        )}
      </section>

      {/* ── PROJECTS — 1 col mobile → 2 col lg+ ──────────────────────────── */}
      <section className={t.section}>
        <h2 className={t.sectionTitle}>
          <Briefcase size={14} aria-hidden />
          Projects
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {profile.projects.map((project) => (
            <article
              key={project.title}
              className={recruiterMode ? t.projectCardAlt : t.projectCard}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold leading-tight">{project.title}</h3>
                <div className="flex shrink-0 gap-1">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                      className={t.iconBtn} aria-label="Live demo">
                      <ArrowUpRight size={13} aria-hidden />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                      className={t.iconBtn} aria-label="GitHub">
                      <GithubLogo size={13} aria-hidden />
                    </a>
                  )}
                </div>
              </div>
              <p className="mt-1.5 text-sm opacity-65">{project.summary}</p>
              <div className="mt-3 grid gap-1 text-sm">
                <p><span className="font-semibold opacity-85">Problem — </span><span className="opacity-60">{project.problem}</span></p>
                <p><span className="font-semibold opacity-85">Solution — </span><span className="opacity-60">{project.solution}</span></p>
                <p><span className="font-semibold opacity-85">Impact — </span><span className="opacity-60">{project.impact}</span></p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span key={tech} className={t.chip}>{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── CHILD PAGE ────────────────────────────────────────────────────── */}
      {childPage && <ChildPageSection profile={profile} childPage={childPage} t={t} />}

      {/* ── SKILLS — 2 col mobile → 4 col lg+ ────────────────────────────── */}
      {!recruiterMode && skillGroups.length > 0 && (
        <section className={t.section}>
          <h2 className={t.sectionTitle}>
            <Notepad size={14} aria-hidden />
            Skills
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {skillGroups.map((group) => (
              <article key={group.label} className="rounded-2xl border border-black/8 bg-black/3 p-3">
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.values.map((value) => (
                    <span key={value} className={t.chip}>{value}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── EXPERIENCE — 1 col mobile → 2 col lg+ ────────────────────────── */}
      {!recruiterMode && profile.experiences.length > 0 && (
        <section className={t.section}>
          <h2 className={t.sectionTitle}>
            <UserCircle size={14} aria-hidden />
            Experience
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
            {profile.experiences.map((exp) => (
              <article
                key={`${exp.role}-${exp.org}`}
                className="rounded-2xl border border-black/8 bg-black/2 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-1">
                  <p className="font-semibold leading-tight">{exp.role}</p>
                  <p className="text-[11px] opacity-40 tabular-nums">{exp.period}</p>
                </div>
                <p className="mt-0.5 text-sm font-medium opacity-50">{exp.org}</p>
                <ul className="mt-2.5 space-y-1 text-sm">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2 opacity-60">
                      <span aria-hidden className="mt-[3px] shrink-0 text-[9px]">▸</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {profile.plan === "free" && !recruiterMode && (
        <footer className={t.footer}>
          Built with{" "}
          <Link href="/" className="underline underline-offset-2 opacity-70 hover:opacity-100">
            foliopage
          </Link>
        </footer>
      )}
    </main>
  );
}

/**
 * SIDEBAR — sticky left sidebar + scrollable right content.
 * Mobile (<md): collapses to single-column stack.
 * Used by: Dusk, Forest
 */
function SidebarLayout({
  profile,
  recruiterMode,
  childPage,
  t,
  hasResumeUrl,
  resumeMode,
  resumePreviewUrl,
  contactLinks,
}: RenderProps) {
  return (
    <div className={t.sidebarOuter}>
      {/* ── LEFT (sticky sidebar on md+) ── */}
      <aside className={t.sidebarLeft}>
        <HeroPills profile={profile} t={t} />
        <HeroText profile={profile} t={t} />
        <HeroCTAs profile={profile} t={t} hasResumeUrl={hasResumeUrl} />

        {/* Connect links live in sidebar on desktop */}
        {contactLinks.length > 0 && (
          <div className="mt-6">
            <p className={`${t.sectionTitle} mb-3`}>
              <LinkSimple size={13} aria-hidden />
              Connect
            </p>
            <div className="flex flex-col gap-2">
              {contactLinks.map((entry) => (
                <a
                  key={`${entry.type}-${entry.href}`}
                  href={entry.href}
                  target={entry.type !== "email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={t.linkRow}
                >
                  <span className={t.linkRowIcon}>
                    <ContactIcon type={entry.type} />
                  </span>
                  <span className="flex-1 text-sm font-medium">{entry.label}</span>
                  <ArrowUpRight size={12} className="opacity-30" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Résumé meta in sidebar */}
        <div className="mt-6">
          <div className={`${t.divider} !mt-0 mb-4`} />
          <div className="flex flex-wrap items-center justify-between gap-1">
            <p className={t.sectionTitle}>
              <FilePdf size={13} aria-hidden />
              Résumé
            </p>
            <span className="text-[10px] opacity-35 tabular-nums">
              {resumeDateLabel(profile.resume.lastUpdated)}
            </span>
          </div>
          {profile.resume.fileSizeLabel && (
            <p className="mt-0.5 text-[11px] opacity-35">{profile.resume.fileSizeLabel}</p>
          )}
          {hasResumeUrl ? (
            <a href={profile.resume.url} download className={`${t.ctaOutline} mt-3 w-full`}>
              <FilePdf size={15} aria-hidden />
              Download PDF
            </a>
          ) : (
            <p className="mt-2 text-xs opacity-40">Available on request.</p>
          )}
        </div>

        {profile.plan === "free" && !recruiterMode && (
          <p className={`${t.footer} mt-10 text-left`}>
            Built with{" "}
            <Link href="/" className="underline underline-offset-2 opacity-60 hover:opacity-100">
              foliopage
            </Link>
          </p>
        )}
      </aside>

      {/* ── RIGHT (scrollable content) ── */}
      <main className={t.sidebarRight}>
        <ProjectsSection profile={profile} recruiterMode={recruiterMode} t={t} />

        {childPage && <ChildPageSection profile={profile} childPage={childPage} t={t} />}

        {!recruiterMode && <SkillsSection profile={profile} t={t} />}
        {!recruiterMode && <ExperienceSection profile={profile} t={t} />}
      </main>
    </div>
  );
}

/**
 * MAGAZINE — full-width hero banner + responsive bento grid below.
 * Mobile (<lg): single column stack.
 * lg+: two-column bento (wide + narrow).
 * Used by: Chalk
 */
function MagazineLayout({
  profile,
  recruiterMode,
  childPage,
  t,
  hasResumeUrl,
  resumeMode,
  resumePreviewUrl,
  contactLinks,
}: RenderProps) {
  return (
    <div className={t.magazineMain}>
      {/* ── HERO BANNER (full bleed) ── */}
      <header className={t.magazineHeroBanner}>
        {/* Left: name + meta */}
        <div>
          <div className="flex flex-wrap gap-2">
            <HeroPills profile={profile} t={t} />
          </div>
          <HeroText profile={profile} t={t} />
        </div>
        {/* Right: CTAs (show as a separate column on lg+) */}
        <div className="mt-6 flex flex-wrap gap-3 lg:mt-0 lg:flex-col lg:items-end lg:gap-2">
          {hasResumeUrl && (
            <a href={profile.resume.url} download className={t.ctaPrimary}>
              <FilePdf size={16} aria-hidden />
              Download résumé
            </a>
          )}
          {profile.contact.email && (
            <a href={`mailto:${profile.contact.email}`} className={t.ctaOutline}>
              <EnvelopeSimple size={16} aria-hidden />
              Get in touch
            </a>
          )}
        </div>
      </header>

      {/* ── BENTO GRID ── */}
      <div className={t.magazineGrid}>
        {/* Wide column — projects + experience */}
        <div className={t.magazineColWide}>
          <ProjectsSection profile={profile} recruiterMode={recruiterMode} t={t} />
          {childPage && <ChildPageSection profile={profile} childPage={childPage} t={t} />}
          {!recruiterMode && <ExperienceSection profile={profile} t={t} />}
        </div>

        {/* Narrow column — connect + résumé + skills */}
        <div className={t.magazineColNarrow}>
          <ConnectSection contactLinks={contactLinks} t={t} />

          {/* Résumé block */}
          <section className={t.section}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className={t.sectionTitle}>
                <FilePdf size={14} aria-hidden />
                Résumé
              </h2>
              <span className="text-[11px] opacity-40 tabular-nums">
                {resumeDateLabel(profile.resume.lastUpdated)}
              </span>
            </div>
            {profile.resume.fileSizeLabel && (
              <p className="mt-0.5 text-[11px] opacity-40">{profile.resume.fileSizeLabel}</p>
            )}
            {resumeMode === "with_preview" && (
              <div className="mt-3 overflow-hidden rounded-2xl border border-black/10">
                <iframe
                  src={resumePreviewUrl}
                  title={`${profile.name} résumé`}
                  className="h-64 w-full border-0 bg-[#f5f4ef]"
                />
              </div>
            )}
            {hasResumeUrl ? (
              <a href={profile.resume.url} download className={`${t.ctaOutline} mt-3`}>
                <FilePdf size={15} aria-hidden />
                Download PDF
              </a>
            ) : (
              <p className="mt-3 text-sm opacity-40">Available on request.</p>
            )}
          </section>

          {!recruiterMode && <SkillsSection profile={profile} t={t} />}

          {profile.plan === "free" && !recruiterMode && (
            <footer className={t.footer}>
              Built with{" "}
              <Link href="/" className="underline underline-offset-2 opacity-70 hover:opacity-100">
                foliopage
              </Link>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shared props type ────────────────────────────────────────────────────────

interface RenderProps {
  profile: ProfileData;
  recruiterMode: boolean;
  childPage?: ChildPageData;
  t: ProfileTemplateStyles;
  hasResumeUrl: boolean;
  resumeMode: ResumeDisplayMode;
  resumePreviewUrl: string;
  contactLinks: ContactEntry[];
}

// ─── Root shell ───────────────────────────────────────────────────────────────

export function ProfileShell({ profile, recruiterMode, childPage }: ProfileShellProps) {
  const template = resolveProfileTemplate(profile.templateId);
  const t = template.styles;

  const resumeMode = resolveResumeDisplayMode(profile.resume);
  const resumePreviewUrl = profile.resume.previewUrl ?? profile.resume.url;
  const hasResumeUrl = Boolean(profile.resume.url.trim() && profile.resume.url.trim() !== "#");
  const contactLinks = buildContactLinks(profile);

  const renderProps: RenderProps = {
    profile,
    recruiterMode,
    childPage,
    t,
    hasResumeUrl,
    resumeMode,
    resumePreviewUrl,
    contactLinks,
  };

  return (
    <div className={t.page}>
      {template.layout === "sidebar" ? (
        <SidebarLayout {...renderProps} />
      ) : template.layout === "magazine" ? (
        <MagazineLayout {...renderProps} />
      ) : (
        <StackLayout {...renderProps} />
      )}
    </div>
  );
}