"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  createDefaultDraft,
  createProjectDraft,
  parseSkills,
  slugifyName,
  type ProfileDraft,
} from "@/lib/mvp-flow";
import { TemplatePicker } from "@/components/TemplatePicker";
import { defaultProfileTemplateId } from "@/lib/profile-templates";
import type { CheckoutPlan, DbProfile, DbProject, PlanType } from "@/lib/pseudo-db";
import {
  ApiClientError,
  createCheckoutSessionApi,
  createProfileApi,
  createProjectApi,
  deleteProfileApi,
  deleteProjectApi,
  deleteResumeApi,
  getMe,
  getPlans,
  getProfile,
  listProfiles,
  listProjectsApi,
  processBillingWebhookApi,
  reorderProjectsApi,
  resetPassword,
  setPublishedApi,
  setSkillsApi,
  signIn,
  updateProfileApi,
  updateProjectApi,
  upsertResumeApi,
} from "@/lib/site-api";

const SESSION_KEY = "foliopage_token";
const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;
const statuses = [
  "Seeking Summer 2026 internship",
  "Open to Fall 2026 co-op",
  "Open to full-time 2027",
  "Not actively seeking",
] as const;

const suggestedSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "SQL",
  "Figma",
];

type SkillCategory = "languages" | "frameworks" | "tools" | "other";

const emptySkillInputs: Record<SkillCategory, string> = {
  languages: "",
  frameworks: "",
  tools: "",
  other: "",
};

function toError(error: unknown): string {
  if (error instanceof ApiClientError || error instanceof Error) {
    return error.message;
  }
  return "Something went wrong.";
}

function toStatus(value: string): (typeof statuses)[number] {
  if (statuses.includes(value as (typeof statuses)[number])) {
    return value as (typeof statuses)[number];
  }
  return "Seeking Summer 2026 internship";
}

function toDraft(profile: DbProfile, projects: DbProject[], plan: PlanType): ProfileDraft {
  const socials = profile.socials ?? {
    linkedin: { url: "", visible: false },
    github: { url: "", visible: false },
    twitter: { url: "", visible: false },
    instagram: { url: "", visible: false },
  };

  return {
    fullName: profile.name,
    headline: profile.headline,
    university: profile.university,
    gradYear: profile.gradYear,
    internshipStatus: toStatus(profile.internshipStatus),
    accentColor: profile.accentColor,
    templateId: profile.templateId ?? defaultProfileTemplateId,
    slug: profile.slug,
    plan,
    resumeBlockType: profile.resumeBlockType ?? "without_preview",
    resumeFileName: profile.resume?.fileName ?? "",
    resumeFileSizeKb: profile.resume?.fileSizeKb ?? 0,
    resumeUpdatedAt: profile.resume?.updatedAt.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    skillsLanguagesInput: profile.skills.languages.join(", "),
    skillsFrameworksInput: profile.skills.frameworks.join(", "),
    skillsToolsInput: profile.skills.tools.join(", "),
    skillsOtherInput: profile.skills.other.join(", "),
    contactEmail: profile.contactEmail ?? "",
    emailVisible: profile.emailVisible ?? true,
    linkedinUrl: socials.linkedin.url ?? "",
    linkedinVisible: socials.linkedin.visible ?? false,
    githubUrl: socials.github.url ?? "",
    githubVisible: socials.github.visible ?? false,
    twitterUrl: socials.twitter.url ?? "",
    twitterVisible: socials.twitter.visible ?? false,
    instagramUrl: socials.instagram.url ?? "",
    instagramVisible: socials.instagram.visible ?? false,
    published: profile.published,
    projects:
      projects.length > 0
        ? projects.map((project) => ({
            id: project.id,
            title: project.title,
            summary: project.summary,
            highlights: [project.highlights[0] ?? "", project.highlights[1] ?? "", project.highlights[2] ?? ""],
            githubUrl: project.githubUrl,
            demoUrl: project.demoUrl,
            techStack: project.techStack.join(", "),
          }))
        : [createProjectDraft("project-1")],
  };
}

function dedupeSkills(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(normalized);
  }
  return output;
}

export function DashboardEditor() {
  const [token, setToken] = useState("");
  const [authEmail, setAuthEmail] = useState("demo@foliopage.app");
  const [authPassword, setAuthPassword] = useState("demo-pass");
  const [resetValue, setResetValue] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [user, setUser] = useState<{ id: string; email: string; planType: PlanType } | null>(null);
  const [plans, setPlans] = useState<{
    planType: PlanType;
    limits: { maxProjects: number };
    pricing: { proMonthly: number; proAnnual: number };
  } | null>(null);

  const [profiles, setProfiles] = useState<DbProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProfileDraft>(createDefaultDraft());
  const [pendingResumeFile, setPendingResumeFile] = useState<File | null>(null);
  const [resumeRemoved, setResumeRemoved] = useState(false);
  const [skillInputs, setSkillInputs] = useState<Record<SkillCategory, string>>(emptySkillInputs);
  const [checkoutPlan, setCheckoutPlan] = useState<CheckoutPlan>("pro_monthly");

  const skillsByCategory = useMemo(
    () => ({
      languages: dedupeSkills(parseSkills(draft.skillsLanguagesInput)),
      frameworks: dedupeSkills(parseSkills(draft.skillsFrameworksInput)),
      tools: dedupeSkills(parseSkills(draft.skillsToolsInput)),
      other: dedupeSkills(parseSkills(draft.skillsOtherInput)),
    }),
    [
      draft.skillsLanguagesInput,
      draft.skillsFrameworksInput,
      draft.skillsToolsInput,
      draft.skillsOtherInput,
    ],
  );
  const maxProjects = plans?.limits.maxProjects ?? 3;
  const hasRequiredProfileFields = Boolean(
    draft.fullName.trim() &&
      draft.headline.trim() &&
      draft.university.trim() &&
      draft.gradYear.trim() &&
      slugifyName(draft.slug),
  );
  const hasResume = Boolean(draft.resumeFileName);
  const hasProject = draft.projects.some((project) => project.title.trim() && project.summary.trim());
  const publicPath = `/${slugifyName(draft.slug) || "your-name"}`;

  const completionItems = [
    { label: "Basic info completed", done: hasRequiredProfileFields },
    { label: "Resume uploaded", done: hasResume },
    { label: "At least one project", done: hasProject },
    { label: "Ready to publish", done: hasRequiredProfileFields && hasResume },
  ];
  const skillSections: Array<{
    category: SkillCategory;
    title: string;
    placeholder: string;
    suggestions: string[];
  }> = [
    {
      category: "languages",
      title: "Languages",
      placeholder: "Type a language (example: TypeScript)",
      suggestions: ["TypeScript", "JavaScript", "Python", "Go", "SQL"],
    },
    {
      category: "frameworks",
      title: "Frameworks",
      placeholder: "Type a framework (example: React)",
      suggestions: ["React", "Next.js", "Express", "Django", "FastAPI"],
    },
    {
      category: "tools",
      title: "Tools",
      placeholder: "Type a tool (example: Docker)",
      suggestions: ["Docker", "Git", "Postman", "Figma", "Vercel"],
    },
    {
      category: "other",
      title: "Other",
      placeholder: "Type another skill (example: Product Thinking)",
      suggestions: suggestedSkills,
    },
  ];

  const loadProfile = useCallback(async (sessionToken: string, profileId: string, planType: PlanType) => {
    const [profileRes, projectsRes] = await Promise.all([
      getProfile(sessionToken, profileId),
      listProjectsApi(sessionToken, profileId),
    ]);
    setActiveProfileId(profileId);
    setDraft(toDraft(profileRes.profile, projectsRes.projects, planType));
    setPendingResumeFile(null);
    setResumeRemoved(false);
    setSkillInputs({ ...emptySkillInputs });
  }, []);

  const bootstrap = useCallback(async (sessionToken: string, preferredProfileId?: string) => {
    setLoading(true);
    setError("");
    try {
      const me = await getMe(sessionToken);
      const planRes = await getPlans(sessionToken);
      const profilesRes = await listProfiles(sessionToken);
      setUser({ id: me.id, email: me.email, planType: me.planType });
      setPlans(planRes);
      setProfiles(profilesRes.profiles);

      const nextProfileId = preferredProfileId ?? activeProfileId ?? profilesRes.profiles[0]?.id ?? null;
      if (nextProfileId) {
        await loadProfile(sessionToken, nextProfileId, planRes.planType);
      } else {
        const next = createDefaultDraft();
        next.slug = slugifyName(me.email.split("@")[0] ?? "");
        next.plan = planRes.planType;
        setActiveProfileId(null);
        setDraft(next);
        setSkillInputs({ ...emptySkillInputs });
      }
    } catch (e) {
      setError(toError(e));
      setUser(null);
      setPlans(null);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [activeProfileId, loadProfile]);

  useEffect(() => {
    const existing = localStorage.getItem(SESSION_KEY) ?? "";
    if (!existing) {
      setLoading(false);
      return;
    }
    setToken(existing);
    void bootstrap(existing);
  }, [bootstrap]);

  async function onSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);
    setError("");
    try {
      const response = await signIn(authEmail, authPassword);
      localStorage.setItem(SESSION_KEY, response.token);
      setToken(response.token);
      await bootstrap(response.token);
    } catch (e) {
      setError(toError(e));
    } finally {
      setAuthLoading(false);
    }
  }

  async function onReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);
    setError("");
    try {
      await resetPassword(authEmail, resetValue);
      setMessage("Password reset. Sign in with the new password.");
      setAuthPassword(resetValue);
      setResetValue("");
    } catch (e) {
      setError(toError(e));
    } finally {
      setAuthLoading(false);
    }
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    setToken("");
    setUser(null);
    setPlans(null);
    setProfiles([]);
    setActiveProfileId(null);
    setDraft(createDefaultDraft());
    setSkillInputs({ ...emptySkillInputs });
  }

  function onResumePick(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf" || file.size > MAX_RESUME_SIZE_BYTES) {
      setError("Resume must be a PDF under 5MB.");
      return;
    }
    setError("");
    setPendingResumeFile(file);
    setResumeRemoved(false);
    setDraft((prev) => ({
      ...prev,
      resumeFileName: file.name,
      resumeFileSizeKb: Math.round(file.size / 1024),
      resumeUpdatedAt: new Date().toISOString().slice(0, 10),
    }));
  }

  function updateProject(index: number, updater: (project: ProfileDraft["projects"][number]) => ProfileDraft["projects"][number]) {
    setDraft((prev) => ({
      ...prev,
      projects: prev.projects.map((project, projectIndex) =>
        projectIndex === index ? updater(project) : project,
      ),
    }));
  }

  function updateCategorySkills(category: SkillCategory, values: string[]) {
    const nextValue = values.join(", ");
    setDraft((prev) => {
      if (category === "languages") {
        return { ...prev, skillsLanguagesInput: nextValue };
      }
      if (category === "frameworks") {
        return { ...prev, skillsFrameworksInput: nextValue };
      }
      if (category === "tools") {
        return { ...prev, skillsToolsInput: nextValue };
      }
      return { ...prev, skillsOtherInput: nextValue };
    });
  }

  function addSkill(category: SkillCategory, rawValue: string) {
    const skill = rawValue.trim();
    if (!skill) return;
    const next = dedupeSkills([...skillsByCategory[category], skill]);
    updateCategorySkills(category, next);
    setSkillInputs((prev) => ({ ...prev, [category]: "" }));
  }

  function removeSkill(category: SkillCategory, skillToRemove: string) {
    const next = skillsByCategory[category].filter(
      (skill) => skill.toLowerCase() !== skillToRemove.toLowerCase(),
    );
    updateCategorySkills(category, next);
  }

  function onSkillInputKeyDown(category: SkillCategory, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addSkill(category, skillInputs[category]);
  }

  async function save() {
    if (!token) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        slug: slugifyName(draft.slug),
        name: draft.fullName.trim(),
        headline: draft.headline.trim(),
        university: draft.university.trim(),
        gradYear: draft.gradYear.trim(),
        internshipStatus: draft.internshipStatus,
        accentColor: draft.accentColor,
        templateId: draft.templateId,
        resumeBlockType: draft.resumeBlockType,
        contactEmail: draft.contactEmail.trim(),
        emailVisible: draft.emailVisible,
        socials: {
          linkedin: { url: draft.linkedinUrl.trim(), visible: draft.linkedinVisible },
          github: { url: draft.githubUrl.trim(), visible: draft.githubVisible },
          twitter: { url: draft.twitterUrl.trim(), visible: draft.twitterVisible },
          instagram: { url: draft.instagramUrl.trim(), visible: draft.instagramVisible },
        },
      };
      if (!payload.slug || !payload.name || !payload.headline || !payload.university || !payload.gradYear) {
        throw new Error("Complete required profile fields.");
      }

      let profileId = activeProfileId;
      if (!profileId) {
        const created = await createProfileApi(token, payload);
        profileId = created.profile.id;
      }
      await updateProfileApi(token, profileId, payload);

      if (pendingResumeFile) {
        await upsertResumeApi(token, profileId, {
          fileName: pendingResumeFile.name,
          fileSizeKb: Math.round(pendingResumeFile.size / 1024),
        });
        setPendingResumeFile(null);
      } else if (resumeRemoved) {
        await deleteResumeApi(token, profileId);
        setResumeRemoved(false);
      }

      await setSkillsApi(token, profileId, {
        languages: skillsByCategory.languages,
        frameworks: skillsByCategory.frameworks,
        tools: skillsByCategory.tools,
        other: skillsByCategory.other,
      });
      const existing = (await listProjectsApi(token, profileId)).projects;
      const existingMap = new Map(existing.map((p) => [p.id, p]));
      const keepIds: string[] = [];

      for (const project of draft.projects.filter((p) => p.title.trim() && p.summary.trim())) {
        const projectPayload = {
          title: project.title.trim(),
          summary: project.summary.trim(),
          highlights: project.highlights.map((h) => h.trim()).filter(Boolean),
          githubUrl: project.githubUrl.trim(),
          demoUrl: project.demoUrl.trim(),
          techStack: project.techStack.split(",").map((t) => t.trim()).filter(Boolean),
        };
        if (existingMap.has(project.id)) {
          const updated = await updateProjectApi(token, profileId, project.id, projectPayload);
          keepIds.push(updated.project.id);
        } else {
          const created = await createProjectApi(token, profileId, projectPayload);
          keepIds.push(created.project.id);
        }
      }

      for (const project of existing) {
        if (!keepIds.includes(project.id)) {
          await deleteProjectApi(token, profileId, project.id);
        }
      }
      if (keepIds.length > 0) {
        await reorderProjectsApi(token, profileId, keepIds);
      }

      await setPublishedApi(token, profileId, draft.published);
      await bootstrap(token, profileId);
      setMessage("Saved and synced through API routes.");
    } catch (e) {
      setError(toError(e));
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    if (!token) return;
    const nextPublished = !draft.published;

    if (!activeProfileId) {
      setDraft((prev) => ({ ...prev, published: nextPublished }));
      setMessage("Publication status will apply after you save this new profile.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      await setPublishedApi(token, activeProfileId, nextPublished);
      await bootstrap(token, activeProfileId);
      setMessage(nextPublished ? "Profile published." : "Profile unpublished.");
    } catch (e) {
      setError(toError(e));
    } finally {
      setSaving(false);
    }
  }

  async function simulateUpgrade() {
    if (!token || !user) return;
    setSaving(true);
    setError("");
    try {
      await createCheckoutSessionApi(token, checkoutPlan);
      await processBillingWebhookApi({ event: "payment_succeeded", userId: user.id });
      await bootstrap(token, activeProfileId ?? undefined);
      setMessage("Plan upgraded via billing routes.");
    } catch (e) {
      setError(toError(e));
    } finally {
      setSaving(false);
    }
  }

  async function deleteActiveProfile() {
    if (!token || !activeProfileId) return;
    setSaving(true);
    setError("");
    try {
      await deleteProfileApi(token, activeProfileId);
      await bootstrap(token);
      setMessage("Profile deleted.");
    } catch (e) {
      setError(toError(e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#f2eee3] p-8 text-[#161616]">
        <div className="mx-auto max-w-4xl border border-black/15 bg-white p-6">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="min-h-dvh bg-[linear-gradient(160deg,#f6f5ee_0%,#ebf1ec_100%)] p-8 text-[#161616]">
        <div className="mx-auto grid max-w-4xl gap-4 border border-black/15 bg-white p-6 md:grid-cols-2">
          <form onSubmit={onSignIn} className="space-y-4 border border-black/10 bg-[#f7f5ee] p-5">
            <h1 className="text-xl font-semibold">Sign in to your dashboard</h1>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Email</span>
              <input
                className="w-full border border-black/20 px-3 py-2"
                placeholder="you@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Password</span>
              <input
                type="password"
                className="w-full border border-black/20 px-3 py-2"
                placeholder="Your password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
            </label>
            <button disabled={authLoading} className="bg-[#f04939] px-4 py-2 text-sm font-semibold text-white">
              Sign in
            </button>
          </form>
          <form onSubmit={onReset} className="space-y-4 border border-black/10 bg-[#f7f5ee] p-5">
            <h2 className="text-lg font-semibold">Reset password</h2>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">New password</span>
              <input
                type="password"
                placeholder="Set a new password"
                className="w-full border border-black/20 px-3 py-2"
                value={resetValue}
                onChange={(e) => setResetValue(e.target.value)}
              />
            </label>
            <button disabled={authLoading} className="border border-black/20 px-4 py-2 text-sm font-medium">
              Reset password
            </button>
            <Link href="/sign-up" className="block text-sm underline">
              Need an account? Sign up
            </Link>
          </form>
        </div>
        {error && <p className="mx-auto mt-3 max-w-4xl text-sm text-[#8a0b24]">{error}</p>}
        {message && <p className="mx-auto mt-3 max-w-4xl text-sm">{message}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[linear-gradient(165deg,#f6f5ee_0%,#e9f0ea_100%)] p-4 text-[#161616] md:p-8">
      <main className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-4">
          <header className="space-y-4 border border-black/15 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-black/60">Portfolio Builder</p>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-sm text-black/70">Edit your profile, then publish when ready.</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${draft.published ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>
                {draft.published ? "Live" : "Draft"}
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Choose profile</span>
                <select
                  value={activeProfileId ?? ""}
                  onChange={(e) => {
                    const id = e.target.value;
                    if (!id || !plans) {
                      const next = createDefaultDraft();
                      next.plan = plans?.planType ?? "free";
                      next.slug = slugifyName(user.email.split("@")[0] ?? "");
                      setActiveProfileId(null);
                      setDraft(next);
                      setPendingResumeFile(null);
                      setResumeRemoved(false);
                      setSkillInputs({ ...emptySkillInputs });
                      return;
                    }
                    void loadProfile(token, id, plans.planType);
                  }}
                  className="w-full border border-black/20 px-3 py-2"
                >
                  <option value="">Create new profile</option>
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name} ({profile.slug})
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-wrap items-end gap-2">
                <button onClick={save} disabled={saving} className="bg-[#f04939] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button onClick={() => void togglePublish()} disabled={saving} className="border border-black/20 px-4 py-2 text-sm font-medium">
                  {draft.published ? "Unpublish" : "Publish"}
                </button>
                {activeProfileId && (
                  <button onClick={deleteActiveProfile} disabled={saving} className="border border-[#8a0b24]/30 px-4 py-2 text-sm text-[#8a0b24]">
                    Delete
                  </button>
                )}
                <button
                  onClick={() => {
                    const next = createDefaultDraft();
                    next.plan = plans?.planType ?? "free";
                    next.slug = slugifyName(user.email.split("@")[0] ?? "");
                    setActiveProfileId(null);
                    setDraft(next);
                    setPendingResumeFile(null);
                    setResumeRemoved(false);
                    setSkillInputs({ ...emptySkillInputs });
                  }}
                  className="border border-black/20 px-4 py-2 text-sm"
                >
                  New draft
                </button>
              </div>
            </div>

            {error && <p className="rounded border border-[#8a0b24]/30 bg-[#fff2f2] px-3 py-2 text-sm text-[#8a0b24]">{error}</p>}
            {message && <p className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{message}</p>}
          </header>

          <article className="space-y-3 border border-black/15 bg-white p-5">
            <h2 className="text-lg font-semibold">1. Basic information</h2>
            <p className="text-sm text-black/70">Start with what recruiters need first.</p>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Full name</span>
                <input className="w-full border border-black/20 px-3 py-2" placeholder="Ava Chen" value={draft.fullName} onChange={(e) => setDraft((p) => ({ ...p, fullName: e.target.value }))} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Headline</span>
                <input className="w-full border border-black/20 px-3 py-2" placeholder="Computer Science Student building reliable apps" value={draft.headline} onChange={(e) => setDraft((p) => ({ ...p, headline: e.target.value }))} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">University</span>
                <input className="w-full border border-black/20 px-3 py-2" placeholder="University name" value={draft.university} onChange={(e) => setDraft((p) => ({ ...p, university: e.target.value }))} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Graduation year</span>
                <input className="w-full border border-black/20 px-3 py-2" placeholder="2027" value={draft.gradYear} onChange={(e) => setDraft((p) => ({ ...p, gradYear: e.target.value }))} />
              </label>
              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-medium">Public link name</span>
                <input
                  className="w-full border border-black/20 px-3 py-2"
                  placeholder="your-name"
                  value={draft.slug}
                  onChange={(e) => setDraft((p) => ({ ...p, slug: slugifyName(e.target.value) }))}
                />
                <p className="text-xs text-black/60">Your page URL will be: {publicPath}</p>
              </label>
              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-medium">Current status</span>
                <select className="w-full border border-black/20 px-3 py-2" value={draft.internshipStatus} onChange={(e) => setDraft((p) => ({ ...p, internshipStatus: toStatus(e.target.value) }))}>
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <div className="md:col-span-2">
                <TemplatePicker
                  currentTemplateId={draft.templateId}
                  onSelect={(templateId) => setDraft((prev) => ({ ...prev, templateId }))}
                />
              </div>
            </div>
          </article>

          <article className="space-y-3 border border-black/15 bg-white p-5">
            <h2 className="text-lg font-semibold">2. Resume and skills</h2>
            <p className="text-sm text-black/70">Upload your resume and organize skills by section.</p>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Resume (PDF, max 5MB)</span>
              <input type="file" accept="application/pdf" onChange={(e) => onResumePick(e.target.files?.[0])} />
            </label>
            {draft.resumeFileName && (
              <div className="flex flex-wrap items-center gap-2 rounded border border-black/15 bg-[#faf9f4] p-3 text-sm">
                <span>{draft.resumeFileName} ({draft.resumeFileSizeKb} KB)</span>
                <button
                  onClick={() => {
                    setResumeRemoved(true);
                    setPendingResumeFile(null);
                    setDraft((p) => ({ ...p, resumeFileName: "", resumeFileSizeKb: 0, published: false }));
                  }}
                  className="border border-black/20 px-2 py-1 text-xs"
                >
                  Remove resume
                </button>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">Resume block type on public page</p>
              <div className="grid gap-2 md:grid-cols-2">
                <label className="flex items-start gap-2 border border-black/15 bg-[#fcfcfa] p-3 text-sm">
                  <input
                    type="radio"
                    name="resume-block-type"
                    checked={draft.resumeBlockType === "without_preview"}
                    onChange={() =>
                      setDraft((prev) => ({ ...prev, resumeBlockType: "without_preview" }))
                    }
                  />
                  <span>
                    <span className="block font-medium">Without preview</span>
                    <span className="text-black/65">Simple resume card with download button.</span>
                  </span>
                </label>
                <label className="flex items-start gap-2 border border-black/15 bg-[#fcfcfa] p-3 text-sm">
                  <input
                    type="radio"
                    name="resume-block-type"
                    checked={draft.resumeBlockType === "with_preview"}
                    onChange={() =>
                      setDraft((prev) => ({ ...prev, resumeBlockType: "with_preview" }))
                    }
                  />
                  <span>
                    <span className="block font-medium">With preview</span>
                    <span className="text-black/65">Embedded preview plus download button.</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Skills by section</p>
              <div className="grid gap-3 md:grid-cols-2">
                {skillSections.map((section) => (
                  <div key={section.category} className="space-y-2 border border-black/10 bg-[#fcfcfa] p-3">
                    <p className="text-sm font-medium">{section.title}</p>
                    <div className="flex gap-2">
                      <input
                        className="w-full border border-black/20 px-3 py-2 text-sm"
                        placeholder={section.placeholder}
                        value={skillInputs[section.category]}
                        onChange={(e) =>
                          setSkillInputs((prev) => ({
                            ...prev,
                            [section.category]: e.target.value,
                          }))
                        }
                        onKeyDown={(event) => onSkillInputKeyDown(section.category, event)}
                      />
                      <button
                        onClick={() => addSkill(section.category, skillInputs[section.category])}
                        className="border border-black/20 px-3 py-2 text-sm"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillsByCategory[section.category].length === 0 && (
                        <p className="text-sm text-black/60">No entries yet.</p>
                      )}
                      {skillsByCategory[section.category].map((skill) => (
                        <button
                          key={`${section.category}-${skill}`}
                          onClick={() => removeSkill(section.category, skill)}
                          className="rounded-full border border-black/15 bg-[#f6f5ee] px-3 py-1 text-sm"
                        >
                          {skill} x
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {section.suggestions
                        .filter(
                          (skill) =>
                            !skillsByCategory[section.category].some(
                              (existing) => existing.toLowerCase() === skill.toLowerCase(),
                            ),
                        )
                        .map((skill) => (
                          <button
                            key={`${section.category}-suggest-${skill}`}
                            onClick={() => addSkill(section.category, skill)}
                            className="rounded-full border border-black/15 px-3 py-1 text-xs text-black/70"
                          >
                            + {skill}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
          <article className="space-y-3 border border-black/15 bg-white p-5">
            <h2 className="text-lg font-semibold">3. Contact and social links</h2>
            <p className="text-sm text-black/70">
              Choose what visitors can see. You can hide any contact method.
            </p>
            <div className="space-y-3">
              <label className="block space-y-1 text-sm">
                <span className="font-medium">Public email (optional)</span>
                <input
                  className="w-full border border-black/20 px-3 py-2"
                  placeholder="Use a different contact email"
                  value={draft.contactEmail}
                  onChange={(e) => setDraft((prev) => ({ ...prev, contactEmail: e.target.value }))}
                />
                <p className="text-xs text-black/60">
                  Leave blank to use your account email when visible.
                </p>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.emailVisible}
                  onChange={(e) => setDraft((prev) => ({ ...prev, emailVisible: e.target.checked }))}
                />
                Show email on public page
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2 border border-black/10 bg-[#fcfcfa] p-3">
                <p className="text-sm font-medium">LinkedIn</p>
                <input
                  className="w-full border border-black/20 px-3 py-2 text-sm"
                  placeholder="https://linkedin.com/in/your-handle"
                  value={draft.linkedinUrl}
                  onChange={(e) => setDraft((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                />
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.linkedinVisible}
                    onChange={(e) => setDraft((prev) => ({ ...prev, linkedinVisible: e.target.checked }))}
                  />
                  Visible
                </label>
              </div>
              <div className="space-y-2 border border-black/10 bg-[#fcfcfa] p-3">
                <p className="text-sm font-medium">GitHub</p>
                <input
                  className="w-full border border-black/20 px-3 py-2 text-sm"
                  placeholder="https://github.com/your-handle"
                  value={draft.githubUrl}
                  onChange={(e) => setDraft((prev) => ({ ...prev, githubUrl: e.target.value }))}
                />
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.githubVisible}
                    onChange={(e) => setDraft((prev) => ({ ...prev, githubVisible: e.target.checked }))}
                  />
                  Visible
                </label>
              </div>
              <div className="space-y-2 border border-black/10 bg-[#fcfcfa] p-3">
                <p className="text-sm font-medium">Twitter / X</p>
                <input
                  className="w-full border border-black/20 px-3 py-2 text-sm"
                  placeholder="https://x.com/your-handle"
                  value={draft.twitterUrl}
                  onChange={(e) => setDraft((prev) => ({ ...prev, twitterUrl: e.target.value }))}
                />
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.twitterVisible}
                    onChange={(e) => setDraft((prev) => ({ ...prev, twitterVisible: e.target.checked }))}
                  />
                  Visible
                </label>
              </div>
              <div className="space-y-2 border border-black/10 bg-[#fcfcfa] p-3">
                <p className="text-sm font-medium">Instagram</p>
                <input
                  className="w-full border border-black/20 px-3 py-2 text-sm"
                  placeholder="https://instagram.com/your-handle"
                  value={draft.instagramUrl}
                  onChange={(e) => setDraft((prev) => ({ ...prev, instagramUrl: e.target.value }))}
                />
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.instagramVisible}
                    onChange={(e) => setDraft((prev) => ({ ...prev, instagramVisible: e.target.checked }))}
                  />
                  Visible
                </label>
              </div>
            </div>
          </article>

          <article className="space-y-3 border border-black/15 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">4. Projects</h2>
                <p className="text-sm text-black/70">Add projects with outcomes and links.</p>
              </div>
              <button
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    projects:
                      prev.projects.length >= maxProjects
                        ? prev.projects
                        : [...prev.projects, createProjectDraft(`project-${prev.projects.length + 1}`)],
                  }))
                }
                className="border border-black/20 px-3 py-2 text-sm"
              >
                Add project
              </button>
            </div>
            <p className="text-xs text-black/60">
              Plan: {plans?.planType} | Max projects: {maxProjects}
            </p>
            <div className="space-y-3">
              {draft.projects.map((project, idx) => (
                <article key={project.id} className="space-y-3 border border-black/10 bg-[#fcfcfa] p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Project {idx + 1}</h3>
                    <button onClick={() => setDraft((prev) => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }))} className="border border-black/20 px-2 py-1 text-xs">
                      Remove
                    </button>
                  </div>
                  <label className="block space-y-1 text-sm">
                    <span className="font-medium">Project title</span>
                    <input className="w-full border border-black/20 px-3 py-2" placeholder="FocusFlow" value={project.title} onChange={(e) => updateProject(idx, (current) => ({ ...current, title: e.target.value }))} />
                  </label>
                  <label className="block space-y-1 text-sm">
                    <span className="font-medium">Short summary</span>
                    <input className="w-full border border-black/20 px-3 py-2" placeholder="What this project does and who it helps" value={project.summary} onChange={(e) => updateProject(idx, (current) => ({ ...current, summary: e.target.value }))} />
                  </label>
                  <div className="grid gap-2 md:grid-cols-3">
                    <label className="space-y-1 text-sm">
                      <span className="font-medium">Problem</span>
                      <input className="w-full border border-black/20 px-3 py-2" placeholder="What issue did you solve?" value={project.highlights[0] ?? ""} onChange={(e) => updateProject(idx, (current) => ({ ...current, highlights: [e.target.value, current.highlights[1] ?? "", current.highlights[2] ?? ""] }))} />
                    </label>
                    <label className="space-y-1 text-sm">
                      <span className="font-medium">Solution</span>
                      <input className="w-full border border-black/20 px-3 py-2" placeholder="What did you build?" value={project.highlights[1] ?? ""} onChange={(e) => updateProject(idx, (current) => ({ ...current, highlights: [current.highlights[0] ?? "", e.target.value, current.highlights[2] ?? ""] }))} />
                    </label>
                    <label className="space-y-1 text-sm">
                      <span className="font-medium">Impact</span>
                      <input className="w-full border border-black/20 px-3 py-2" placeholder="Measurable outcome" value={project.highlights[2] ?? ""} onChange={(e) => updateProject(idx, (current) => ({ ...current, highlights: [current.highlights[0] ?? "", current.highlights[1] ?? "", e.target.value] }))} />
                    </label>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <label className="space-y-1 text-sm">
                      <span className="font-medium">GitHub URL (optional)</span>
                      <input className="w-full border border-black/20 px-3 py-2" placeholder="https://github.com/you/repo" value={project.githubUrl} onChange={(e) => updateProject(idx, (current) => ({ ...current, githubUrl: e.target.value }))} />
                    </label>
                    <label className="space-y-1 text-sm">
                      <span className="font-medium">Demo URL (optional)</span>
                      <input className="w-full border border-black/20 px-3 py-2" placeholder="https://your-demo.app" value={project.demoUrl} onChange={(e) => updateProject(idx, (current) => ({ ...current, demoUrl: e.target.value }))} />
                    </label>
                  </div>
                  <label className="block space-y-1 text-sm">
                    <span className="font-medium">Tools used</span>
                    <input className="w-full border border-black/20 px-3 py-2" placeholder="React, TypeScript, Postgres" value={project.techStack} onChange={(e) => updateProject(idx, (current) => ({ ...current, techStack: e.target.value }))} />
                  </label>
                </article>
              ))}
            </div>
          </article>
        </section>

        <aside className="space-y-4">
          <section className="border border-black/15 bg-white p-5">
            <h2 className="text-lg font-semibold">Publishing checklist</h2>
            <p className="mt-1 text-sm text-black/70">Finish these steps before publishing.</p>
            <ul className="mt-3 space-y-2 text-sm">
              {completionItems.map((item) => (
                <li key={item.label} className="flex items-center justify-between rounded border border-black/10 bg-[#faf9f4] px-3 py-2">
                  <span>{item.label}</span>
                  <span className={`text-xs font-semibold ${item.done ? "text-emerald-700" : "text-amber-700"}`}>
                    {item.done ? "Done" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3 border border-black/15 bg-white p-5">
            <h2 className="text-lg font-semibold">Billing</h2>
            <p className="text-sm text-black/70">
              Current plan: <span className="font-medium">{plans?.planType}</span>
            </p>
            <div className="flex gap-2">
              <button onClick={() => setCheckoutPlan("pro_monthly")} className={`border px-2 py-1 text-xs ${checkoutPlan === "pro_monthly" ? "border-black bg-black text-white" : "border-black/20"}`}>
                Pro monthly
              </button>
              <button onClick={() => setCheckoutPlan("pro_annual")} className={`border px-2 py-1 text-xs ${checkoutPlan === "pro_annual" ? "border-black bg-black text-white" : "border-black/20"}`}>
                Pro annual
              </button>
            </div>
            <button onClick={simulateUpgrade} disabled={saving} className="border border-black/20 px-3 py-2 text-sm">
              Simulate upgrade
            </button>
          </section>

          <section className="space-y-3 border border-black/15 bg-white p-5">
            <h2 className="text-lg font-semibold">Account</h2>
            <p className="text-sm text-black/70">{user.email}</p>
            <button onClick={signOut} className="border border-black/20 px-3 py-2 text-sm">
              Sign out
            </button>
          </section>
        </aside>
      </main>
    </div>
  );
}
