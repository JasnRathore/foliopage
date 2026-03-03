"use client";

import {
  useCallback, useEffect, useMemo, useRef, useState,
  type FormEvent, type KeyboardEvent,
} from "react";
import Link from "next/link";
import {
  createDefaultDraft, createProjectDraft,
  parseSkills, slugifyName, type ProfileDraft,
} from "@/lib/utils";
import { TemplatePicker } from "@/components/TemplatePicker";
import { defaultProfileTemplateId } from "@/lib/profile-templates";
import type { CheckoutPlan, DbProfile, DbProject, PlanType } from "@/lib/db";
import {
  ApiClientError, createCheckoutSessionApi, createProfileApi, createProjectApi,
  deleteProfileApi, deleteProjectApi, deleteResumeApi, getMe, getPlans, getProfile,
  listProfiles, listProjectsApi, processBillingWebhookApi, reorderProjectsApi,
  resetPassword, setPublishedApi, setSkillsApi, signIn, uploadBackgroundImageApi,
  updateProfileApi, updateProjectApi, upsertResumeApi,
} from "@/lib/site-api";
import {
  ArrowRight, ArrowSquareOut, CaretRight, CheckCircle, Circle,
  FilePdf, FloppyDisk, House, Lightning, ListBullets,
  Plus, SignOut, Sparkle, Trash, User, UserCircle, Warning, X, Briefcase,
  EnvelopeSimple, GithubLogo, LinkedinLogo, InstagramLogo, TwitterLogo,
  Wrench,
} from "@phosphor-icons/react";

// ─── Constants ────────────────────────────────────────────────────────────────
const SESSION_KEY = "foliopage_token";
const MAX_RESUME_MB = 5 * 1024 * 1024;
const MAX_IMG_MB = 5 * 1024 * 1024;

const STATUSES = [
  "Seeking Summer 2026 internship",
  "Open to Fall 2026 co-op",
  "Open to full-time 2027",
  "Not actively seeking",
] as const;

const SUGGESTED_SKILLS = ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "SQL", "Figma"];

type SkillCategory = "languages" | "frameworks" | "tools" | "other";
const EMPTY_SKILLS: Record<SkillCategory, string> = { languages: "", frameworks: "", tools: "", other: "" };

type NavSection = "profile" | "resume" | "contact" | "projects" | "appearance" | "settings";

const NAV_ITEMS: { id: NavSection; label: string; Icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", Icon: UserCircle },
  { id: "resume", label: "Resume", Icon: FilePdf },
  { id: "contact", label: "Contact", Icon: EnvelopeSimple },
  { id: "projects", label: "Projects", Icon: Briefcase },
  { id: "appearance", label: "Appearance", Icon: Sparkle },
  { id: "settings", label: "Settings", Icon: Wrench },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toError(e: unknown) {
  return e instanceof ApiClientError || e instanceof Error ? e.message : "Something went wrong.";
}
function toStatus(v: string): (typeof STATUSES)[number] {
  return STATUSES.includes(v as (typeof STATUSES)[number]) ? v as (typeof STATUSES)[number] : STATUSES[0];
}
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => typeof r.result === "string" ? res(r.result) : rej(new Error("Read failed"));
    r.onerror = () => rej(new Error("File read failed"));
    r.readAsDataURL(file);
  });
}
function toDraft(profile: DbProfile, projects: DbProject[], plan: PlanType): ProfileDraft {
  const socials = profile.socials ?? {
    linkedin: { url: "", visible: false }, github: { url: "", visible: false },
    twitter: { url: "", visible: false }, instagram: { url: "", visible: false },
  };
  return {
    fullName: profile.name, headline: profile.headline, summary: profile.summary ?? "", university: profile.university,
    gradYear: profile.gradYear, internshipStatus: toStatus(profile.internshipStatus),
    accentColor: profile.accentColor, templateId: profile.templateId ?? defaultProfileTemplateId,
    slug: profile.slug, plan, resumeBlockType: profile.resumeBlockType ?? "without_preview",
    resumeFileName: profile.resume?.fileName ?? "", resumeFileSizeKb: profile.resume?.fileSizeKb ?? 0,
    resumeUpdatedAt: profile.resume?.updatedAt.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    profileImageUrl: profile.profileImageUrl ?? "", profileImageVisible: profile.profileImageVisible ?? false,
    bgImageUrl: profile.bgImageUrl ?? "", bgImageOverlay: profile.bgImageOverlay ?? 50,
    skillsLanguagesInput: profile.skills.languages.join(", "),
    skillsFrameworksInput: profile.skills.frameworks.join(", "),
    skillsToolsInput: profile.skills.tools.join(", "),
    skillsOtherInput: profile.skills.other.join(", "),
    contactEmail: profile.contactEmail ?? "", emailVisible: profile.emailVisible ?? true,
    linkedinUrl: socials.linkedin.url ?? "", linkedinVisible: socials.linkedin.visible ?? false,
    githubUrl: socials.github.url ?? "", githubVisible: socials.github.visible ?? false,
    twitterUrl: socials.twitter.url ?? "", twitterVisible: socials.twitter.visible ?? false,
    instagramUrl: socials.instagram.url ?? "", instagramVisible: socials.instagram.visible ?? false,
    published: profile.published,
    projects: projects.length > 0
      ? projects.map((p) => ({
        id: p.id, title: p.title, summary: p.summary,
        highlights: [p.highlights[0] ?? "", p.highlights[1] ?? "", p.highlights[2] ?? ""],
        githubUrl: p.githubUrl, demoUrl: p.demoUrl, techStack: p.techStack.join(", "),
      }))
      : [createProjectDraft("project-1")],
  };
}
function dedupeSkills(values: string[]): string[] {
  const seen = new Set<string>();
  return values.reduce<string[]>((acc, v) => {
    const t = v.trim(); if (!t) return acc;
    const k = t.toLowerCase(); if (seen.has(k)) return acc;
    seen.add(k); return [...acc, t];
  }, []);
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const inputCls = [
  "w-full border border-[#0e0e0e]/12 bg-white px-3 py-2.5 text-sm text-[#0e0e0e]",
  "placeholder-[#0e0e0e]/25 outline-none transition-all duration-150",
  "focus:border-[#0e0e0e]/30 focus:ring-2 focus:ring-[#0e0e0e]/5",
  "hover:border-[#0e0e0e]/18",
].join(" ");

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#0e0e0e]/38">{children}</span>;
}

function Field({ label, hint, children, className = "" }: {
  label?: string; hint?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <Label>{label}</Label>}
      {children}
      {hint && <p className="font-mono text-[9px] text-[#0e0e0e]/28">{hint}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label?: string;
}) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2.5 group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative h-[18px] w-8 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8320a]/40",
          checked ? "bg-[#0e0e0e]" : "bg-[#0e0e0e]/10 group-hover:bg-[#0e0e0e]/18",
        ].join(" ")}
      >
        <span className={[
          "absolute top-[2px] h-[14px] w-[14px] bg-white shadow-sm transition-all duration-150",
          checked ? "left-[18px]" : "left-[2px]",
        ].join(" ")} />
      </button>
      {label && <span className="text-xs text-[#0e0e0e]/50 group-hover:text-[#0e0e0e]/70 transition-colors">{label}</span>}
    </label>
  );
}

function ProgressRing({ pct, size = 36 }: { pct: number; size?: number }) {
  const r = (size - 5) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct === 100 ? "#10b981" : pct >= 50 ? "#e8320a" : "#0e0e0e";
  return (
    <svg width={size} height={size} className="-rotate-90" style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="2" className="text-[#0e0e0e]/8" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="square" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1), stroke 0.3s" }}
      />
    </svg>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border border-[#0e0e0e]/8 bg-white ${className}`}>{children}</div>;
}

function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#0e0e0e]/6 px-5 py-4">
      <div>
        <h3 className="text-[13px] font-black tracking-tight text-[#0e0e0e]">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-[#0e0e0e]/38">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4200);
    return () => clearTimeout(t);
  }, [onClose, msg]);
  return (
    <div
      className={[
        "fixed bottom-6 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-3 border px-4 py-3 shadow-2xl backdrop-blur-md",
        "animate-[toastIn_0.28s_cubic-bezier(0.34,1.56,0.64,1)_both]",
        type === "success"
          ? "border-emerald-200/70 bg-emerald-50/96 text-emerald-800"
          : "border-[#e8320a]/20 bg-white/96 text-[#e8320a]",
      ].join(" ")}
    >
      {type === "success"
        ? <CheckCircle size={14} weight="fill" className="shrink-0 text-emerald-500" />
        : <Warning size={14} weight="fill" className="shrink-0" />}
      <p className="max-w-xs text-xs font-bold">{msg}</p>
      <button onClick={onClose} className="ml-1 opacity-40 transition-opacity hover:opacity-80"><X size={11} /></button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function DashboardEditor() {
  const [token, setToken] = useState("");
  const [authEmail, setAuthEmail] = useState("demo@foliopage.app");
  const [authPassword, setAuthPassword] = useState("demo-pass");
  const [resetValue, setResetValue] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [user, setUser] = useState<{ id: string; email: string; planType: PlanType } | null>(null);
  const [plans, setPlans] = useState<{ planType: PlanType; limits: { maxProjects: number }; pricing: { proMonthly: number; proAnnual: number } } | null>(null);
  const [profiles, setProfiles] = useState<DbProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProfileDraft>(createDefaultDraft());
  const [pendingResumeFile, setPendingResumeFile] = useState<File | null>(null);
  const [resumeRemoved, setResumeRemoved] = useState(false);
  const [skillInputs, setSkillInputs] = useState<Record<SkillCategory, string>>(EMPTY_SKILLS);
  const checkoutPlan: CheckoutPlan = "pro_monthly";
  const [activeSection, setActiveSection] = useState<NavSection>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const skillsByCategory = useMemo(() => ({
    languages: dedupeSkills(parseSkills(draft.skillsLanguagesInput)),
    frameworks: dedupeSkills(parseSkills(draft.skillsFrameworksInput)),
    tools: dedupeSkills(parseSkills(draft.skillsToolsInput)),
    other: dedupeSkills(parseSkills(draft.skillsOtherInput)),
  }), [draft.skillsLanguagesInput, draft.skillsFrameworksInput, draft.skillsToolsInput, draft.skillsOtherInput]);

  const maxProjects = plans?.limits.maxProjects ?? 3;
  const hasInfo = Boolean(draft.fullName.trim() && draft.headline.trim() && draft.summary.trim() && draft.university.trim() && draft.gradYear.trim() && slugifyName(draft.slug));
  const hasResume = Boolean(draft.resumeFileName);
  const hasProject = draft.projects.some((p) => p.title.trim() && p.summary.trim());
  const publicPath = `/${slugifyName(draft.slug) || "your-name"}`;

  const completionSteps = [
    { label: "Basic info", done: hasInfo, section: "profile" as NavSection },
    { label: "Resume", done: hasResume, section: "resume" as NavSection },
    { label: "One project", done: hasProject, section: "projects" as NavSection },
  ];
  const completionPct = Math.round((completionSteps.filter((s) => s.done).length / completionSteps.length) * 100);

  const skillSections: { category: SkillCategory; title: string; placeholder: string; suggestions: string[] }[] = [
    { category: "languages", title: "Languages", placeholder: "e.g. TypeScript", suggestions: ["TypeScript", "JavaScript", "Python", "Go", "SQL"] },
    { category: "frameworks", title: "Frameworks", placeholder: "e.g. React", suggestions: ["React", "Next.js", "Express", "Django", "FastAPI"] },
    { category: "tools", title: "Tools", placeholder: "e.g. Docker", suggestions: ["Docker", "Git", "Postman", "Figma", "Vercel"] },
    { category: "other", title: "Other", placeholder: "e.g. Product Thinking", suggestions: SUGGESTED_SKILLS },
  ];

  const sectionDone: Partial<Record<NavSection, boolean>> = {
    profile: hasInfo, resume: hasResume, projects: hasProject,
  };

  // ── Data ────────────────────────────────────────────────────────────────────
  const loadProfile = useCallback(async (tok: string, profileId: string, planType: PlanType) => {
    const [pr, jr] = await Promise.all([getProfile(tok, profileId), listProjectsApi(tok, profileId)]);
    setActiveProfileId(profileId);
    setDraft(toDraft(pr.profile, jr.projects, planType));
    setPendingResumeFile(null); setResumeRemoved(false);
    setSkillInputs({ ...EMPTY_SKILLS });
  }, []);

  const bootstrap = useCallback(async (tok: string, preferredId?: string) => {
    setLoading(true);
    try {
      const [me, planRes, profilesRes] = await Promise.all([getMe(tok), getPlans(tok), listProfiles(tok)]);
      setUser({ id: me.id, email: me.email, planType: me.planType });
      setPlans(planRes); setProfiles(profilesRes.profiles);
      const nextId = preferredId ?? activeProfileId ?? profilesRes.profiles[0]?.id ?? null;
      if (nextId) {
        await loadProfile(tok, nextId, planRes.planType);
      } else {
        const next = createDefaultDraft();
        next.slug = slugifyName(me.email.split("@")[0] ?? "");
        next.plan = planRes.planType;
        setActiveProfileId(null); setDraft(next); setSkillInputs({ ...EMPTY_SKILLS });
      }
    } catch (e) {
      setToast({ msg: toError(e), type: "error" });
      setUser(null); setPlans(null); setProfiles([]);
    } finally { setLoading(false); }
  }, [activeProfileId, loadProfile]);

  useEffect(() => {
    const tok = localStorage.getItem(SESSION_KEY) ?? "";
    if (!tok) { setLoading(false); return; }
    setToken(tok); void bootstrap(tok);
  }, [bootstrap]);

  // ⌘S shortcut
  useEffect(() => {
    const h = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); void save(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  // ── Auth ────────────────────────────────────────────────────────────────────
  async function onSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setAuthLoading(true);
    try {
      const r = await signIn(authEmail, authPassword);
      localStorage.setItem(SESSION_KEY, r.token); setToken(r.token);
      await bootstrap(r.token);
    } catch (err) { setToast({ msg: toError(err), type: "error" }); }
    finally { setAuthLoading(false); }
  }

  async function onReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setAuthLoading(true);
    try {
      await resetPassword(authEmail, resetValue);
      setToast({ msg: "Password reset! Sign in with your new password.", type: "success" });
      setAuthPassword(resetValue); setResetValue("");
    } catch (err) { setToast({ msg: toError(err), type: "error" }); }
    finally { setAuthLoading(false); }
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    setToken(""); setUser(null); setPlans(null); setProfiles([]);
    setActiveProfileId(null); setDraft(createDefaultDraft()); setSkillInputs({ ...EMPTY_SKILLS });
  }

  // ── Files ───────────────────────────────────────────────────────────────────
  function onResumePick(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf" || file.size > MAX_RESUME_MB) {
      setToast({ msg: "Resume must be a PDF under 5MB.", type: "error" }); return;
    }
    setPendingResumeFile(file); setResumeRemoved(false);
    setDraft((p) => ({ ...p, resumeFileName: file.name, resumeFileSizeKb: Math.round(file.size / 1024), resumeUpdatedAt: new Date().toISOString().slice(0, 10) }));
  }

  async function onProfileImagePick(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > MAX_IMG_MB) {
      setToast({ msg: "Image must be under 5MB.", type: "error" }); return;
    }
    try {
      const url = await readFileAsDataUrl(file);
      setDraft((p) => ({ ...p, profileImageUrl: url, profileImageVisible: true }));
    } catch (err) { setToast({ msg: toError(err), type: "error" }); }
  }

  // ── Draft helpers ───────────────────────────────────────────────────────────
  function updateProject(idx: number, upd: (p: ProfileDraft["projects"][number]) => ProfileDraft["projects"][number]) {
    setDraft((p) => ({ ...p, projects: p.projects.map((proj, i) => i === idx ? upd(proj) : proj) }));
  }

  function updateCategorySkills(cat: SkillCategory, vals: string[]) {
    const v = vals.join(", ");
    setDraft((p) =>
      cat === "languages" ? { ...p, skillsLanguagesInput: v }
        : cat === "frameworks" ? { ...p, skillsFrameworksInput: v }
          : cat === "tools" ? { ...p, skillsToolsInput: v }
            : { ...p, skillsOtherInput: v }
    );
  }

  function addSkill(cat: SkillCategory, raw: string) {
    const s = raw.trim(); if (!s) return;
    updateCategorySkills(cat, dedupeSkills([...skillsByCategory[cat], s]));
    setSkillInputs((p) => ({ ...p, [cat]: "" }));
  }

  function removeSkill(cat: SkillCategory, skill: string) {
    updateCategorySkills(cat, skillsByCategory[cat].filter((s) => s.toLowerCase() !== skill.toLowerCase()));
  }

  function resetToNew() {
    const next = createDefaultDraft();
    next.plan = plans?.planType ?? "free";
    next.slug = slugifyName(user?.email.split("@")[0] ?? "");
    setActiveProfileId(null); setDraft(next);
    setPendingResumeFile(null); setResumeRemoved(false);
    setSkillInputs({ ...EMPTY_SKILLS });
  }

  // ── Save ────────────────────────────────────────────────────────────────────
  async function save() {
    if (!token) return;
    setSaving(true);
    try {
      const bgRaw = draft.bgImageUrl.trim();
      const bgOverlay = Math.max(0, Math.min(100, Math.round(draft.bgImageOverlay)));
      const hasPendingBg = bgRaw.startsWith("data:image/");
      const hasPendingProfileImage = draft.profileImageUrl.trim().startsWith("data:image/");
      const base = {
        slug: slugifyName(draft.slug), name: draft.fullName.trim(), headline: draft.headline.trim(),
        summary: draft.summary.trim(), university: draft.university.trim(), gradYear: draft.gradYear.trim(),
        internshipStatus: draft.internshipStatus, accentColor: draft.accentColor,
        templateId: draft.templateId, resumeBlockType: draft.resumeBlockType,
        profileImageUrl: draft.profileImageUrl.trim(), profileImageVisible: draft.profileImageVisible,
        bgImageUrl: hasPendingBg ? "" : bgRaw, bgImageOverlay: bgOverlay,
        contactEmail: draft.contactEmail.trim(), emailVisible: draft.emailVisible,
        socials: {
          linkedin: { url: draft.linkedinUrl.trim(), visible: draft.linkedinVisible },
          github: { url: draft.githubUrl.trim(), visible: draft.githubVisible },
          twitter: { url: draft.twitterUrl.trim(), visible: draft.twitterVisible },
          instagram: { url: draft.instagramUrl.trim(), visible: draft.instagramVisible },
        },
      };
      if (!base.slug || !base.name || !base.headline || !base.summary || !base.university || !base.gradYear)
        throw new Error("Fill in all required fields before saving.");

      let profileId = activeProfileId;
      if (!profileId) {
        const created = await createProfileApi(token, {
          ...base,
          // Defer data-url profile image upload to PATCH so it happens exactly once.
          profileImageUrl: hasPendingProfileImage ? "" : base.profileImageUrl,
        });
        profileId = created.profile.id;
      }
      if (!profileId) throw new Error("Could not resolve profile ID.");

      let bgUrl = base.bgImageUrl;
      if (hasPendingBg) {
        const up = await uploadBackgroundImageApi(token, { dataUrl: bgRaw, profileId });
        bgUrl = up.url;
      }

      await updateProfileApi(token, profileId, { ...base, bgImageUrl: bgUrl });

      if (pendingResumeFile) {
        await upsertResumeApi(token, profileId, { fileName: pendingResumeFile.name, fileSizeKb: Math.round(pendingResumeFile.size / 1024) });
        setPendingResumeFile(null);
      } else if (resumeRemoved) {
        await deleteResumeApi(token, profileId); setResumeRemoved(false);
      }

      await setSkillsApi(token, profileId, { languages: skillsByCategory.languages, frameworks: skillsByCategory.frameworks, tools: skillsByCategory.tools, other: skillsByCategory.other });

      const existing = (await listProjectsApi(token, profileId)).projects;
      const existingMap = new Map(existing.map((p) => [p.id, p]));
      const keepIds: string[] = [];

      for (const project of draft.projects.filter((p) => p.title.trim() && p.summary.trim())) {
        const payload = { title: project.title.trim(), summary: project.summary.trim(), highlights: project.highlights.map((h) => h.trim()).filter(Boolean), githubUrl: project.githubUrl.trim(), demoUrl: project.demoUrl.trim(), techStack: project.techStack.split(",").map((t) => t.trim()).filter(Boolean) };
        if (existingMap.has(project.id)) { keepIds.push((await updateProjectApi(token, profileId, project.id, payload)).project.id); }
        else { keepIds.push((await createProjectApi(token, profileId, payload)).project.id); }
      }

      for (const p of existing) { if (!keepIds.includes(p.id)) await deleteProjectApi(token, profileId, p.id); }
      if (keepIds.length > 0) await reorderProjectsApi(token, profileId, keepIds);
      await setPublishedApi(token, profileId, draft.published);
      await bootstrap(token, profileId);
      setToast({ msg: "Changes saved.", type: "success" });
    } catch (err) { setToast({ msg: toError(err), type: "error" }); }
    finally { setSaving(false); }
  }

  async function togglePublish() {
    if (!token) return;
    const next = !draft.published;
    if (!activeProfileId) {
      setDraft((p) => ({ ...p, published: next }));
      setToast({ msg: "Save to apply this change.", type: "success" }); return;
    }
    setSaving(true);
    try {
      await setPublishedApi(token, activeProfileId, next);
      await bootstrap(token, activeProfileId);
      setToast({ msg: next ? "Your page is live! 🎉" : "Page unpublished.", type: "success" });
    } catch (err) { setToast({ msg: toError(err), type: "error" }); }
    finally { setSaving(false); }
  }

  async function simulateUpgrade() {
    if (!token || !user) return;
    setSaving(true);
    try {
      await createCheckoutSessionApi(token, checkoutPlan);
      await processBillingWebhookApi({ event: "payment_succeeded", userId: user.id });
      await bootstrap(token, activeProfileId ?? undefined);
      setToast({ msg: "Membership activated!", type: "success" });
    } catch (err) { setToast({ msg: toError(err), type: "error" }); }
    finally { setSaving(false); }
  }

  async function deleteActiveProfile() {
    if (!token || !activeProfileId) return;
    setSaving(true);
    try {
      await deleteProfileApi(token, activeProfileId);
      await bootstrap(token);
      setToast({ msg: "Profile deleted.", type: "success" });
    } catch (err) { setToast({ msg: toError(err), type: "error" }); }
    finally { setSaving(false); }
  }

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-[#f0ece2] font-[family-name:var(--font-cabinet)]">
        <p className="text-sm font-black tracking-tight text-[#0e0e0e]/25">folio<span className="text-[#e8320a]">page</span></p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ animationDelay: `${i * 180}ms` }} className="h-1.5 w-1.5 animate-pulse bg-[#0e0e0e]/20" />
          ))}
        </div>
      </div>
    );
  }

  // ── Sign-in screen ──────────────────────────────────────────────────────────
  if (!token || !user) {
    return (
      <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#f0ece2] font-[family-name:var(--font-cabinet)] text-[#0e0e0e]">
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[38vw] font-black leading-none tracking-[-0.05em] text-[#0e0e0e]/[0.033]">fp</span>
        <header className="flex items-center justify-between border-b border-[#0e0e0e]/10 px-5 py-4">
          <Link href="/" className="text-sm font-black tracking-tight">folio<span className="text-[#e8320a]">page</span></Link>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#0e0e0e]/28">Dashboard</span>
        </header>
        <main className="flex flex-1 items-start justify-center px-4 py-16">
          <div className="relative z-10 w-full max-w-xl">
            <p className="inline-block border border-[#0e0e0e]/12 bg-[#0e0e0e]/[0.04] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#0e0e0e]/40">Your dashboard</p>
            <h1 className="mt-4 text-[clamp(2.5rem,9vw,5rem)] font-black leading-[0.88] tracking-[-0.04em]">
              Welcome<br /><em className="not-italic text-[#e8320a]">back.</em>
            </h1>
            <div className="mt-8 grid gap-px bg-[#0e0e0e]/8 sm:grid-cols-2">
              <form onSubmit={onSignIn} className="space-y-4 bg-white p-6">
                <h2 className="text-[13px] font-black text-[#0e0e0e]">Sign in</h2>
                <Field label="Email"><input className={inputCls} placeholder="you@example.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} /></Field>
                <Field label="Password"><input type="password" className={inputCls} placeholder="Your password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} /></Field>
                <button disabled={authLoading} className="group inline-flex items-center gap-2 border border-[#e8320a] bg-[#e8320a] px-5 py-2.5 font-mono text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-[#e8320a] disabled:opacity-55">
                  {authLoading ? "Signing in…" : <><span>Sign in</span><ArrowRight size={10} weight="bold" className="transition-transform group-hover:translate-x-0.5" /></>}
                </button>
              </form>
              <form onSubmit={onReset} className="space-y-4 bg-[#f8f6f0] p-6">
                <h2 className="text-[13px] font-black text-[#0e0e0e]">Reset password</h2>
                <Field label="New password"><input type="password" className={inputCls} placeholder="Set a new password" value={resetValue} onChange={(e) => setResetValue(e.target.value)} /></Field>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button disabled={authLoading} className="border border-[#0e0e0e]/12 px-4 py-2.5 font-mono text-[10px] font-black uppercase tracking-widest text-[#0e0e0e]/45 transition-all hover:border-[#0e0e0e]/28 hover:text-[#0e0e0e] disabled:opacity-55">{authLoading ? "Resetting…" : "Reset"}</button>
                  <Link href="/sign-up" className="font-mono text-[10px] uppercase tracking-widest text-[#0e0e0e]/30 hover:text-[#0e0e0e] transition-colors">Sign up →</Link>
                </div>
              </form>
            </div>
          </div>
        </main>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        <style>{`@keyframes toastIn { from { transform: translateX(-50%) translateY(12px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }`}</style>
      </div>
    );
  }

  // ── Section content map ─────────────────────────────────────────────────────
  const sectionContent: Record<NavSection, React.ReactNode> = {

    profile: (
      <div className="space-y-4">
        <Card>
          <CardHeader title="Basic information" subtitle="What recruiters see first — make it memorable." />
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Full name *"><input className={inputCls} placeholder="Ava Chen" value={draft.fullName} onChange={(e) => setDraft((p) => ({ ...p, fullName: e.target.value }))} /></Field>
            <Field label="Headline *"><input className={inputCls} placeholder="CS student building reliable apps" value={draft.headline} onChange={(e) => setDraft((p) => ({ ...p, headline: e.target.value }))} /></Field>
            <Field label="Summary *" className="sm:col-span-2"><input className={inputCls} placeholder="Brief bio about who you are..." value={draft.summary} onChange={(e) => setDraft((p) => ({ ...p, summary: e.target.value }))} /></Field>
            <Field label="University *"><input className={inputCls} placeholder="University name" value={draft.university} onChange={(e) => setDraft((p) => ({ ...p, university: e.target.value }))} /></Field>
            <Field label="Graduation year *"><input className={inputCls} placeholder="2027" value={draft.gradYear} onChange={(e) => setDraft((p) => ({ ...p, gradYear: e.target.value }))} /></Field>
            <Field label="Public URL *" hint={`Your page → foliopage.app${publicPath}`} className="sm:col-span-2">
              <div className="flex">
                <span className="flex shrink-0 items-center border border-r-0 border-[#0e0e0e]/12 bg-[#f8f6f0] px-3 font-mono text-[10px] text-[#0e0e0e]/32">foliopage.app/</span>
                <input className="flex-1 border border-[#0e0e0e]/12 bg-white px-3 py-2.5 font-mono text-sm text-[#0e0e0e] outline-none transition-all focus:border-[#0e0e0e]/30 focus:ring-2 focus:ring-[#0e0e0e]/5" placeholder="your-name" value={draft.slug} onChange={(e) => setDraft((p) => ({ ...p, slug: slugifyName(e.target.value) }))} />
              </div>
            </Field>
            <Field label="Status" className="sm:col-span-2">
              <select className={inputCls + " cursor-pointer"} value={draft.internshipStatus} onChange={(e) => setDraft((p) => ({ ...p, internshipStatus: toStatus(e.target.value) }))}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Profile photo" subtitle="A face builds trust. Takes 10 seconds to add." />
          <div className="flex flex-wrap items-start gap-5 p-5">
            <div className="relative shrink-0">
              {draft.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <div className="relative">
                  <img src={draft.profileImageUrl} alt="Profile" className="h-20 w-20 border border-[#0e0e0e]/10 object-cover" />
                  <button onClick={() => setDraft((p) => ({ ...p, profileImageUrl: "", profileImageVisible: false }))} className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center bg-[#0e0e0e] text-white transition-colors hover:bg-[#e8320a]"><X size={9} weight="bold" /></button>
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center border-2 border-dashed border-[#0e0e0e]/12 bg-[#f8f6f0]">
                  <User size={22} className="text-[#0e0e0e]/18" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <label className="block cursor-pointer">
                <Label>Upload file (max 5MB)</Label>
                <input type="file" accept="image/*" className="mt-1.5 block text-xs text-[#0e0e0e]/45 file:mr-3 file:cursor-pointer file:border file:border-[#0e0e0e]/12 file:bg-[#f8f6f0] file:px-3 file:py-1.5 file:font-mono file:text-[9px] file:uppercase file:tracking-widest file:text-[#0e0e0e]/45 file:transition-colors file:hover:border-[#0e0e0e]/22 file:hover:text-[#0e0e0e]/70" onChange={(e) => void onProfileImagePick(e.target.files?.[0])} />
              </label>
              <Field label="Or paste URL"><input className={inputCls} placeholder="https://example.com/photo.jpg" value={draft.profileImageUrl} onChange={(e) => setDraft((p) => ({ ...p, profileImageUrl: e.target.value }))} /></Field>
              <Toggle checked={draft.profileImageVisible} onChange={(v) => setDraft((p) => ({ ...p, profileImageVisible: v }))} label="Show photo on public page" />
            </div>
          </div>
        </Card>
      </div>
    ),

    resume: (
      <div className="space-y-4">
        <Card>
          <CardHeader title="Your resume" subtitle="PDF only, max 5MB. Recruiters get a prominent one-click download." />
          <div className="p-5">
            {draft.resumeFileName ? (
              <div className="flex items-center justify-between gap-4 border border-[#0e0e0e]/8 bg-[#f8f6f0] px-4 py-4">
                <div className="flex items-center gap-3">
                  <FilePdf size={24} weight="fill" className="shrink-0 text-[#e8320a]" />
                  <div>
                    <p className="text-[13px] font-black text-[#0e0e0e]">{draft.resumeFileName}</p>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/32">{draft.resumeFileSizeKb} KB · {draft.resumeUpdatedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer border border-[#0e0e0e]/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/42 transition-all hover:border-[#0e0e0e]/22 hover:text-[#0e0e0e]">
                    Replace<input type="file" accept="application/pdf" className="sr-only" onChange={(e) => onResumePick(e.target.files?.[0])} />
                  </label>
                  <button onClick={() => { setResumeRemoved(true); setPendingResumeFile(null); setDraft((p) => ({ ...p, resumeFileName: "", resumeFileSizeKb: 0, published: false })); }} className="border border-[#0e0e0e]/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/32 transition-all hover:border-[#e8320a]/25 hover:text-[#e8320a]">Remove</button>
                </div>
              </div>
            ) : (
              <label className="group flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed border-[#0e0e0e]/10 py-14 text-center transition-all hover:border-[#e8320a]/30 hover:bg-[#e8320a]/[0.018]">
                <FilePdf size={32} className="text-[#0e0e0e]/18 transition-colors group-hover:text-[#e8320a]/40" />
                <div>
                  <p className="text-sm font-black text-[#0e0e0e]/45 group-hover:text-[#0e0e0e]/65">Drop your resume or <span className="text-[#e8320a]">browse</span></p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/22">PDF only · max 5 MB</p>
                </div>
                <input type="file" accept="application/pdf" className="sr-only" onChange={(e) => onResumePick(e.target.files?.[0])} />
              </label>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Resume display" subtitle="How your resume block looks on your public page." />
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {[
              { val: "without_preview", title: "Download card", desc: "Clean name + file size + download button.", badge: "Recommended" },
              { val: "with_preview", title: "Embedded preview", desc: "Full PDF viewer inline + download button.", badge: null },
            ].map((opt) => (
              <label key={opt.val} className={["flex cursor-pointer gap-3 border p-4 transition-all", draft.resumeBlockType === opt.val ? "border-[#0e0e0e]/22 bg-[#0e0e0e]/[0.025]" : "border-[#0e0e0e]/7 bg-white hover:border-[#0e0e0e]/14"].join(" ")}>
                <div className={["mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-all", draft.resumeBlockType === opt.val ? "border-[#0e0e0e] bg-[#0e0e0e]" : "border-[#0e0e0e]/18"].join(" ")}>
                  {draft.resumeBlockType === opt.val && <span className="h-2 w-2 bg-white" />}
                </div>
                <div>
                  <p className="text-[13px] font-black text-[#0e0e0e]">{opt.title}</p>
                  <p className="mt-0.5 text-[11px] text-[#0e0e0e]/42">{opt.desc}</p>
                  {opt.badge && <span className="mt-2 inline-block border border-[#0e0e0e]/8 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#0e0e0e]/32">{opt.badge}</span>}
                </div>
                <input type="radio" name="resume-block-type" className="sr-only" checked={draft.resumeBlockType === opt.val} onChange={() => setDraft((p) => ({ ...p, resumeBlockType: opt.val as "without_preview" | "with_preview" }))} />
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Skills" subtitle="Tag your stack. Recruiters scan these fast." />
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {skillSections.map((sec) => (
              <div key={sec.category} className="border border-[#0e0e0e]/7 bg-[#f8f6f0] p-4">
                <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#0e0e0e]/38">{sec.title}</p>
                <div className="flex gap-2">
                  <input
                    className="min-w-0 flex-1 border border-[#0e0e0e]/10 bg-white px-2.5 py-2 text-xs outline-none placeholder-[#0e0e0e]/22 transition-all focus:border-[#0e0e0e]/28 focus:ring-1 focus:ring-[#0e0e0e]/6"
                    placeholder={sec.placeholder}
                    value={skillInputs[sec.category]}
                    onChange={(e) => setSkillInputs((p) => ({ ...p, [sec.category]: e.target.value }))}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") { e.preventDefault(); addSkill(sec.category, skillInputs[sec.category]); } }}
                  />
                  <button onClick={() => addSkill(sec.category, skillInputs[sec.category])} className="border border-[#0e0e0e]/10 px-3 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/40 transition-all hover:border-[#0e0e0e]/22 hover:text-[#0e0e0e]">Add</button>
                </div>
                {skillsByCategory[sec.category].length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {skillsByCategory[sec.category].map((skill) => (
                      <button key={skill} onClick={() => removeSkill(sec.category, skill)} className="group flex items-center gap-1 border border-[#0e0e0e]/8 bg-white px-2.5 py-1 font-mono text-[9px] text-[#0e0e0e]/55 transition-all hover:border-[#e8320a]/22 hover:text-[#e8320a]">
                        {skill}<X size={8} className="opacity-35 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {sec.suggestions.filter((s) => !skillsByCategory[sec.category].some((e) => e.toLowerCase() === s.toLowerCase())).map((s) => (
                    <button key={s} onClick={() => addSkill(sec.category, s)} className="border border-dashed border-[#0e0e0e]/8 px-2.5 py-1 font-mono text-[9px] text-[#0e0e0e]/28 transition-all hover:border-[#0e0e0e]/18 hover:text-[#0e0e0e]/52">+ {s}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    ),

    contact: (
      <div className="space-y-4">
        <Card>
          <CardHeader title="Contact email" subtitle="How recruiters reach you directly from your page." />
          <div className="space-y-4 p-5">
            <Field label="Public contact email" hint="Leave blank to use your account email when visible.">
              <input className={inputCls} placeholder="e.g. hire@yourname.com" value={draft.contactEmail} onChange={(e) => setDraft((p) => ({ ...p, contactEmail: e.target.value }))} />
            </Field>
            <Toggle checked={draft.emailVisible} onChange={(v) => setDraft((p) => ({ ...p, emailVisible: v }))} label="Show email on public page" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Social links" subtitle="Add links and choose which ones are visible." />
          <div className="divide-y divide-[#0e0e0e]/5">
            {([
              { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/handle", Icon: LinkedinLogo, url: draft.linkedinUrl, visible: draft.linkedinVisible },
              { key: "github", label: "GitHub", placeholder: "https://github.com/handle", Icon: GithubLogo, url: draft.githubUrl, visible: draft.githubVisible },
              { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/handle", Icon: TwitterLogo, url: draft.twitterUrl, visible: draft.twitterVisible },
              { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/handle", Icon: InstagramLogo, url: draft.instagramUrl, visible: draft.instagramVisible },
            ] as const).map((s) => (
              <div key={s.key} className="flex items-center gap-4 px-5 py-4">
                <s.Icon size={16} className="shrink-0 text-[#0e0e0e]/28" />
                <div className="flex-1">
                  <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#0e0e0e]/35">{s.label}</p>
                  <input className={inputCls} placeholder={s.placeholder} value={s.url} onChange={(e) => setDraft((p) => ({ ...p, [`${s.key}Url`]: e.target.value }))} />
                </div>
                <Toggle checked={s.visible} onChange={(v) => setDraft((p) => ({ ...p, [`${s.key}Visible`]: v }))} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    ),

    projects: (
      <div className="space-y-4">
        {draft.projects.map((project, idx) => (
          <Card key={project.id}>
            <CardHeader
              title={project.title || `Project ${idx + 1}`}
              subtitle={project.summary || "Add title and summary to activate this project."}
              action={
                <button onClick={() => setDraft((p) => ({ ...p, projects: p.projects.filter((_, i) => i !== idx) }))} className="flex items-center gap-1.5 border border-[#0e0e0e]/8 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/32 transition-all hover:border-[#e8320a]/22 hover:text-[#e8320a]">
                  <Trash size={9} />Remove
                </button>
              }
            />
            <div className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title *"><input className={inputCls} placeholder="FocusFlow" value={project.title} onChange={(e) => updateProject(idx, (p) => ({ ...p, title: e.target.value }))} /></Field>
                <Field label="Summary *"><input className={inputCls} placeholder="What it does and who it helps" value={project.summary} onChange={(e) => updateProject(idx, (p) => ({ ...p, summary: e.target.value }))} /></Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {(["Problem", "Solution", "Impact"] as const).map((h, hi) => (
                  <Field key={h} label={h} hint={["What issue?", "What you built", "Measurable result"][hi]}>
                    <input className={inputCls} placeholder={["What issue?", "What you built?", "+34% metric"][hi]} value={project.highlights[hi] ?? ""} onChange={(e) => updateProject(idx, (p) => { const n = [...p.highlights] as [string, string, string]; n[hi] = e.target.value; return { ...p, highlights: n }; })} />
                  </Field>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="GitHub URL (optional)"><input className={inputCls} placeholder="https://github.com/you/repo" value={project.githubUrl} onChange={(e) => updateProject(idx, (p) => ({ ...p, githubUrl: e.target.value }))} /></Field>
                <Field label="Demo URL (optional)"><input className={inputCls} placeholder="https://your-demo.app" value={project.demoUrl} onChange={(e) => updateProject(idx, (p) => ({ ...p, demoUrl: e.target.value }))} /></Field>
              </div>
              <Field label="Tools used" hint="Comma-separated">
                <input className={inputCls} placeholder="React, TypeScript, Postgres" value={project.techStack} onChange={(e) => updateProject(idx, (p) => ({ ...p, techStack: e.target.value }))} />
              </Field>
            </div>
          </Card>
        ))}

        {draft.projects.length < maxProjects ? (
          <button onClick={() => setDraft((p) => ({ ...p, projects: [...p.projects, createProjectDraft(`project-${p.projects.length + 1}`)] }))} className="group flex w-full items-center justify-center gap-2.5 border-2 border-dashed border-[#0e0e0e]/10 py-5 font-mono text-[10px] uppercase tracking-widest text-[#0e0e0e]/32 transition-all hover:border-[#0e0e0e]/22 hover:text-[#0e0e0e]/55">
            <Plus size={12} className="transition-transform duration-200 group-hover:rotate-90" />
            Add project <span className="opacity-50">({draft.projects.length}/{maxProjects})</span>
          </button>
        ) : (
          <div className="border border-[#0e0e0e]/7 bg-[#f8f6f0] px-5 py-4">
            <p className="text-xs text-[#0e0e0e]/48">Limit of <strong>{maxProjects}</strong> projects reached.{plans?.planType === "free" && <> <button onClick={() => setActiveSection("settings")} className="font-bold text-[#e8320a] underline underline-offset-2">Upgrade to Member</button> for unlimited.</>}</p>
          </div>
        )}
      </div>
    ),

    appearance: (
      <TemplatePicker
        value={draft.templateId} bgImageUrl={draft.bgImageUrl} bgImageOverlay={draft.bgImageOverlay}
        onChange={(templateId) => setDraft((p) => ({ ...p, templateId }))}
        onBgImageChange={(bgImageUrl) => setDraft((p) => ({ ...p, bgImageUrl }))}
        onBgImageOverlayChange={(bgImageOverlay) => setDraft((p) => ({ ...p, bgImageOverlay }))}
      />
    ),

    settings: (
      <div className="space-y-4">
        <Card>
          <CardHeader title="Profile" subtitle="Switch between profiles or start a new one." />
          <div className="p-5 space-y-3">
            <Field label="Active profile">
              <select value={activeProfileId ?? ""} onChange={(e) => { const id = e.target.value; if (!id || !plans) { resetToNew(); return; } void loadProfile(token, id, plans.planType); }} className={inputCls + " cursor-pointer"}>
                <option value="">+ Create new profile</option>
                {profiles.map((p) => <option key={p.id} value={p.id}>{p.name} — /{p.slug}</option>)}
              </select>
            </Field>
            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={resetToNew} className="border border-[#0e0e0e]/10 px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/42 transition-all hover:border-[#0e0e0e]/22 hover:text-[#0e0e0e]">+ New draft</button>
              {activeProfileId && (
                <button onClick={deleteActiveProfile} disabled={saving} className="flex items-center gap-1.5 border border-[#0e0e0e]/8 px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/32 transition-all hover:border-[#e8320a]/22 hover:text-[#e8320a] disabled:opacity-50">
                  <Trash size={10} />Delete this profile
                </button>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Billing" subtitle={`Current plan: ${plans?.planType === "pro" ? "Member" : "Free"}`} />
          <div className="p-5 space-y-4">
            {plans?.planType === "free" && (
              <div className="border border-[#e8320a]/12 bg-[#e8320a]/[0.035] px-4 py-3">
                <p className="text-xs font-black text-[#0e0e0e]/55">Upgrade for unlimited projects, custom domain, and full analytics.</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <div className="border border-[#0e0e0e] bg-[#0e0e0e] px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-white">
                {`Member - Rs.${plans?.pricing.proMonthly ?? 499}/mo`}
              </div>
            </div>
            <button onClick={simulateUpgrade} disabled={saving} className="inline-flex items-center gap-2 border border-[#e8320a] bg-[#e8320a] px-5 py-2.5 font-mono text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-[#e8320a] disabled:opacity-50">
              <Lightning size={10} weight="fill" />Activate membership
            </button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Account" />
          <div className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-bold text-[#0e0e0e]">{user.email}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/32">{plans?.planType === "pro" ? "Member plan" : "Free plan"} · {profiles.length} profile{profiles.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={signOut} className="flex items-center gap-1.5 border border-[#0e0e0e]/8 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/38 transition-all hover:border-[#0e0e0e]/22 hover:text-[#0e0e0e]">
              <SignOut size={11} />Sign out
            </button>
          </div>
        </Card>
      </div>
    ),
  };

  // ── Dashboard render ────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-dvh bg-[#f0ece2] font-[family-name:var(--font-cabinet)] text-[#0e0e0e]">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0e0e0e]/25 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={[
        "fixed left-0 top-0 z-50 flex h-dvh w-60 flex-col overflow-hidden",
        "border-r border-[#0e0e0e]/8 bg-[#eceae0]",
        "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "lg:sticky lg:translate-x-0",
        sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
      ].join(" ")}>

        {/* Brand row */}
        <div className="flex items-center justify-between border-b border-[#0e0e0e]/8 px-5 py-4">
          <Link href="/" className="text-[13px] font-black tracking-tight">folio<span className="text-[#e8320a]">page</span></Link>
          <button className="lg:hidden p-1 text-[#0e0e0e]/35 hover:text-[#0e0e0e] transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={13} weight="bold" />
          </button>
        </div>

        {/* Profile card */}
        <div className="border-b border-[#0e0e0e]/8 px-4 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border border-[#0e0e0e]/10 bg-[#0e0e0e]">
              {draft.profileImageUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={draft.profileImageUrl} alt="" className="h-full w-full object-cover" />
                : <span className="text-xs font-black text-white">{(draft.fullName || "?")[0]?.toUpperCase()}</span>
              }
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-black text-[#0e0e0e]">{draft.fullName || "Untitled profile"}</p>
              <p className="truncate font-mono text-[8px] uppercase tracking-widest text-[#0e0e0e]/32">{publicPath}</p>
            </div>
          </div>

          {/* Completion progress */}
          <div className="flex items-center gap-3">
            <ProgressRing pct={completionPct} size={34} />
            <div>
              <p className="text-[11px] font-black text-[#0e0e0e]">{completionPct}% ready</p>
              <p className="font-mono text-[8px] text-[#0e0e0e]/32">{completionSteps.filter((s) => s.done).length} of {completionSteps.length} done</p>
            </div>
          </div>

          {/* Progress steps */}
          <div className="space-y-1">
            {completionSteps.map((step) => (
              <button key={step.label} onClick={() => { setActiveSection(step.section); setSidebarOpen(false); }} className="flex w-full items-center gap-2 text-left transition-colors hover:opacity-80">
                {step.done
                  ? <CheckCircle size={11} weight="fill" className="shrink-0 text-emerald-500" />
                  : <Circle size={11} className="shrink-0 text-[#0e0e0e]/22" />}
                <span className={["font-mono text-[8px] uppercase tracking-widest", step.done ? "text-[#0e0e0e]/55" : "text-[#0e0e0e]/30"].join(" ")}>{step.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = activeSection === id;
            const done = sectionDone[id];
            return (
              <button
                key={id}
                onClick={() => { setActiveSection(id); setSidebarOpen(false); }}
                className={[
                  "group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-all duration-100",
                  active ? "bg-[#0e0e0e] text-white" : "text-[#0e0e0e]/50 hover:bg-[#0e0e0e]/6 hover:text-[#0e0e0e]/80",
                ].join(" ")}
              >
                <Icon size={14} weight={active ? "fill" : "regular"} className={active ? "text-white/80" : "text-[#0e0e0e]/30 group-hover:text-[#0e0e0e]/55"} />
                <span className="flex-1 text-[12px] font-bold tracking-tight">{label}</span>
                {done === true && <CheckCircle size={11} weight="fill" className={active ? "text-emerald-400" : "text-emerald-500"} />}
                {done === false && <Circle size={10} className={active ? "text-white/28" : "text-[#0e0e0e]/18"} />}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-[#0e0e0e]/8 p-3 space-y-2">
          {/* Publish toggle */}
          <div className={[
            "flex items-center justify-between gap-2 border px-3 py-2.5 transition-colors",
            draft.published ? "border-emerald-300/50 bg-emerald-50" : "border-[#0e0e0e]/7 bg-white",
          ].join(" ")}>
            <div className="flex items-center gap-2">
              <span className={["h-2 w-2 rounded-full transition-colors", draft.published ? "animate-pulse bg-emerald-500" : "bg-[#0e0e0e]/18"].join(" ")} />
              <span className={["font-mono text-[9px] font-black uppercase tracking-widest", draft.published ? "text-emerald-700" : "text-[#0e0e0e]/42"].join(" ")}>
                {draft.published ? "Live" : "Draft"}
              </span>
            </div>
            <Toggle checked={draft.published} onChange={() => void togglePublish()} />
          </div>

          {/* Save */}
          <button
            onClick={save}
            disabled={saving}
            className={[
              "group flex w-full items-center justify-center gap-2 border py-2.5 font-mono text-[9px] font-black uppercase tracking-widest transition-all duration-150 disabled:opacity-50",
              saving ? "border-[#0e0e0e]/8 bg-[#0e0e0e]/[0.04] text-[#0e0e0e]/38" : "border-[#e8320a] bg-[#e8320a] text-white hover:bg-transparent hover:text-[#e8320a]",
            ].join(" ")}
          >
            <FloppyDisk size={10} weight="fill" className={saving ? "animate-[spin_1.5s_linear_infinite]" : ""} />
            {saving ? "Saving…" : "Save changes"}
          </button>

          {/* View live link */}
          {draft.published && (
            <Link href={publicPath} target="_blank" className="flex items-center justify-center gap-1.5 font-mono text-[8px] uppercase tracking-widest text-[#0e0e0e]/30 transition-colors hover:text-[#0e0e0e] py-1">
              <ArrowSquareOut size={9} />View live page
            </Link>
          )}

          <p className="text-center font-mono text-[8px] text-[#0e0e0e]/18 pt-0.5">⌘S to save anytime</p>
        </div>
      </aside>

      {/* ── Main panel ──────────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#0e0e0e]/7 bg-[#f0ece2]/96 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 text-[#0e0e0e]/40 hover:text-[#0e0e0e] transition-colors">
              <ListBullets size={17} />
            </button>
            <nav className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#0e0e0e]/30">
              <House size={10} />
              <CaretRight size={7} className="opacity-35" />
              <span className="font-bold text-[#0e0e0e]/55">{NAV_ITEMS.find((n) => n.id === activeSection)?.label}</span>
            </nav>
          </div>

          {/* Mobile save + status */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className={["flex items-center gap-1.5 border px-2.5 py-1", draft.published ? "border-emerald-300/50 bg-emerald-50 text-emerald-700" : "border-[#0e0e0e]/8 bg-white text-[#0e0e0e]/38"].join(" ")}>
              <span className={["h-1.5 w-1.5 rounded-full", draft.published ? "animate-pulse bg-emerald-500" : "bg-[#0e0e0e]/18"].join(" ")} />
              <span className="font-mono text-[8px] font-black uppercase tracking-widest">{draft.published ? "Live" : "Draft"}</span>
            </div>
            <button onClick={save} disabled={saving} className="border border-[#e8320a] bg-[#e8320a] px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-widest text-white disabled:opacity-50">
              {saving ? "…" : "Save"}
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto px-4 py-7 sm:px-6 lg:px-8">
          {/* Page heading */}
          <div className="mb-6 max-w-3xl">
            {(() => {
              const item = NAV_ITEMS.find((n) => n.id === activeSection);
              if (!item) return null;
              const Icon = item.Icon;
              return (
                <div className="flex items-center gap-2.5">
                  <Icon size={17} className="text-[#0e0e0e]/28" weight="fill" />
                  <h1 className="text-[clamp(1.1rem,3vw,1.4rem)] font-black tracking-tight text-[#0e0e0e]">{item.label}</h1>
                </div>
              );
            })()}

            {/* Inline completion chips */}
            {["profile", "resume", "projects"].includes(activeSection) && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {completionSteps.map((step) => (
                  <button
                    key={step.label}
                    onClick={() => setActiveSection(step.section)}
                    className={[
                      "flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[8px] uppercase tracking-widest transition-all hover:opacity-75",
                      step.done ? "border-emerald-300/50 bg-emerald-50 text-emerald-700" : "border-[#0e0e0e]/8 bg-white text-[#0e0e0e]/38",
                    ].join(" ")}
                  >
                    {step.done ? <CheckCircle size={9} weight="fill" /> : <Circle size={9} />}
                    {step.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section content */}
          <div className="max-w-3xl">
            {sectionContent[activeSection]}
          </div>

          {/* Prev / Next footer nav */}
          <div className="mt-8 flex max-w-3xl items-center justify-between border-t border-[#0e0e0e]/7 pt-6">
            {(() => {
              const idx = NAV_ITEMS.findIndex((n) => n.id === activeSection);
              const prev = NAV_ITEMS[idx - 1];
              const next = NAV_ITEMS[idx + 1];
              return (
                <>
                  {prev ? (
                    <button onClick={() => setActiveSection(prev.id)} className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/32 transition-colors hover:text-[#0e0e0e]/65">← {prev.label}</button>
                  ) : <span />}
                  {next ? (
                    <button onClick={() => setActiveSection(next.id)} className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/32 transition-colors hover:text-[#0e0e0e]/65">{next.label} →</button>
                  ) : (
                    <button onClick={save} disabled={saving} className="flex items-center gap-2 border border-[#e8320a] bg-[#e8320a] px-4 py-2 font-mono text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-[#e8320a] disabled:opacity-50">
                      <FloppyDisk size={10} weight="fill" />Save & publish
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <style>{`
        @keyframes toastIn {
          from { transform: translateX(-50%) translateY(14px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
