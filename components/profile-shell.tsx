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
} from "@/lib/profile-data";
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

function renderManuscriptChapterAnchor(
  t: ProfileTemplateStyles,
  n: number,
  label: string,
) {
  return (
    <div className="relative flex items-end gap-6 overflow-hidden border-t border-[#e8e0d4]/8 pt-8 pb-4">
      <span
        className="select-none text-[clamp(80px,12vw,160px)] font-light leading-none text-[#e8e0d4]/[0.06]"
        style={{ fontFamily: t.fontDisplay || undefined }}
        aria-hidden
      >
        {String(n).padStart(2, "0")}
      </span>
      <span className={`${t.sectionTitle} mb-4`}>{label}</span>
    </div>
  );
}

function renderVerdictChapterAnchor(
  t: ProfileTemplateStyles,
  n: number,
  label: string,
) {
  return (
    <div className="relative overflow-hidden border-t-2 border-[#111111] pt-8 pb-6">
      <span
        className="absolute -top-2 left-0 select-none text-[clamp(80px,11vw,140px)] font-normal leading-none text-[#111111]/[0.04]"
        style={{ fontFamily: t.fontDisplay || undefined }}
        aria-hidden
      >
        {String(n).padStart(2, "0")}
      </span>
      <span className={`${t.sectionTitle} relative z-10`}>{label}</span>
    </div>
  );
}

// ─── Shared section blocks ────────────────────────────────────────────────────

function ProfileImage({
  profile,
  className,
}: {
  profile: ProfileData;
  className?: string;
}) {
  if (!profile.profileImageUrl) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={profile.profileImageUrl}
      alt={`${profile.name} profile photo`}
      className={[
        "h-20 w-20 rounded-2xl border border-black/15 bg-black/5 object-cover",
        className ?? "",
      ].join(" ")}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
}

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
      <h1 className={t.heroName} style={{ fontFamily: t.fontDisplay || undefined }}>
        {profile.name}
      </h1>
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
        {/* Avatar — slightly smaller on mobile, larger on desktop */}
        <ProfileImage profile={profile} className="mb-4 h-20 w-20 rounded-2xl sm:h-24 sm:w-24 sm:rounded-3xl" />
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
        <h1 className={t.heroName} style={{ fontFamily: t.fontDisplay || undefined }}>{profile.name}</h1>
        <p className={t.heroHeadline}>{profile.headline}</p>
        <p className={t.heroBio}>{profile.summary}</p>

        {/* CTAs — full-width on mobile, inline on sm+ */}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          {profile.contact.email && (
            <a href={`mailto:${profile.contact.email}`} className={`${t.ctaOutline} w-full justify-center sm:w-auto sm:justify-start`}>
              <EnvelopeSimple size={16} aria-hidden />
              Get in touch
            </a>
          )}
        </div>
      </section>

      {/* ── Post-hero sections — flex col with mobile reordering ─────────── */}
      {/* Mobile order: Skills(1) → Connect(2) → Résumé(3) → Projects(4) → ChildPage(5) → Experience(6) */}
      {/* Desktop order: Connect(1) → Résumé(2) → Projects(3) → ChildPage(4) → Skills(5) → Experience(6) */}
      <div className="flex flex-col">

        {/* ── SKILLS — order-1 mobile, order-5 desktop ─────────────────── */}
        {!recruiterMode && skillGroups.length > 0 && (
          <div className="order-1 md:order-5">
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
          </div>
        )}

        {/* ── CONNECT — order-2 mobile, order-1 desktop ────────────────── */}
        {contactLinks.length > 0 && (
          <div className="order-2 md:order-1">
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
                    className={`${t.linkRow} min-h-[48px]`}
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
          </div>
        )}

        {/* ── RÉSUMÉ — order-3 mobile, order-2 desktop ─────────────────── */}
        <div className="order-3 md:order-2">
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
                  className="h-[380px] w-full border-0 bg-[#f5f4ef] lg:h-[560px]"
                />
              </div>
            )}
            {hasResumeUrl ? (
              <a href={profile.resume.url} download className={`${t.ctaOutline} mt-4 w-full justify-center sm:w-auto sm:justify-start`}>
                <FilePdf size={16} aria-hidden />
                Download PDF
              </a>
            ) : (
              <p className="mt-4 text-sm opacity-45">Résumé available on request.</p>
            )}
          </section>
        </div>

        {/* ── PROJECTS — order-4 mobile, order-3 desktop ───────────────── */}
        <div className="order-4 md:order-3">
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
        </div>

        {/* ── CHILD PAGE — order-5 mobile, order-4 desktop ─────────────── */}
        {childPage && (
          <div className="order-5 md:order-4">
            <ChildPageSection profile={profile} childPage={childPage} t={t} />
          </div>
        )}

        {/* ── EXPERIENCE — order-6 both ─────────────────────────────────── */}
        {!recruiterMode && profile.experiences.length > 0 && (
          <div className="order-6">
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
          </div>
        )}

        {profile.plan === "free" && !recruiterMode && (
          <footer className={`${t.footer} order-7`}>
            Built with{" "}
            <Link href="/" className="underline underline-offset-2 opacity-70 hover:opacity-100">
              foliopage
            </Link>
          </footer>
        )}

      </div>
    </main>
  );
}

/**
 * SIDEBAR — Linear-inspired app-nav layout.
 *
 * LEFT (sticky, 240–260px wide):
 *   ┌─────────────────────────────┐
 *   │ ● Avatar  Name  ·  Status  │  ← identity header row
 *   │──────────────────────────── │
 *   │ IDENTITY                    │  ← section group label
 *   │   🎓 University · Year      │  ← compact meta rows
 *   │   📍 Location               │
 *   │──────────────────────────── │
 *   │ CONNECT                     │
 *   │   ✉  email@...              │  ← nav rows: icon + label + hover bg
 *   │   ↗  LinkedIn               │
 *   │   ↗  GitHub                 │
 *   │──────────────────────────── │
 *   │ RÉSUMÉ                      │
 *   │ [subtle inset resume card]  │
 *   │──────────────────────────── │
 *   │ [foliopage footer]          │  ← pinned to bottom
 *   └─────────────────────────────┘
 *
 * RIGHT (scrollable):
 *   Section heading → Projects (cards with index badge)
 *   Section heading → Skills (grouped chip cloud)
 *   Section heading → Experience (left-spine timeline)
 *
 * Mobile: stacked header block → full-width content
 */
function SidebarLayout({
  profile,
  recruiterMode,
  childPage,
  t,
  hasResumeUrl,
  contactLinks,
}: RenderProps) {
  const skillGroups = [
    { label: "Languages", values: profile.skills.languages },
    { label: "Frameworks", values: profile.skills.frameworks },
    { label: "Tools", values: profile.skills.tools },
    { label: "Other", values: profile.skills.other },
  ].filter((g) => g.values.length > 0);

  return (
    <div className={t.sidebarOuter}>

      {/* ══════════════════════════════════════════════════════════
          LEFT — sticky app-nav sidebar (full-width header on mobile)
          ══════════════════════════════════════════════════════════ */}
      <aside className={t.sidebarLeft}>

        {/* ── Identity header — compact on desktop, rich on mobile ─── */}
        {/* Mobile: larger avatar + full name + status pill in a card-like block */}
        <div className="md:hidden flex items-start gap-4 px-2 py-4 mb-2">
          {profile.profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profileImageUrl}
              alt={`${profile.name} profile photo`}
              className={[
                "h-16 w-16 shrink-0 rounded-2xl object-cover",
                t.sidebarImageRing,
              ].join(" ")}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-current opacity-10 text-2xl font-bold">
              {profile.name.charAt(0)}
            </span>
          )}
          <div className="flex flex-col gap-1.5 min-w-0">
            <span
              className="text-lg font-semibold leading-tight truncate"
              style={{ fontFamily: t.fontDisplay || undefined }}
            >
              {profile.name}
            </span>
            <p className="text-sm opacity-55 leading-snug">{profile.headline}</p>
            <div className="mt-1">
              <span className={`${t.pillAccent} text-[10px] px-2 py-0.5 gap-1`}>
                <Sparkle size={9} aria-hidden />
                {profile.internshipStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop-only compact identity row */}
        <div className="hidden md:flex items-center gap-2.5 px-2 py-2 mb-1">
          {profile.profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profileImageUrl}
              alt=""
              aria-hidden
              className={[
                "h-[22px] w-[22px] shrink-0 rounded-full object-cover",
                t.sidebarImageRing,
              ].join(" ")}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-current opacity-10 text-[10px]">
              {profile.name.charAt(0)}
            </span>
          )}
          <span
            className="flex-1 truncate text-[13px] font-semibold leading-none"
            style={{ fontFamily: t.fontDisplay || undefined }}
          >
            {profile.name}
          </span>
        </div>

        {/* Accent status pill — desktop only (shown inline on mobile above) */}
        <div className="hidden md:block px-2 mb-2">
          <span className={`${t.pillAccent} text-[10px] px-2 py-0.5 gap-1`}>
            <Sparkle size={9} aria-hidden />
            {profile.internshipStatus}
          </span>
        </div>

        <div className={t.sidebarDivider} />

        {/* ── IDENTITY group ───────────────────────────────────── */}
        <p className={t.sidebarNavSection}>Identity</p>

        <div className="flex flex-col">
          <div className={`${t.sidebarNavItem} ${t.sidebarNavItemHover}`}>
            <GraduationCap size={14} className={t.sidebarNavIcon} aria-hidden />
            <span className={t.sidebarMeta}>
              {profile.university} · {profile.gradYear}
            </span>
          </div>
          {profile.location && (
            <div className={`${t.sidebarNavItem} ${t.sidebarNavItemHover}`}>
              <MapPin size={14} className={t.sidebarNavIcon} aria-hidden />
              <span className={t.sidebarMeta}>{profile.location}</span>
            </div>
          )}
        </div>

        {/* ── CONNECT group ────────────────────────────────────── */}
        {contactLinks.length > 0 && (
          <>
            <p className={t.sidebarNavSection}>Connect</p>
            <nav className="flex flex-col" aria-label="Contact links">
              {contactLinks.map((entry) => (
                <a
                  key={`${entry.type}-${entry.href}`}
                  href={entry.href}
                  target={entry.type !== "email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`${t.sidebarNavItem} ${t.sidebarNavItemHover} min-h-[44px] md:min-h-0`}
                >
                  <span className={t.sidebarNavIcon}>
                    <ContactIcon type={entry.type} />
                  </span>
                  <span className="flex-1 truncate text-[13px]">
                    {entry.type === "email"
                      ? entry.label
                      : entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                  </span>
                  <ArrowUpRight
                    size={10}
                    className="shrink-0 opacity-0 transition-opacity group-hover:opacity-40"
                    aria-hidden
                  />
                </a>
              ))}
            </nav>
          </>
        )}

        {/* ── RÉSUMÉ group ─────────────────────────────────────── */}
        <p className={t.sidebarNavSection}>Résumé</p>
        <div className={`${t.sidebarResumeCard} mx-1 mb-1`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium opacity-60">
              {profile.resume.fileSizeLabel || "PDF"}
            </span>
            <span className="text-[10px] opacity-30 tabular-nums">
              {resumeDateLabel(profile.resume.lastUpdated)}
            </span>
          </div>
          {hasResumeUrl ? (
            <a
              href={profile.resume.url}
              download
              className={`${t.ctaPrimary} w-full justify-center py-1.5 text-[11px]`}
            >
              <FilePdf size={12} aria-hidden />
              Download PDF
            </a>
          ) : (
            <p className="text-[11px] opacity-35 italic">Available on request.</p>
          )}
        </div>

        {/* ── Bio blurb (collapsed, subtle) ───────────────────── */}
        <div className={t.sidebarDivider} />
        <p className={`${t.heroBio} px-2 py-3 text-[11px] leading-relaxed`}>
          {profile.summary}
        </p>

        {/* ── Spacer + footer ──────────────────────────────────── */}
        {profile.plan === "free" && !recruiterMode && (
          <p className={`${t.footer} mt-auto px-2 pb-1 text-left text-[10px]`}>
            Built with{" "}
            <Link href="/" className="underline underline-offset-2 opacity-50 hover:opacity-100">
              foliopage
            </Link>
          </p>
        )}
      </aside>

      {/* ══════════════════════════════════════════════════════════
          RIGHT — scrollable content pane
          Mobile order: Skills(1) → ChildPage(2) → Projects(3) → Experience(4)
          Desktop order: Projects(1) → ChildPage(2) → Skills(3) → Experience(4)
          ══════════════════════════════════════════════════════════ */}
      <main className={`${t.sidebarRight} flex flex-col`}>

        {/* ── SKILLS — order-1 mobile, order-3 desktop ─────────── */}
        {!recruiterMode && skillGroups.length > 0 && (
          <div className="order-1 md:order-3 mb-8">
            <h2 className={`${t.sectionTitle} mb-5`}>
              <Notepad size={13} aria-hidden />
              Skills
            </h2>
            <div className="flex flex-col gap-5">
              {skillGroups.map((group) => (
                <div key={group.label} className={t.sidebarSkillGroup}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-35 mb-2">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.values.map((value) => (
                      <span key={value} className={t.chip}>{value}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CHILD PAGE — order-2 mobile, order-2 desktop ──────── */}
        {childPage && (
          <div className="order-2 md:order-2">
            <ChildPageSection profile={profile} childPage={childPage} t={t} />
          </div>
        )}

        {/* ── PROJECTS — order-3 mobile, order-1 desktop ───────── */}
        <div className="order-3 md:order-1 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className={t.sectionTitle}>
              <Briefcase size={13} aria-hidden />
              Projects
            </h2>
            <span className="text-[10px] opacity-30 tabular-nums">
              {profile.projects.length} total
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {profile.projects.map((project, idx) => (
              <article key={project.title} className={t.sidebarProjectCard}>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={t.sidebarProjectIndex}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`${t.sidebarProjectTitle} text-[15px] truncate`}
                      style={{ fontFamily: t.fontDisplay || undefined }}
                    >
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={t.iconBtn}
                        aria-label="Live demo"
                      >
                        <ArrowUpRight size={12} aria-hidden />
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
                        <GithubLogo size={12} aria-hidden />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-sm opacity-55 mb-3">{project.summary}</p>

                {!recruiterMode && (
                  <div className="flex flex-col gap-1.5 text-[13px] mb-3">
                    {[
                      { label: "Problem", value: project.problem },
                      { label: "Solution", value: project.solution },
                      { label: "Impact", value: project.impact },
                    ].map(({ label, value }) => (
                      <p key={label} className="leading-relaxed">
                        <span className="font-semibold opacity-75">{label} — </span>
                        <span className="opacity-50">{value}</span>
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className={t.chip}>{tech}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── EXPERIENCE — order-4 both ─────────────────────────── */}
        {!recruiterMode && profile.experiences.length > 0 && (
          <div className="order-4 mb-8">
            <h2 className={`${t.sectionTitle} mb-5`}>
              <UserCircle size={13} aria-hidden />
              Experience
            </h2>
            <div className="flex flex-col gap-6">
              {profile.experiences.map((exp) => (
                <article
                  key={`${exp.role}-${exp.org}`}
                  className={t.sidebarExpItem}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 mb-0.5">
                    <p className={t.sidebarExpRole}>{exp.role}</p>
                    <span className="text-[10px] opacity-30 tabular-nums shrink-0">
                      {exp.period}
                    </span>
                  </div>
                  <p className={t.sidebarExpOrg}>{exp.org}</p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {exp.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className={`flex gap-2 ${t.sidebarExpBullet}`}
                      >
                        <span
                          aria-hidden
                          className="mt-[4px] shrink-0 text-[8px] opacity-40"
                        >
                          ▸
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Mobile footer */}
        {profile.plan === "free" && !recruiterMode && (
          <footer className={`${t.footer} order-5 mt-8 md:hidden`}>
            Built with{" "}
            <Link
              href="/"
              className="underline underline-offset-2 opacity-60 hover:opacity-100"
            >
              foliopage
            </Link>
          </footer>
        )}
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
          <ProfileImage profile={profile} className="mb-4 h-24 w-24 rounded-3xl" />
          <div className="flex flex-wrap gap-2">
            <HeroPills profile={profile} t={t} />
          </div>
          <HeroText profile={profile} t={t} />
        </div>
        {/* Right: CTAs (show as a separate column on lg+) */}
        <div className="mt-6 flex flex-wrap gap-3 lg:mt-0 lg:flex-col lg:items-end lg:gap-2">
          {profile.contact.email && (
            <a href={`mailto:${profile.contact.email}`} className={t.ctaOutline}>
              <EnvelopeSimple size={16} aria-hidden />
              Get in touch
            </a>
          )}
        </div>
      </header>

      {/* ── BENTO GRID ── */}
      {/* Mobile: narrow col (skills/connect) first, wide col (projects) second */}
      {/* Desktop: wide col first (via order classes) */}
      <div className={t.magazineGrid}>
        {/* Wide column — projects + experience (order-2 mobile → order-1 desktop) */}
        <div className={`${t.magazineColWide} order-2 lg:order-1`}>
          <ProjectsSection profile={profile} recruiterMode={recruiterMode} t={t} />
          {childPage && <ChildPageSection profile={profile} childPage={childPage} t={t} />}
          {!recruiterMode && <ExperienceSection profile={profile} t={t} />}
        </div>

        {/* Narrow column — connect + résumé + skills (order-1 mobile → order-2 desktop) */}
        <div className={`${t.magazineColNarrow} order-1 lg:order-2`}>
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
  bgImageUrl?: string;         // optional background image for fullscreen/scrollytelling/split
  bgImageOverlay?: number;     // 0–100 overlay darkness
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
    bgImageUrl: profile.bgImageUrl,
    bgImageOverlay: profile.bgImageOverlay ?? 50,
  };

  return (
    <>
      {/* ── Font + scrollbar injection ─────────────────────────────────── */}
      {(t.fontImport || t.scrollbarCss) && (
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: [
              t.fontImport ? `@import url('${t.fontImport}');` : "",
              t.scrollbarCss ?? "",
            ].filter(Boolean).join("\n"),
          }}
        />
      )}

      {/* ── Page shell with font-family applied ────────────────────────── */}
      <div
        className={t.page}
        style={{ fontFamily: t.fontBody || undefined }}
      >
        {template.layout === "sidebar" ? (
          <SidebarLayout {...renderProps} />
        ) : template.layout === "magazine" ? (
          <MagazineLayout {...renderProps} />
        ) : template.layout === "bento" ? (
          <BentoLayout {...renderProps} />
        ) : template.layout === "split" ? (
          <SplitLayout {...renderProps} />
        ) : template.layout === "scrollytelling" ? (
          <ScrollytellingLayout {...renderProps} />
        ) : template.layout === "modular" ? (
          <ModularGridLayout {...renderProps} />
        ) : template.layout === "fullscreen" ? (
          <FullscreenLayout {...renderProps} />
        ) : template.layout === "zpattern" ? (
          <ZPatternLayout {...renderProps} />
        ) : template.layout === "fpattern" ? (
          <FPatternLayout {...renderProps} />
        ) : profile.templateId === "manuscript" ? (
          <ManuscriptLayout {...renderProps} />
        ) : profile.templateId === "verdict" ? (
          <VerdictLayout {...renderProps} />
        ) : (
          <StackLayout {...renderProps} />
        )}
      </div>
    </>
  );
}

// ─── BENTO layout ─────────────────────────────────────────────────────────────
//
// Swiss-grid inspired freeform tile layout.
// Mobile: single-column stack with 4px black borders between tiles.
// lg+:    asymmetric 3-column CSS grid.
//
//   ┌─────────────────────────────────┐
//   │         HERO  (3 cols)          │
//   ├──────────────────┬──────────────┤
//   │ PROJECTS (2 col) │ CONNECT      │
//   ├──────────────────┤ (1 col,      │
//   │ RESUME   (2 col) │  2 row span) │
//   ├────────┬─────────┴──────────────┤
//   │ SKILLS │ EXPERIENCE  (2 col)    │
//   └────────┴────────────────────────┘
//
// Each tile gets its background/padding from the template's bento* tokens,
// so different themes can skin the layout differently without touching this file.

function BentoLayout({
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
    <div className={t.bentoMain}>
      {/* Mobile: flex-col ordering — Skills(2) → Connect(3) → Résumé(4) → Projects(5) → Experience(6) */}
      {/* Desktop: grid placement is handled by bentoGrid CSS classes */}
      <div className={`${t.bentoGrid} flex flex-col lg:grid`}>

        {/* ── HERO TILE (order-1 on all breakpoints) ──────────────────────── */}
        <header className={`${t.bentoHero} order-1`} style={{ fontFamily: t.fontDisplay }}>
          <ProfileImage profile={profile} className="mb-5 h-28 w-28 rounded-3xl border-2 border-black" />
          {/* Pills row */}
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

          {/* Name — massive display type */}
          <h1 className={t.heroName}>{profile.name}</h1>
          <p className={t.heroHeadline}>{profile.headline}</p>
          <p className={t.heroBio}>{profile.summary}</p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap gap-3">
            {profile.contact.email && (
              <a href={`mailto:${profile.contact.email}`} className={t.ctaOutline}>
                <EnvelopeSimple size={16} aria-hidden />
                Get in touch
              </a>
            )}
          </div>
        </header>

        {/* ── PROJECTS TILE (order-5 mobile, grid placement desktop) ──────── */}
        <section className={`${t.bentoProjects} order-5 lg:order-none`}>
          <h2 className={t.sectionTitle}>
            <Briefcase size={14} aria-hidden />
            Projects
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {profile.projects.map((project) => (
              <article
                key={project.title}
                className={recruiterMode ? t.projectCardAlt : t.projectCard}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold leading-tight">{project.title}</h3>
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
                <p className="mt-1.5 text-sm opacity-70">{project.summary}</p>
                <div className="mt-3 grid gap-1 text-sm">
                  <p><span className="font-bold opacity-90">Problem — </span><span className="opacity-65">{project.problem}</span></p>
                  <p><span className="font-bold opacity-90">Solution — </span><span className="opacity-65">{project.solution}</span></p>
                  <p><span className="font-bold opacity-90">Impact — </span><span className="opacity-65">{project.impact}</span></p>
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

        {/* ── CONNECT TILE (order-3 mobile, 2 rows on lg+) ──────────────── */}
        <section className={`${t.bentoConnect} order-3 lg:order-none`}>
          <h2 className={t.sectionTitle}>
            <LinkSimple size={14} aria-hidden />
            Connect
          </h2>
          <div className="mt-4 flex flex-col">
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
                <span className="flex-1 truncate text-sm font-semibold">{entry.label}</span>
                <ArrowUpRight size={12} className="shrink-0 opacity-40" aria-hidden />
              </a>
            ))}
          </div>

          {/* Résumé meta tucked at bottom of connect tile */}
          <div className="mt-auto pt-8">
            <div className={t.divider} />
            <div className="flex items-center justify-between gap-2 pt-4">
              <p className={t.sectionTitle}>
                <FilePdf size={13} aria-hidden />
                Résumé
              </p>
              <span className="text-[10px] opacity-40 tabular-nums">
                {resumeDateLabel(profile.resume.lastUpdated)}
              </span>
            </div>
            {!hasResumeUrl && (
              <p className="mt-2 text-[11px] opacity-40 italic">Available on request.</p>
            )}
          </div>
        </section>

        {/* ── RESUME TILE (order-4 mobile) ────────────────────────────────── */}
        <section className={`${t.bentoResume} order-4 lg:order-none`}>
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
            <div className="mt-4 overflow-hidden border-4 border-black">
              <iframe
                src={resumePreviewUrl}
                title={`${profile.name} résumé`}
                className="h-[380px] w-full border-0 bg-white"
              />
            </div>
          )}
          {hasResumeUrl ? (
            <a href={profile.resume.url} download className={`${t.ctaPrimary} mt-4`}>
              <FilePdf size={16} aria-hidden />
              Download PDF
            </a>
          ) : (
            <p className="mt-4 text-sm opacity-50">Available on request.</p>
          )}
          {childPage && <ChildPageSection profile={profile} childPage={childPage} t={t} />}
        </section>

        {/* ── SKILLS TILE (order-2 mobile) ────────────────────────────────── */}
        {!recruiterMode && skillGroups.length > 0 && (
          <section className={`${t.bentoSkills} order-2 lg:order-none`}>
            <h2 className={t.sectionTitle}>
              <Notepad size={14} aria-hidden />
              Skills
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <h3 className="mb-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                    {group.label}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.values.map((value) => (
                      <span key={value} className={t.chip}>{value}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── EXPERIENCE TILE (order-6 mobile) ────────────────────────────── */}
        {!recruiterMode && profile.experiences.length > 0 && (
          <section className={`${t.bentoExperience} order-6 lg:order-none`}>
            <h2 className={t.sectionTitle}>
              <UserCircle size={14} aria-hidden />
              Experience
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profile.experiences.map((exp) => (
                <article key={`${exp.role}-${exp.org}`} className="border-t-4 border-black pt-4">
                  <div className="flex flex-wrap items-start justify-between gap-1">
                    <p className="font-black leading-tight">{exp.role}</p>
                    <p className="text-[11px] opacity-40 tabular-nums">{exp.period}</p>
                  </div>
                  <p className="mt-0.5 text-sm font-semibold opacity-55">{exp.org}</p>
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

        {/* ── FOOTER ──────────────────────────────────────────────────── */}
        {profile.plan === "free" && !recruiterMode && (
          <footer className={t.footer}>
            Built with{" "}
            <Link href="/" className="underline underline-offset-2 opacity-60 hover:opacity-100">
              foliopage
            </Link>
          </footer>
        )}

      </div>
    </div>
  );
}

// ─── SPLIT layout ─────────────────────────────────────────────────────────────
// Fixed 42vw left identity panel · scrollable right content
// Used by: Horizon

function SplitLayout({
  profile,
  recruiterMode,
  childPage,
  t,
  hasResumeUrl,
  contactLinks,
}: RenderProps) {
  const skillGroups = [
    { label: "Languages", values: profile.skills.languages },
    { label: "Frameworks", values: profile.skills.frameworks },
    { label: "Tools", values: profile.skills.tools },
    { label: "Other", values: profile.skills.other },
  ].filter((g) => g.values.length > 0);

  return (
    <div className={t.splitOuter}>
      {/* ── LEFT PANEL (fixed identity) ── */}
      <aside className={t.splitLeft}>
        <div className={t.splitLeftInner}>
          {/* Avatar */}
          {profile.profileImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profileImageUrl}
              alt={`${profile.name}`}
              className="mb-6 h-16 w-16 rounded-full object-cover ring-1 ring-white/10"
              loading="lazy"
              decoding="async"
            />
          )}

          {/* Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={t.pill}>
              <GraduationCap size={11} aria-hidden />
              {profile.university} · {profile.gradYear}
            </span>
            {profile.location && (
              <span className={t.pill}>
                <MapPin size={11} aria-hidden />
                {profile.location}
              </span>
            )}
            <span className={t.pillAccent}>
              <Sparkle size={11} aria-hidden />
              {profile.internshipStatus}
            </span>
          </div>

          {/* Name + headline + bio — pushed toward bottom via mt-auto wrapper */}
          <div className={t.splitHeroArea}>
            <h1
              className={t.heroName}
              style={{ fontFamily: t.fontDisplay || undefined }}
            >
              {profile.name}
            </h1>
            <p className={`${t.heroHeadline} mt-3`}>{profile.headline}</p>
            <p className={`${t.heroBio} mt-4`}>{profile.summary}</p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              {hasResumeUrl && (
                <a href={profile.resume.url} download className={t.ctaPrimary}>
                  <FilePdf size={15} aria-hidden />
                  Resume
                </a>
              )}
              {profile.contact.email && (
                <a href={`mailto:${profile.contact.email}`} className={t.ctaOutline}>
                  <EnvelopeSimple size={15} aria-hidden />
                  Email
                </a>
              )}
            </div>
          </div>

          {/* Contact nav */}
          {contactLinks.length > 0 && (
            <nav className="mt-8" aria-label="Contact links">
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
                  <span className="flex-1 truncate text-sm">{entry.label}</span>
                  <ArrowUpRight size={11} className="shrink-0 opacity-30" aria-hidden />
                </a>
              ))}
            </nav>
          )}

          {/* Footer */}
          {profile.plan === "free" && !recruiterMode && (
            <p className={`${t.footer} mt-auto pt-10`}>
              Built with{" "}
              <Link href="/" className="underline underline-offset-2 opacity-60 hover:opacity-100">
                foliopage
              </Link>
            </p>
          )}
        </div>
      </aside>

      {/* ── RIGHT PANEL (scrollable content) ── */}
      {/* Mobile order: Skills(1) → ChildPage(2) → Projects(3) → Experience(4) */}
      <main className={`${t.splitRight} flex flex-col`}>

        {/* Skills — order-1 mobile, order-3 desktop */}
        {!recruiterMode && skillGroups.length > 0 && (
          <section className={`${t.section} order-1 lg:order-3`}>
            <h2 className={`${t.sectionTitle} mb-5`}>
              <Notepad size={13} aria-hidden />
              Skills
            </h2>
            <div className="flex flex-col gap-5">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 mb-2">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.values.map((v) => (
                      <span key={v} className={t.chip}>{v}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ChildPage — order-2 both */}
        {childPage && (
          <div className="order-2">
            <ChildPageSection profile={profile} childPage={childPage} t={t} />
          </div>
        )}

        {/* Projects — order-3 mobile, order-1 desktop */}
        <section className="order-3 lg:order-1">
          <h2 className={`${t.sectionTitle} mb-5`}>
            <Briefcase size={13} aria-hidden />
            Projects
          </h2>
          <div className="flex flex-col gap-4">
            {profile.projects.map((project, idx) => (
              <article key={project.title} className={t.projectCard}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] tabular-nums opacity-30 shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="text-[15px] font-semibold leading-tight truncate"
                      style={{ fontFamily: t.fontDisplay || undefined }}
                    >
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="Demo">
                        <ArrowUpRight size={12} aria-hidden />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="GitHub">
                        <GithubLogo size={12} aria-hidden />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm opacity-55 mb-3">{project.summary}</p>
                {!recruiterMode && (
                  <div className="flex flex-col gap-1 text-sm mb-3">
                    {[
                      { label: "Problem", value: project.problem },
                      { label: "Solution", value: project.solution },
                      { label: "Impact", value: project.impact },
                    ].map(({ label, value }) => (
                      <p key={label}>
                        <span className="font-semibold opacity-70">{label} — </span>
                        <span className="opacity-50">{value}</span>
                      </p>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className={t.chip}>{tech}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Experience — order-4 both */}
        {!recruiterMode && profile.experiences.length > 0 && (
          <section className={`${t.section} order-4`}>
            <h2 className={`${t.sectionTitle} mb-5`}>
              <UserCircle size={13} aria-hidden />
              Experience
            </h2>
            <div className="flex flex-col gap-6">
              {profile.experiences.map((exp) => (
                <article key={`${exp.role}-${exp.org}`} className="pl-3 border-l border-current/15">
                  <div className="flex items-baseline justify-between gap-3 mb-0.5">
                    <p className="text-sm font-semibold">{exp.role}</p>
                    <span className="text-[10px] opacity-30 tabular-nums shrink-0">{exp.period}</span>
                  </div>
                  <p className="text-xs opacity-50 mb-2">{exp.org}</p>
                  <ul className="flex flex-col gap-1">
                    {exp.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-sm opacity-45">
                        <span aria-hidden className="mt-[4px] shrink-0 text-[8px]">▸</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Mobile footer */}
        {profile.plan === "free" && !recruiterMode && (
          <footer className={`${t.footer} order-5 mt-8 lg:hidden`}>
            Built with{" "}
            <Link href="/" className="underline underline-offset-2 opacity-60 hover:opacity-100">
              foliopage
            </Link>
          </footer>
        )}
      </main>
    </div>
  );
}

// ─── SCROLLYTELLING layout ────────────────────────────────────────────────────
// Full-height sections, bg image hero, side nav dots
// Used by: Odyssey

function ScrollytellingLayout({
  profile,
  recruiterMode,
  childPage,
  t,
  hasResumeUrl,
  contactLinks,
  bgImageUrl,
  bgImageOverlay = 50,
}: RenderProps) {
  const skillGroups = [
    { label: "Languages", values: profile.skills.languages },
    { label: "Frameworks", values: profile.skills.frameworks },
    { label: "Tools", values: profile.skills.tools },
    { label: "Other", values: profile.skills.other },
  ].filter((g) => g.values.length > 0);

  const overlayOpacity = Math.max(0, Math.min(100, bgImageOverlay)) / 100;

  return (
    <div
      className="relative min-h-dvh"
      style={bgImageUrl ? {
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      } : undefined}
    >

      {/* Fixed side nav dots */}
      <div className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2 lg:flex" aria-hidden>
        {["hero", "projects", "skills", "experience"].map((id) => (
          <a key={id} href={`#st-${id}`} className={t.stNavDot} />
        ))}
      </div>

      {/* ── HERO SECTION ── */}
      <section id="st-hero" className={t.stHeroSection}>
        {/* Dark gradient overlay for text legibility over bg image */}
        <div
          className={t.stHeroOverlay}
          style={{
            background: "linear-gradient(to bottom, rgba(8,9,14,0.3) 0%, rgba(8,9,14,0.55) 60%, rgba(8,9,14,0.85) 100%)",
            opacity: bgImageUrl ? overlayOpacity : 1,
          }}
        />

        <div className={t.stHeroContent}>
          {profile.profileImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profileImageUrl}
              alt={profile.name}
              className="mx-auto mb-5 h-20 w-20 rounded-full object-cover ring-1 ring-white/20"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            <span className={t.pill}>
              <GraduationCap size={11} aria-hidden />
              {profile.university} · {profile.gradYear}
            </span>
            {profile.location && (
              <span className={t.pill}>
                <MapPin size={11} aria-hidden />
                {profile.location}
              </span>
            )}
            <span className={t.pillAccent}>
              <Sparkle size={11} aria-hidden />
              {profile.internshipStatus}
            </span>
          </div>
          <h1
            className={t.heroName}
            style={{ fontFamily: t.fontDisplay || undefined }}
          >
            {profile.name}
          </h1>
          <p className={`${t.heroHeadline} mt-6`}>{profile.headline}</p>
          <p className={`${t.heroBio} mt-4 mx-auto max-w-xl`}>{profile.summary}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {hasResumeUrl && (
              <a href={profile.resume.url} download className={t.ctaPrimary}>
                <FilePdf size={15} aria-hidden />
                Download résumé
              </a>
            )}
            {profile.contact.email && (
              <a href={`mailto:${profile.contact.email}`} className={t.ctaOutline}>
                <EnvelopeSimple size={15} aria-hidden />
                Get in touch
              </a>
            )}
          </div>
          {/* Scroll hint */}
          <p className="mt-10 text-[11px] uppercase tracking-[0.3em] opacity-25 animate-bounce">
            scroll
          </p>
        </div>
      </section>

      {/* ── PROJECTS SECTION ── */}
      <section id="st-projects" className={t.stContentSection}>
        <div className={t.stSectionInner}>
          <h2 className={`${t.sectionTitle} mb-5`}>
            <Briefcase size={13} aria-hidden />
            Projects
          </h2>
          <div className="flex flex-col gap-4">
            {profile.projects.map((project, idx) => (
              <article key={project.title} className={t.stProjectCard}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] tabular-nums opacity-30">{String(idx + 1).padStart(2, "0")}</span>
                    <h3 className="text-base font-semibold" style={{ fontFamily: t.fontDisplay || undefined }}>
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="Demo">
                        <ArrowUpRight size={12} aria-hidden />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="GitHub">
                        <GithubLogo size={12} aria-hidden />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm opacity-55 mb-3">{project.summary}</p>
                {!recruiterMode && (
                  <div className="flex flex-col gap-1 text-sm mb-3">
                    {[
                      { label: "Problem", value: project.problem },
                      { label: "Solution", value: project.solution },
                      { label: "Impact", value: project.impact },
                    ].map(({ label, value }) => (
                      <p key={label}>
                        <span className="font-medium opacity-70">{label} — </span>
                        <span className="opacity-50">{value}</span>
                      </p>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => <span key={tech} className={t.chip}>{tech}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS + CONNECT SECTION ── */}
      {!recruiterMode && skillGroups.length > 0 && (
        <section id="st-skills" className={t.stContentSection}>
          <div className={t.stSectionInner}>
            <h2 className={`${t.sectionTitle} mb-5`}>
              <Notepad size={13} aria-hidden />
              Skills
            </h2>
            <div className="flex flex-col gap-6">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest opacity-30 mb-2">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.values.map((v) => <span key={v} className={t.chip}>{v}</span>)}
                  </div>
                </div>
              ))}
            </div>
            {contactLinks.length > 0 && (
              <div className="mt-10">
                <h2 className={`${t.sectionTitle} mb-5`}>
                  <LinkSimple size={13} aria-hidden />
                  Connect
                </h2>
                <div className="flex flex-col">
                  {contactLinks.map((entry) => (
                    <a
                      key={`${entry.type}-${entry.href}`}
                      href={entry.href}
                      target={entry.type !== "email" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={t.linkRow}
                    >
                      <span className={t.linkRowIcon}><ContactIcon type={entry.type} /></span>
                      <span className="flex-1 text-sm">{entry.label}</span>
                      <ArrowUpRight size={11} className="opacity-30" aria-hidden />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── EXPERIENCE SECTION ── */}
      {!recruiterMode && profile.experiences.length > 0 && (
        <section id="st-experience" className={t.stContentSection}>
          <div className={t.stSectionInner}>
            <h2 className={`${t.sectionTitle} mb-5`}>
              <UserCircle size={13} aria-hidden />
              Experience
            </h2>
            <div className="flex flex-col gap-8">
              {profile.experiences.map((exp) => (
                <article key={`${exp.role}-${exp.org}`} className="pl-4 border-l border-white/15">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <p className="text-base font-semibold">{exp.role}</p>
                    <span className="text-[10px] opacity-30 tabular-nums">{exp.period}</span>
                  </div>
                  <p className="text-sm opacity-45 mb-2">{exp.org}</p>
                  <ul className="flex flex-col gap-1.5">
                    {exp.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-sm opacity-40">
                        <span aria-hidden className="mt-[4px] shrink-0 text-[8px]">▸</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            {/* Resume + footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              {profile.plan === "free" && !recruiterMode && (
                <p className={t.footer}>
                  Built with{" "}
                  <Link href="/" className="underline opacity-60 hover:opacity-100">foliopage</Link>
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── MODULAR GRID layout ──────────────────────────────────────────────────────
// Asymmetric CSS grid mosaic of variable-height tiles
// Used by: Mosaic

function ModularGridLayout({
  profile,
  recruiterMode,
  t,
  hasResumeUrl,
  contactLinks,
}: RenderProps) {
  const skillGroups = [
    { label: "Languages", values: profile.skills.languages },
    { label: "Frameworks", values: profile.skills.frameworks },
    { label: "Tools", values: profile.skills.tools },
    { label: "Other", values: profile.skills.other },
  ].filter((g) => g.values.length > 0);

  return (
    /* Mobile: flex-col with ordering. Desktop: CSS grid from modularGrid class */
    <div className={`${t.modularGrid} flex flex-col lg:grid`}>

      {/* ── HERO TILE (order-1) ── */}
      <div className={`${t.modularHeroTile} order-1`}>
        {profile.profileImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.profileImageUrl}
            alt={profile.name}
            className="mb-5 h-14 w-14 rounded-full object-cover ring-2 ring-white/30"
            loading="lazy"
            decoding="async"
          />
        )}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={t.pill}><GraduationCap size={11} aria-hidden /> {profile.university} · {profile.gradYear}</span>
            {profile.location && <span className={t.pill}><MapPin size={11} aria-hidden /> {profile.location}</span>}
            <span className={t.pillAccent}><Sparkle size={11} aria-hidden /> {profile.internshipStatus}</span>
          </div>
          <h1
            className={t.heroName}
            style={{ fontFamily: t.fontDisplay || undefined }}
          >
            {profile.name}
          </h1>
          <p className={`${t.heroHeadline} mt-2`}>{profile.headline}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {profile.contact.email && (
              <a href={`mailto:${profile.contact.email}`} className={t.ctaOutline}>
                <EnvelopeSimple size={14} aria-hidden /> Email
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── PROJECT TILES (order-5 mobile, grid placement desktop) ── */}
      {profile.projects.slice(0, 4).map((project, idx) => (
        <div key={project.title} className={`${t.modularProjectTile} order-5 lg:order-none`}>
          <div>
            <p className="text-[10px] tabular-nums opacity-30 mb-1">{String(idx + 1).padStart(2, "0")}</p>
            <h3
              className="text-sm font-semibold leading-tight mb-1.5"
              style={{ fontFamily: t.fontDisplay || undefined }}
            >
              {project.title}
            </h3>
            <p className="text-xs opacity-55 leading-relaxed line-clamp-3">{project.summary}</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-wrap gap-1">
              {project.techStack.slice(0, 2).map((t2) => (
                <span key={t2} className={t.chip}>{t2}</span>
              ))}
            </div>
            <div className="flex gap-1">
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="Demo">
                  <ArrowUpRight size={11} aria-hidden />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="GitHub">
                  <GithubLogo size={11} aria-hidden />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* ── SKILLS TILE (order-2 mobile) ── */}
      {!recruiterMode && skillGroups.length > 0 && (
        <div className={`${t.modularSkillsTile} order-2 lg:order-none`}>
          <p className={`${t.sectionTitle} mb-3`}><Notepad size={12} aria-hidden /> Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {skillGroups.flatMap((g, gi) => g.values.map((v, vi) => ({ v, key: `${gi}-${vi}` }))).map(({ v, key }) => (
              <span key={key} className={t.chip}>{v}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── CONNECT TILE (order-3 mobile) ── */}
      {contactLinks.length > 0 && (
        <div className={`${t.modularConnectTile} order-3 lg:order-none`}>
          <p className={`${t.sectionTitle} mb-3`}><LinkSimple size={12} aria-hidden /> Connect</p>
          <div className="flex flex-col gap-1">
            {contactLinks.slice(0, 4).map((entry) => (
              <a
                key={`${entry.type}-${entry.href}`}
                href={entry.href}
                target={entry.type !== "email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs opacity-60 hover:opacity-100 transition-opacity min-h-[40px]"
              >
                <ContactIcon type={entry.type} />
                <span className="truncate">{entry.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── RÉSUMÉ TILE (order-4 mobile) ── */}
      <div className={`${t.modularResumeTile} order-4 lg:order-none`}>
        <p className={`${t.sectionTitle} mb-2`}><FilePdf size={12} aria-hidden /> Résumé</p>
        <p className="text-xs opacity-40 mb-3">{resumeDateLabel(profile.resume.lastUpdated)}</p>
        {hasResumeUrl ? (
          <a href={profile.resume.url} download className={t.ctaPrimary}>
            <FilePdf size={13} aria-hidden /> Download
          </a>
        ) : (
          <p className="text-xs opacity-40">On request.</p>
        )}
      </div>

      {/* ── EXPERIENCE TILE (order-6 mobile) ── */}
      {!recruiterMode && profile.experiences.length > 0 && (
        <div className={`${t.modularExpTile} order-6 lg:order-none`}>
          <p className={`${t.sectionTitle} mb-4`}><UserCircle size={12} aria-hidden /> Experience</p>
          <div className="flex flex-col gap-5 overflow-hidden">
            {profile.experiences.map((exp) => (
              <article key={`${exp.role}-${exp.org}`} className="pl-3 border-l-2 border-current/20">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <p className="text-sm font-semibold">{exp.role}</p>
                  <span className="text-[10px] opacity-30 tabular-nums shrink-0">{exp.period}</span>
                </div>
                <p className="text-xs opacity-50 mb-1">{exp.org}</p>
                <ul className="flex flex-col gap-0.5">
                  {exp.bullets.slice(0, 2).map((b) => (
                    <li key={b} className="flex gap-1.5 text-xs opacity-40">
                      <span aria-hidden className="mt-[3px] shrink-0 text-[8px]">▸</span>
                      <span className="line-clamp-2">{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper used in ModularGridLayout
// ─── FULLSCREEN layout ────────────────────────────────────────────────────────
// 100dvh bg-image hero, refined content below
// Used by: Cinematic

function FullscreenLayout({
  profile,
  recruiterMode,
  childPage,
  t,
  hasResumeUrl,
  contactLinks,
  bgImageUrl,
  bgImageOverlay = 50,
}: RenderProps) {
  const skillGroups = [
    { label: "Languages", values: profile.skills.languages },
    { label: "Frameworks", values: profile.skills.frameworks },
    { label: "Tools", values: profile.skills.tools },
    { label: "Other", values: profile.skills.other },
  ].filter((g) => g.values.length > 0);

  const overlayOpacity = Math.max(0, Math.min(100, bgImageOverlay)) / 100;

  return (
    <>
      {/* ── HERO — 100dvh with bg image ── */}
      <section className={t.fsHero}>
        {bgImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgImageUrl})` }}
          />
        )}
        <div
          className={t.fsHeroOverlay}
          style={{ opacity: bgImageUrl ? overlayOpacity : 1 }}
        />
        <div className={t.fsHeroContent}>
          {profile.profileImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profileImageUrl}
              alt={profile.name}
              className="mx-auto mb-5 h-16 w-16 rounded-full object-cover ring-1 ring-white/20"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            <span className={t.pill}><GraduationCap size={11} aria-hidden /> {profile.university} · {profile.gradYear}</span>
            {profile.location && <span className={t.pill}><MapPin size={11} aria-hidden /> {profile.location}</span>}
            <span className={t.pillAccent}><Sparkle size={11} aria-hidden /> {profile.internshipStatus}</span>
          </div>
          <h1
            className={t.heroName}
            style={{ fontFamily: t.fontDisplay || undefined }}
          >
            {profile.name}
          </h1>
          <p className={`${t.heroHeadline} mt-6`}>{profile.headline}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {hasResumeUrl && (
              <a href={profile.resume.url} download className={t.ctaPrimary}>
                <FilePdf size={15} aria-hidden /> Download résumé
              </a>
            )}
            {profile.contact.email && (
              <a href={`mailto:${profile.contact.email}`} className={t.ctaOutline}>
                <EnvelopeSimple size={15} aria-hidden /> Get in touch
              </a>
            )}
          </div>
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
            <span className="text-[10px] uppercase tracking-[0.3em]">scroll</span>
            <div className="h-8 w-px bg-current" />
          </div>
        </div>
      </section>

      {/* ── BELOW-HERO CONTENT ── */}
      {/* Mobile order: Skills(1) → Connect(2) → Projects(3) → ChildPage(4) → Experience(5) */}
      <div className={`${t.fsContent} flex flex-col`}>

        {/* Skills — order-1 mobile, order-3 desktop */}
        {!recruiterMode && skillGroups.length > 0 && (
          <section className={`${t.fsSection} order-1 lg:order-3`}>
            <h2 className={`${t.sectionTitle} mb-6`}><Notepad size={13} aria-hidden /> Skills</h2>
            <div className="flex flex-col gap-5">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] font-light uppercase tracking-[0.25em] opacity-30 mb-2">{group.label}</p>
                  <div className="flex flex-wrap gap-1.5">{group.values.map((v) => <span key={v} className={t.chip}>{v}</span>)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Connect — order-2 mobile, order-4 desktop */}
        {contactLinks.length > 0 && (
          <section className={`${t.fsSection} order-2 lg:order-4`}>
            <h2 className={`${t.sectionTitle} mb-5`}><LinkSimple size={13} aria-hidden /> Connect</h2>
            <div className="flex flex-col">
              {contactLinks.map((entry) => (
                <a key={`${entry.type}-${entry.href}`} href={entry.href} target={entry.type !== "email" ? "_blank" : undefined} rel="noopener noreferrer" className={`${t.linkRow} min-h-[48px]`}>
                  <span className={t.linkRowIcon}><ContactIcon type={entry.type} /></span>
                  <span className="flex-1 text-sm">{entry.label}</span>
                  <ArrowUpRight size={11} className="opacity-25" aria-hidden />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Projects — order-3 mobile, order-1 desktop */}
        <section className="order-3 lg:order-1">
          <h2 className={`${t.sectionTitle} mb-5`}>
            <Briefcase size={13} aria-hidden /> Projects
          </h2>
          <div className="flex flex-col gap-4">
            {profile.projects.map((project, idx) => (
              <article key={project.title} className={t.fsProjectCard}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] tabular-nums opacity-25">{String(idx + 1).padStart(2, "0")}</span>
                    <h3 className="text-base font-light tracking-wide" style={{ fontFamily: t.fontDisplay || undefined }}>
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="Demo"><ArrowUpRight size={12} aria-hidden /></a>}
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="GitHub"><GithubLogo size={12} aria-hidden /></a>}
                  </div>
                </div>
                <p className="text-sm opacity-50 mb-3">{project.summary}</p>
                {!recruiterMode && (
                  <div className="flex flex-col gap-1 text-sm mb-3">
                    {[{ label: "Problem", value: project.problem }, { label: "Solution", value: project.solution }, { label: "Impact", value: project.impact }].map(({ label, value }) => (
                      <p key={label}><span className="font-medium opacity-65">{label} — </span><span className="opacity-45">{value}</span></p>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => <span key={tech} className={t.chip}>{tech}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ChildPage — order-4 mobile, order-2 desktop */}
        {childPage && (
          <div className="order-4 lg:order-2">
            <ChildPageSection profile={profile} childPage={childPage} t={t} />
          </div>
        )}

        {/* Experience — order-5 both */}
        {!recruiterMode && profile.experiences.length > 0 && (
          <section className={`${t.fsSection} order-5`}>
            <h2 className={`${t.sectionTitle} mb-6`}><UserCircle size={13} aria-hidden /> Experience</h2>
            <div className="flex flex-col gap-6">
              {profile.experiences.map((exp) => (
                <article key={`${exp.role}-${exp.org}`} className="pl-4 border-l border-white/10">
                  <div className="flex items-baseline justify-between gap-3 mb-0.5">
                    <p className="text-sm font-medium">{exp.role}</p>
                    <span className="text-[10px] opacity-25 tabular-nums shrink-0">{exp.period}</span>
                  </div>
                  <p className="text-xs opacity-40 mb-2">{exp.org}</p>
                  <ul className="flex flex-col gap-1">
                    {exp.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-sm opacity-38">
                        <span aria-hidden className="mt-[4px] shrink-0 text-[8px]">▸</span>
                        {b}
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
            <Link href="/" className="underline opacity-50 hover:opacity-100">foliopage</Link>
          </footer>
        )}
      </div>
    </>
  );
}

// ─── Z-PATTERN layout ─────────────────────────────────────────────────────────
// Wide hero header, then alternating left/right content blocks
// Used by: Current

function ZPatternLayout({
  profile,
  recruiterMode,
  childPage,
  t,
  hasResumeUrl,
  contactLinks,
}: RenderProps) {
  const skillGroups = [
    { label: "Languages", values: profile.skills.languages },
    { label: "Frameworks", values: profile.skills.frameworks },
    { label: "Tools", values: profile.skills.tools },
    { label: "Other", values: profile.skills.other },
  ].filter((g) => g.values.length > 0);

  return (
    <div className={t.zpOuter}>

      {/* ── HERO — full-width Z top bar ── */}
      <header className={t.zpHero}>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={t.pill}><GraduationCap size={11} aria-hidden /> {profile.university} · {profile.gradYear}</span>
          {profile.location && <span className={t.pill}><MapPin size={11} aria-hidden /> {profile.location}</span>}
          <span className={t.pillAccent}><Sparkle size={11} aria-hidden /> {profile.internshipStatus}</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            {profile.profileImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profileImageUrl}
                alt={profile.name}
                className="mb-5 h-14 w-14 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
            <h1
              className={t.heroName}
              style={{ fontFamily: t.fontDisplay || undefined }}
            >
              {profile.name}
            </h1>
            <p className={`${t.heroHeadline} mt-3`}>{profile.headline}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:flex-col lg:items-end">
            {hasResumeUrl && (
              <a href={profile.resume.url} download className={t.ctaPrimary}>
                <FilePdf size={14} aria-hidden /> Download résumé
              </a>
            )}
            {profile.contact.email && (
              <a href={`mailto:${profile.contact.email}`} className={t.ctaOutline}>
                <EnvelopeSimple size={14} aria-hidden /> Get in touch
              </a>
            )}
          </div>
        </div>
        <p className={`${t.heroBio} mt-6`}>{profile.summary}</p>
      </header>

      {/* ── Z-BLOCKS — alternating left/right ── */}
      {profile.projects.map((project, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <div key={project.title} className={isEven ? t.zpBlock : t.zpBlockAlt}>
            {/* Text side */}
            <div className={`${t.zpBlockText} ${isEven ? "" : "lg:order-2"}`}>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-30 mb-3">
                {String(idx + 1).padStart(2, "0")} / Project
              </p>
              <h2
                className="text-2xl font-bold leading-tight mb-3"
                style={{ fontFamily: t.fontDisplay || undefined }}
              >
                {project.title}
              </h2>
              <p className="text-sm opacity-60 mb-4 leading-relaxed">{project.summary}</p>
              {!recruiterMode && (
                <div className="flex flex-col gap-1.5 text-sm mb-4">
                  {[
                    { label: "Problem", value: project.problem },
                    { label: "Solution", value: project.solution },
                    { label: "Impact", value: project.impact },
                  ].map(({ label, value }) => (
                    <p key={label}>
                      <span className="font-semibold opacity-75">{label} — </span>
                      <span className="opacity-55">{value}</span>
                    </p>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack.map((tech) => <span key={tech} className={t.chip}>{tech}</span>)}
              </div>
              <div className="flex gap-2">
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={t.ctaPrimary}>
                    <ArrowUpRight size={14} aria-hidden /> Live demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={t.ctaOutline}>
                    <GithubLogo size={14} aria-hidden /> Code
                  </a>
                )}
              </div>
            </div>
            {/* Visual accent side */}
            <div className={`${t.zpBlockVisual} ${isEven ? "" : "lg:order-1"}`}>
              <div className="text-center">
                <p
                  className="text-6xl font-black text-white/20 leading-none"
                  style={{ fontFamily: t.fontDisplay || undefined }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm font-bold text-white/60 uppercase tracking-widest">
                  {project.techStack[0]}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── SKILLS + CONNECT + EXPERIENCE ── */}
      {(!recruiterMode || contactLinks.length > 0) && (
        <div className={`grid grid-cols-1 gap-0 ${t.divider} lg:grid-cols-3`}>
          {!recruiterMode && skillGroups.length > 0 && (
            <div className={`${t.divider} px-0 py-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12`}>
              <h2 className={`${t.sectionTitle} mb-5`}><Notepad size={13} aria-hidden /> Skills</h2>
              <div className="flex flex-col gap-4">
                {skillGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-2">{group.label}</p>
                    <div className="flex flex-wrap gap-1.5">{group.values.map((v) => <span key={v} className={t.chip}>{v}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {contactLinks.length > 0 && (
            <div className={`${t.divider} px-0 py-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12`}>
              <h2 className={`${t.sectionTitle} mb-5`}><LinkSimple size={13} aria-hidden /> Connect</h2>
              <div className="flex flex-col">
                {contactLinks.map((entry) => (
                  <a key={`${entry.type}-${entry.href}`} href={entry.href} target={entry.type !== "email" ? "_blank" : undefined} rel="noopener noreferrer" className={t.linkRow}>
                    <span className={t.linkRowIcon}><ContactIcon type={entry.type} /></span>
                    <span className="flex-1 text-sm">{entry.label}</span>
                    <ArrowUpRight size={11} className="opacity-30" aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          )}
          {!recruiterMode && profile.experiences.length > 0 && (
            <div className="px-0 py-10 lg:px-12 lg:py-12">
              <h2 className={`${t.sectionTitle} mb-5`}><UserCircle size={13} aria-hidden /> Experience</h2>
              <div className="flex flex-col gap-5">
                {profile.experiences.map((exp) => (
                  <article key={`${exp.role}-${exp.org}`} className={t.projectCardAlt}>
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold">{exp.role}</p>
                      <span className="text-[10px] opacity-30 tabular-nums shrink-0">{exp.period}</span>
                    </div>
                    <p className="text-xs opacity-50 mb-1.5">{exp.org}</p>
                    <ul className="flex flex-col gap-0.5">
                      {exp.bullets.map((b) => (
                        <li key={b} className="flex gap-1.5 text-xs opacity-45">
                          <span aria-hidden className="mt-[3px] shrink-0 text-[8px]">▸</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {profile.plan === "free" && !recruiterMode && (
        <footer className={`${t.footer} py-6`}>
          Built with <Link href="/" className="underline opacity-60 hover:opacity-100">foliopage</Link>
        </footer>
      )}
    </div>
  );
}

// ─── F-PATTERN layout ─────────────────────────────────────────────────────────
// Newspaper F: strong top masthead, left lead rail, right content stream
// Used by: Dispatch

function FPatternLayout({
  profile,
  recruiterMode,
  childPage,
  t,
  hasResumeUrl,
  contactLinks,
}: RenderProps) {
  const skillGroups = [
    { label: "Languages", values: profile.skills.languages },
    { label: "Frameworks", values: profile.skills.frameworks },
    { label: "Tools", values: profile.skills.tools },
    { label: "Other", values: profile.skills.other },
  ].filter((g) => g.values.length > 0);

  const leadProject = profile.projects[0];
  const streamProjects = profile.projects.slice(1);

  return (
    <div className={t.fpOuter}>

      {/* ── MASTHEAD — F top bar (full-width scan) ── */}
      <header className={t.fpHero}>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={t.pill}><GraduationCap size={11} aria-hidden /> {profile.university} · {profile.gradYear}</span>
              {profile.location && <span className={t.pill}><MapPin size={11} aria-hidden /> {profile.location}</span>}
              <span className={t.pillAccent}><Sparkle size={11} aria-hidden /> {profile.internshipStatus}</span>
            </div>
            <h1
              className={`${t.heroName} text-5xl lg:text-7xl xl:text-8xl`}
              style={{ fontFamily: t.fontDisplay || undefined }}
            >
              {profile.name}
            </h1>
            <p className={`${t.heroHeadline} mt-2 text-lg`}>{profile.headline}</p>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            {profile.profileImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profileImageUrl}
                alt={profile.name}
                className="h-16 w-16 rounded object-cover border-2 border-[#1a1a18]/20"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        </div>
        <p className={`${t.heroBio} mt-4 max-w-2xl`}>{profile.summary}</p>
      </header>

      {/* ── F BODY — left rail + right stream ── */}
      <div className="flex flex-col lg:flex-row">

        {/* LEFT RAIL — lead story (F left anchor, ~40%) */}
        <div className="lg:w-[40%]">
          <div className={t.fpRail}>
            {/* Lead project */}
            {leadProject && (
              <div>
                <p className={`${t.sectionTitle} mb-3`}><Briefcase size={12} aria-hidden /> Lead Project</p>
                <h2
                  className="text-3xl font-bold leading-tight mb-3"
                  style={{ fontFamily: t.fontDisplay || undefined }}
                >
                  {leadProject.title}
                </h2>
                <p className="text-sm opacity-60 mb-4 leading-relaxed">{leadProject.summary}</p>
                {!recruiterMode && (
                  <div className="flex flex-col gap-2 text-sm mb-4 border-l-4 border-[#1a1a18] pl-3">
                    {[
                      { label: "Problem", value: leadProject.problem },
                      { label: "Solution", value: leadProject.solution },
                      { label: "Impact", value: leadProject.impact },
                    ].map(({ label, value }) => (
                      <p key={label}>
                        <span className="font-bold">{label} — </span>
                        <span className="opacity-60">{value}</span>
                      </p>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {leadProject.techStack.map((tech) => <span key={tech} className={t.chip}>{tech}</span>)}
                </div>
                <div className="flex gap-2">
                  {leadProject.demoUrl && (
                    <a href={leadProject.demoUrl} target="_blank" rel="noopener noreferrer" className={t.ctaPrimary}>
                      <ArrowUpRight size={13} aria-hidden /> Live demo
                    </a>
                  )}
                  {leadProject.githubUrl && (
                    <a href={leadProject.githubUrl} target="_blank" rel="noopener noreferrer" className={t.ctaOutline}>
                      <GithubLogo size={13} aria-hidden /> Code
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Contact in rail */}
            {contactLinks.length > 0 && (
              <div className="mt-8 pt-6 border-t-2 border-[#1a1a18]">
                <p className={`${t.sectionTitle} mb-3`}><LinkSimple size={12} aria-hidden /> Connect</p>
                <div className="flex flex-col">
                  {contactLinks.map((entry) => (
                    <a key={`${entry.type}-${entry.href}`} href={entry.href} target={entry.type !== "email" ? "_blank" : undefined} rel="noopener noreferrer" className={t.linkRow}>
                      <span className={t.linkRowIcon}><ContactIcon type={entry.type} /></span>
                      <span className="flex-1 truncate text-sm">{entry.label}</span>
                      <ArrowUpRight size={10} className="opacity-30 shrink-0" aria-hidden />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT STREAM — secondary content (F right scan band) */}
        <div className="lg:flex-1 border-t-2 border-[#1a1a18] lg:border-t-0">
          {/* Mobile: flex-col with ordering so skills appear before more projects */}
          <div className={`${t.fpStream} flex flex-col lg:block`}>

            {/* Skills stream — order-1 mobile, default desktop */}
            {!recruiterMode && skillGroups.length > 0 && (
              <div className={`${t.fpStreamItem} order-1 lg:order-none`}>
                <p className={`${t.sectionTitle} mb-4`}><Notepad size={12} aria-hidden /> Skills</p>
                <div className="flex flex-col gap-3">
                  {skillGroups.map((group) => (
                    <div key={group.label}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 mb-1.5">{group.label}</p>
                      <div className="flex flex-wrap gap-1.5">{group.values.map((v) => <span key={v} className={t.chip}>{v}</span>)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* More projects as stream items — order-2 mobile */}
            {streamProjects.length > 0 && (
              <div className="order-2 lg:order-none">
                <p className={`${t.sectionTitle} mb-3`}><Briefcase size={12} aria-hidden /> More Projects</p>
                {streamProjects.map((project, idx) => (
                  <div key={project.title} className={idx % 2 === 0 ? t.fpStreamItem : t.fpStreamItemAlt}>
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3
                        className="text-base font-bold leading-tight"
                        style={{ fontFamily: t.fontDisplay || undefined }}
                      >
                        {project.title}
                      </h3>
                      <div className="flex gap-1 shrink-0">
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="Demo">
                            <ArrowUpRight size={11} aria-hidden />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="GitHub">
                            <GithubLogo size={11} aria-hidden />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-sm opacity-55 mb-2">{project.summary}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 3).map((tech) => <span key={tech} className={t.chip}>{tech}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Experience stream */}
            {!recruiterMode && profile.experiences.length > 0 && (
              <div className={t.fpStreamItem}>
                <p className={`${t.sectionTitle} mb-4`}><UserCircle size={12} aria-hidden /> Experience</p>
                <div className="flex flex-col gap-4">
                  {profile.experiences.map((exp) => (
                    <article key={`${exp.role}-${exp.org}`} className={t.projectCardAlt}>
                      <div className="flex items-baseline justify-between gap-2 mb-0.5">
                        <p className="text-sm font-bold">{exp.role}</p>
                        <span className="text-[10px] opacity-30 tabular-nums shrink-0">{exp.period}</span>
                      </div>
                      <p className="text-xs opacity-50 mb-1.5">{exp.org}</p>
                      <ul className="flex flex-col gap-0.5">
                        {exp.bullets.map((b) => (
                          <li key={b} className="flex gap-1.5 text-xs opacity-50">
                            <span aria-hidden className="mt-[3px] shrink-0 text-[8px]">▸</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Resume */}
            <div className={t.fpStreamItem}>
              <p className={`${t.sectionTitle} mb-3`}><FilePdf size={12} aria-hidden /> Résumé</p>
              {hasResumeUrl ? (
                <a href={profile.resume.url} download className={t.ctaPrimary}>
                  <FilePdf size={13} aria-hidden /> Download PDF
                </a>
              ) : (
                <p className="text-sm opacity-40">Available on request.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {profile.plan === "free" && !recruiterMode && (
        <footer className={t.footer}>
          Built with <Link href="/" className="underline opacity-60 hover:opacity-100">foliopage</Link>
        </footer>
      )}
    </div>
  );
}

// ─── MANUSCRIPT layout ────────────────────────────────────────────────────────
//
// Design principles (Rynzhuk/Kuznetsov-inspired):
//
//  DENSITY OSCILLATION
//    hero      → sparse + asymmetric (name dominates, bio indented ~40% right)
//    projects  → first project is full-bleed 2-col at display scale
//                subsequent projects tighter: index + title + tags in row
//    skills    → compact 4-col grid — densest zone in the page
//    experience→ 2-col grid: left=meta (role/org/period), right=bullets
//    footer    → single hairline strip, inline links only
//
//  TYPOGRAPHIC ANCHORS
//    Between every major section: giant low-opacity chapter number (01, 02, 03…)
//    set in display font at ~160px. This creates a visual landmark that breaks
//    the uniform card cadence — you're always oriented in the document.
//
//  ASYMMETRY
//    Bio is max-w-[55%] pushed to ml-[40%] on desktop — creates a gutter on
//    the left that mirrors the chapter number position.
//    First project description indented differently from subsequent ones.
//
function ManuscriptLayout({
  profile,
  recruiterMode,
  t,
  hasResumeUrl,
  contactLinks,
}: RenderProps) {
  const skillGroups = [
    { label: "Languages", values: profile.skills.languages },
    { label: "Frameworks", values: profile.skills.frameworks },
    { label: "Tools", values: profile.skills.tools },
    { label: "Other", values: profile.skills.other },
  ].filter((g) => g.values.length > 0);

  return (
    <main className={`${t.stackMain} flex flex-col`}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className={`${t.stackHeroCard} order-1`}>

        {/* Pills row */}
        <div className="flex flex-wrap gap-2">
          <span className={t.pill}>
            <GraduationCap size={11} aria-hidden />
            {profile.university} · {profile.gradYear}
          </span>
          {profile.location && (
            <span className={t.pill}>
              <MapPin size={11} aria-hidden />
              {profile.location}
            </span>
          )}
          <span className={t.pillAccent}>
            <Sparkle size={11} aria-hidden />
            {profile.internshipStatus}
          </span>
        </div>

        {/* Name — light italic at display scale */}
        <h1
          className={t.heroName}
          style={{ fontFamily: t.fontDisplay || undefined }}
        >
          {profile.name}
        </h1>

        {/* Headline — below name, normal weight */}
        <p className={t.heroHeadline}>{profile.headline}</p>

        {/* Bio — asymmetrically indented on desktop */}
        <p className="mt-5 text-base font-light leading-[1.75] text-[#e8e0d4]/35 lg:ml-[38%] lg:max-w-[55%]">
          {profile.summary}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap gap-3">
          {hasResumeUrl && (
            <a href={profile.resume.url} download className={t.ctaPrimary}>
              <FilePdf size={14} aria-hidden />
              Résumé
            </a>
          )}
          {profile.contact.email && (
            <a href={`mailto:${profile.contact.email}`} className={t.ctaOutline}>
              <EnvelopeSimple size={14} aria-hidden />
              Get in touch
            </a>
          )}
        </div>
      </section>

      {/* ── CHAPTER 01: WORK ─────────────────────────────────────────────── */}
      {profile.projects.length > 0 && (
        <div className="order-4 md:order-2">
          {renderManuscriptChapterAnchor(t, 1, "Work")}

          {/* First project — hero scale, 2-col on desktop */}
          {(() => {
            const lead = profile.projects[0]!;
            return (
              <article className="grid grid-cols-1 gap-8 border-b border-[#e8e0d4]/8 pb-14 lg:grid-cols-2 lg:gap-16">
                {/* Left: large display title */}
                <div className="flex flex-col justify-between">
                  <div>
                    <p
                      className="text-[clamp(48px,6vw,88px)] font-light italic leading-[0.9] text-[#e8e0d4]"
                      style={{ fontFamily: t.fontDisplay || undefined }}
                    >
                      {lead.title}
                    </p>
                    <p className="mt-5 text-sm font-light leading-relaxed text-[#e8e0d4]/40">
                      {lead.summary}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {lead.techStack.map((tech) => (
                      <span key={tech} className={t.chip}>{tech}</span>
                    ))}
                  </div>
                </div>

                {/* Right: problem/solution/impact */}
                <div className="flex flex-col gap-5 border-t border-[#e8e0d4]/8 pt-6 lg:border-0 lg:pt-0 lg:pl-8 lg:border-l lg:border-[#e8e0d4]/8">
                  {!recruiterMode && [
                    { label: "Problem", value: lead.problem },
                    { label: "Solution", value: lead.solution },
                    { label: "Impact", value: lead.impact },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#c8a96e]/55 mb-1.5">{label}</p>
                      <p className="text-sm font-light leading-relaxed text-[#e8e0d4]/45">{value}</p>
                    </div>
                  ))}
                  <div className="mt-auto flex gap-3 pt-4">
                    {lead.demoUrl && (
                      <a href={lead.demoUrl} target="_blank" rel="noopener noreferrer" className={t.ctaPrimary}>
                        <ArrowUpRight size={13} aria-hidden /> Demo
                      </a>
                    )}
                    {lead.githubUrl && (
                      <a href={lead.githubUrl} target="_blank" rel="noopener noreferrer" className={t.ctaOutline}>
                        <GithubLogo size={13} aria-hidden /> Code
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })()}

          {/* Remaining projects — compact: index · title + tags in tight rows */}
          {profile.projects.slice(1).map((project, i) => (
            <article
              key={project.title}
              className="grid grid-cols-1 gap-3 border-b border-[#e8e0d4]/6 py-7 lg:grid-cols-[56px_1fr_auto] lg:items-start lg:gap-8"
            >
              <span
                className="hidden text-[11px] font-light tabular-nums tracking-[0.28em] text-[#c8a96e]/40 lg:block lg:pt-[3px]"
                aria-hidden
              >
                {String(i + 2).padStart(2, "0")}
              </span>
              <div>
                <h3
                  className="text-[clamp(22px,2.5vw,32px)] font-light italic leading-tight text-[#e8e0d4]"
                  style={{ fontFamily: t.fontDisplay || undefined }}
                >
                  {project.title}
                </h3>
                <p className="mt-2 text-sm font-light text-[#e8e0d4]/35 leading-relaxed">{project.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className={t.chip}>{tech}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="Demo">
                    <ArrowUpRight size={12} aria-hidden />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="GitHub">
                    <GithubLogo size={12} aria-hidden />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── CHAPTER 02: SKILLS ───────────────────────────────────────────── */}
      {!recruiterMode && skillGroups.length > 0 && (
        <div className="order-2 md:order-3">
          {renderManuscriptChapterAnchor(t, 2, "Skills")}
          {/* Dense 4-col grid — contrast to the sparse hero and wide project section */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 pb-14 lg:grid-cols-4">
            {skillGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-[#c8a96e]/50">
                  {group.label}
                </p>
                <div className="flex flex-col gap-1.5">
                  {group.values.map((value, vi) => (
                    <span
                      key={value}
                      className="font-light text-[#e8e0d4] leading-snug"
                      style={{
                        /* Variable font size: first item larger, steps down */
                        fontSize: vi === 0 ? "15px" : vi === 1 ? "13px" : "12px",
                        opacity: vi === 0 ? 0.75 : vi === 1 ? 0.55 : 0.38,
                      }}
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CHAPTER 03: EXPERIENCE ──────────────────────────────────────── */}
      {!recruiterMode && profile.experiences.length > 0 && (
        <div className="order-5 md:order-4">
          {renderManuscriptChapterAnchor(t, 3, "Experience")}
          <div className="flex flex-col gap-0 pb-14">
            {profile.experiences.map((exp) => (
              <div
                key={`${exp.role}-${exp.org}`}
                className="grid grid-cols-1 gap-4 border-b border-[#e8e0d4]/6 py-8 lg:grid-cols-[220px_1fr] lg:gap-12"
              >
                {/* Left: timeline meta */}
                <div className="flex flex-col gap-1">
                  <p
                    className="text-[clamp(18px,2vw,24px)] font-light italic leading-tight text-[#e8e0d4]/85"
                    style={{ fontFamily: t.fontDisplay || undefined }}
                  >
                    {exp.role}
                  </p>
                  <p className="mt-1 text-sm font-light text-[#c8a96e]/65">{exp.org}</p>
                  <p className="text-[11px] font-light tabular-nums text-[#e8e0d4]/25 mt-1">{exp.period}</p>
                </div>
                {/* Right: bullets */}
                <ul className="flex flex-col gap-2.5">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm font-light leading-relaxed text-[#e8e0d4]/38">
                      <span className="mt-[5px] shrink-0 h-[1px] w-4 bg-[#c8a96e]/35" aria-hidden />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CHAPTER 04: CONNECT ─────────────────────────────────────────── */}
      {contactLinks.length > 0 && (
        <div className="order-3 md:order-5">
          {renderManuscriptChapterAnchor(t, 4, "Connect")}
          <div className="grid grid-cols-1 gap-1.5 pb-14 sm:grid-cols-2 lg:grid-cols-3">
            {contactLinks.map((entry) => (
              <a
                key={`${entry.type}-${entry.href}`}
                href={entry.href}
                target={entry.type !== "email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={t.linkRow}
              >
                <span className={t.linkRowIcon}><ContactIcon type={entry.type} /></span>
                <span className="flex-1 truncate text-sm font-light">{entry.label}</span>
                <ArrowUpRight size={12} className="shrink-0 opacity-30" aria-hidden />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── FOOTER — single hairline, inline ────────────────────────────── */}
      {profile.plan === "free" && !recruiterMode && (
        <footer className={t.footer}>
          Built with{" "}
          <Link href="/" className="underline underline-offset-4 opacity-60 hover:opacity-100">
            foliopage
          </Link>
        </footer>
      )}
    </main>
  );
}


// ─── VERDICT layout ───────────────────────────────────────────────────────────
//
// Design principles (Rynzhuk/Kuznetsov-inspired):
//
//  COLOR FIELD INVERSIONS
//    Hero zone:    full-bleed black card — chalk text on tungsten.
//                  Negative margins break out of the container to edge-to-edge.
//    Content zone: reverts to chalk white (#f5f5f0).
//    Each project alternates: even=dark tile, odd=light tile.
//    The shell already alternates projectCard/projectCardAlt — Verdict makes
//    them contrast hard (black vs. white) not just shade-shift.
//
//  TYPOGRAPHIC ANCHORS
//    Section intros use a large Bebas Neue chapter number (01, 02…) at
//    ~120px opacity-[0.06] — visible but not competing with content.
//    The 2px top border above each chapter anchor signals a zone break.
//
//  DENSITY OSCILLATION
//    hero      → maximum visual weight (Bebas at ~12vw, full-bleed black)
//    projects  → full-width alternating tiles, heavy left accent strip
//    skills    → bordered 4-col grid with accent category labels
//    experience→ dark-band section with tight 2-col timeline grid
//    connect   → light minimal rows
//
function VerdictLayout({
  profile,
  recruiterMode,
  t,
  hasResumeUrl,
  contactLinks,
}: RenderProps) {
  const skillGroups = [
    { label: "Languages", values: profile.skills.languages },
    { label: "Frameworks", values: profile.skills.frameworks },
    { label: "Tools", values: profile.skills.tools },
    { label: "Other", values: profile.skills.other },
  ].filter((g) => g.values.length > 0);

  // Three accent colors cycling by project index
  const ACCENTS = ["#e63946", "#457b9d", "#2a9d8f"];

  return (
    <div>

      {/* ── HERO — full-bleed inverted black zone ─────────────────────── */}
      <header className={`${t.stackHeroCard} px-8 sm:px-12 lg:px-20`}>

        {/* Pills (on dark bg) */}
        <div className="flex flex-wrap gap-2">
          <span className={t.pill}>
            <GraduationCap size={11} aria-hidden />
            {profile.university} · {profile.gradYear}
          </span>
          {profile.location && (
            <span className={t.pill}>
              <MapPin size={11} aria-hidden />
              {profile.location}
            </span>
          )}
          <span className={t.pillAccent}>
            <Sparkle size={11} aria-hidden />
            {profile.internshipStatus}
          </span>
        </div>

        {/* Bebas display name — the visual anchor of the whole page */}
        <h1
          className={t.heroName}
          style={{ fontFamily: t.fontDisplay || undefined }}
        >
          {profile.name}
        </h1>

        {/* Italic serif headline — contrast to the display-condensed name */}
        <p
          className="mt-3 text-lg font-light italic leading-snug text-[#f5f5f0]/45"
          style={{ fontFamily: t.fontBody || undefined }}
        >
          {profile.headline}
        </p>

        <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-[#f5f5f0]/32">
          {profile.summary}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {hasResumeUrl && (
            <a href={profile.resume.url} download className={t.ctaPrimary}>
              <FilePdf size={14} aria-hidden />
              Résumé
            </a>
          )}
          {profile.contact.email && (
            <a href={`mailto:${profile.contact.email}`} className={t.ctaOutline}>
              <EnvelopeSimple size={14} aria-hidden />
              Get in touch
            </a>
          )}
        </div>
      </header>

      {/* ── Content zone (chalk white) ────────────────────────────────── */}
      <div className={`${t.stackMain} flex flex-col`}>

        {/* ── PROJECTS ── */}
        {profile.projects.length > 0 && (
          <div className="order-3 md:order-1">
            {renderVerdictChapterAnchor(t, 1, "Work")}
            <div className="flex flex-col gap-0 pb-4">
              {profile.projects.map((project, idx) => {
                const isEven = idx % 2 === 0;
                const accent = ACCENTS[idx % ACCENTS.length]!;

                return (
                  <article
                    key={project.title}
                    className={`${isEven ? t.projectCard : t.projectCardAlt} relative`}
                    style={{ borderLeft: `3px solid ${accent}` }}
                  >
                    {/* Index badge */}
                    <p
                      className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em]"
                      style={{ color: accent }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </p>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
                      {/* Left: title + summary + stack */}
                      <div>
                        <h3
                          className="text-[clamp(28px,4vw,52px)] font-normal leading-[0.95] tracking-[0.02em]"
                          style={{ fontFamily: t.fontDisplay || undefined }}
                        >
                          {project.title}
                        </h3>
                        <p className="mt-3 text-sm font-light leading-relaxed opacity-50">
                          {project.summary}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {project.techStack.map((tech) => (
                            <span key={tech} className={t.chip}>{tech}</span>
                          ))}
                        </div>
                      </div>

                      {/* Right: PSI + links */}
                      {!recruiterMode && (
                        <div className="flex flex-col gap-3 border-t border-current/10 pt-4 lg:border-0 lg:pt-0 lg:border-l lg:pl-6">
                          {[
                            { label: "Problem", value: project.problem },
                            { label: "Solution", value: project.solution },
                            { label: "Impact", value: project.impact },
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <p
                                className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.3em]"
                                style={{ color: accent, opacity: 0.7 }}
                              >
                                {label}
                              </p>
                              <p className="text-xs font-light leading-relaxed opacity-45">{value}</p>
                            </div>
                          ))}
                          <div className="mt-2 flex gap-2">
                            {project.demoUrl && (
                              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="Demo">
                                <ArrowUpRight size={12} aria-hidden />
                              </a>
                            )}
                            {project.githubUrl && (
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={t.iconBtn} aria-label="GitHub">
                                <GithubLogo size={12} aria-hidden />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SKILLS — dense bordered grid ── */}
        {!recruiterMode && skillGroups.length > 0 && (
          <div className="order-1 md:order-2">
            {renderVerdictChapterAnchor(t, 2, "Skills")}
            <div className="grid grid-cols-2 gap-0 border-2 border-[#111111] mb-16 lg:grid-cols-4">
              {skillGroups.map((group, gi) => (
                <div
                  key={group.label}
                  className={`p-5 ${gi < skillGroups.length - 1 ? "border-b-2 lg:border-b-0 lg:border-r-2 border-[#111111]" : ""}`}
                >
                  <p
                    className="mb-3 text-[9px] font-bold uppercase tracking-[0.38em]"
                    style={{ color: ACCENTS[gi % ACCENTS.length] }}
                  >
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.values.map((value) => (
                      <span key={value} className={t.chip}>{value}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EXPERIENCE — dark band ── */}
        {!recruiterMode && profile.experiences.length > 0 && (
          <div className="order-4 md:order-3">
            {renderVerdictChapterAnchor(t, 3, "Experience")}
            <div className="mb-16 -mx-6 bg-[#111111] px-6 py-8 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
              <div className="flex flex-col gap-0">
                {profile.experiences.map((exp, ei) => (
                  <div
                    key={`${exp.role}-${exp.org}`}
                    className={`grid grid-cols-1 gap-4 py-7 lg:grid-cols-[200px_1fr] lg:gap-10 ${ei < profile.experiences.length - 1 ? "border-b border-white/8" : ""}`}
                  >
                    <div>
                      <p
                        className="text-xl font-normal leading-tight text-[#f5f5f0]/85"
                        style={{ fontFamily: t.fontDisplay || undefined }}
                      >
                        {exp.role}
                      </p>
                      <p
                        className="mt-1 text-sm font-medium"
                        style={{ color: ACCENTS[ei % ACCENTS.length] }}
                      >
                        {exp.org}
                      </p>
                      <p className="mt-1 text-[11px] tabular-nums text-[#f5f5f0]/25">{exp.period}</p>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {exp.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2.5 text-sm font-light leading-relaxed text-[#f5f5f0]/40">
                          <span
                            className="mt-[7px] h-px w-3 shrink-0"
                            style={{ background: ACCENTS[ei % ACCENTS.length], opacity: 0.5 }}
                            aria-hidden
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CONNECT ── */}
        {contactLinks.length > 0 && (
          <div className="order-2 md:order-4">
            {renderVerdictChapterAnchor(t, 4, "Connect")}
            <div className="grid grid-cols-1 gap-1 pb-16 sm:grid-cols-2 lg:grid-cols-3">
              {contactLinks.map((entry) => (
                <a
                  key={`${entry.type}-${entry.href}`}
                  href={entry.href}
                  target={entry.type !== "email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={t.linkRow}
                >
                  <span className={t.linkRowIcon}><ContactIcon type={entry.type} /></span>
                  <span className="flex-1 truncate text-sm font-medium">{entry.label}</span>
                  <ArrowUpRight size={12} className="shrink-0 opacity-30" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        {profile.plan === "free" && !recruiterMode && (
          <footer className={t.footer}>
            Built with{" "}
            <Link href="/" className="underline underline-offset-4 opacity-60 hover:opacity-100">
              foliopage
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
}