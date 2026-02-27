"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  createDefaultDraft,
  createProjectDraft,
  parseSkills,
  slugifyName,
  type ProfileDraft,
} from "@/lib/mvp-flow";
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
  return {
    fullName: profile.name,
    headline: profile.headline,
    university: profile.university,
    gradYear: profile.gradYear,
    internshipStatus: toStatus(profile.internshipStatus),
    accentColor: profile.accentColor,
    slug: profile.slug,
    plan,
    resumeFileName: profile.resume?.fileName ?? "",
    resumeFileSizeKb: profile.resume?.fileSizeKb ?? 0,
    resumeUpdatedAt: profile.resume?.updatedAt.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    skillsInput: profile.skills.join(", "),
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
  const [checkoutPlan, setCheckoutPlan] = useState<CheckoutPlan>("pro_monthly");

  const skills = useMemo(() => parseSkills(draft.skillsInput), [draft.skillsInput]);
  const maxProjects = plans?.limits.maxProjects ?? 3;

  const loadProfile = useCallback(async (sessionToken: string, profileId: string, planType: PlanType) => {
    const [profileRes, projectsRes] = await Promise.all([
      getProfile(sessionToken, profileId),
      listProjectsApi(sessionToken, profileId),
    ]);
    setActiveProfileId(profileId);
    setDraft(toDraft(profileRes.profile, projectsRes.projects, planType));
    setPendingResumeFile(null);
    setResumeRemoved(false);
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
      };
      if (!payload.slug || !payload.name || !payload.headline || !payload.university || !payload.gradYear) {
        throw new Error("Complete required profile fields.");
      }

      let profileId = activeProfileId;
      if (!profileId) {
        const created = await createProfileApi(token, payload);
        profileId = created.profile.id;
      } else {
        await updateProfileApi(token, profileId, payload);
      }

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

      await setSkillsApi(token, profileId, skills);
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
    return <div className="min-h-dvh bg-[#f2eee3] p-8">Loading dashboard...</div>;
  }

  if (!token || !user) {
    return (
      <div className="min-h-dvh bg-[#f2eee3] p-8 text-[#161616]">
        <div className="mx-auto grid max-w-4xl gap-4 border border-black/15 bg-white p-6 md:grid-cols-2">
          <form onSubmit={onSignIn} className="space-y-3 border border-black/15 bg-[#f7f5ee] p-4">
            <h1 className="text-xl font-semibold">Sign in</h1>
            <input className="w-full border border-black/20 px-3 py-2" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
            <input type="password" className="w-full border border-black/20 px-3 py-2" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
            <button disabled={authLoading} className="bg-[#f04939] px-4 py-2 text-sm font-semibold text-white">Sign in</button>
          </form>
          <form onSubmit={onReset} className="space-y-3 border border-black/15 bg-[#f7f5ee] p-4">
            <h2 className="text-lg font-semibold">Reset password</h2>
            <input type="password" placeholder="New password" className="w-full border border-black/20 px-3 py-2" value={resetValue} onChange={(e) => setResetValue(e.target.value)} />
            <button disabled={authLoading} className="border border-black/20 px-4 py-2 text-sm font-medium">Use /api/auth/password-reset</button>
            <Link href="/sign-up" className="block text-sm underline">Need an account? Sign up</Link>
          </form>
        </div>
        {error && <p className="mx-auto mt-3 max-w-4xl text-sm text-[#8a0b24]">{error}</p>}
        {message && <p className="mx-auto mt-3 max-w-4xl text-sm">{message}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#f2eee3] p-6 text-[#161616]">
      <main className="mx-auto max-w-6xl space-y-4">
        <section className="border border-black/15 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={save} disabled={saving} className="bg-[#f04939] px-3 py-2 text-sm font-semibold text-white">Save</button>
            <button onClick={signOut} className="border border-black/20 px-3 py-2 text-sm">Sign out</button>
            <button onClick={() => void togglePublish()} disabled={saving} className="border border-black/20 px-3 py-2 text-sm">
              {draft.published ? "Unpublish now" : "Publish now"}
            </button>
            {activeProfileId && <button onClick={deleteActiveProfile} className="border border-black/20 px-3 py-2 text-sm">Delete profile</button>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <select
              value={activeProfileId ?? ""}
              onChange={(e) => {
                const id = e.target.value;
                if (!id || !plans) return;
                void loadProfile(token, id, plans.planType);
              }}
              className="border border-black/20 px-2 py-1 text-sm"
            >
              <option value="">New profile draft</option>
              {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name} ({profile.slug})</option>)}
            </select>
            <button onClick={() => setDraft(createDefaultDraft())} className="border border-black/20 px-2 py-1 text-sm">Clear draft</button>
          </div>
          {error && <p className="mt-2 text-sm text-[#8a0b24]">{error}</p>}
          {message && <p className="mt-2 text-sm">{message}</p>}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="space-y-3 border border-black/15 bg-white p-4">
            <h2 className="font-semibold">Profile</h2>
            <input className="w-full border border-black/20 px-3 py-2" placeholder="Full name" value={draft.fullName} onChange={(e) => setDraft((p) => ({ ...p, fullName: e.target.value }))} />
            <input className="w-full border border-black/20 px-3 py-2" placeholder="Headline" value={draft.headline} onChange={(e) => setDraft((p) => ({ ...p, headline: e.target.value }))} />
            <input className="w-full border border-black/20 px-3 py-2" placeholder="University" value={draft.university} onChange={(e) => setDraft((p) => ({ ...p, university: e.target.value }))} />
            <input className="w-full border border-black/20 px-3 py-2" placeholder="Grad year" value={draft.gradYear} onChange={(e) => setDraft((p) => ({ ...p, gradYear: e.target.value }))} />
            <input className="w-full border border-black/20 px-3 py-2" placeholder="Slug" value={draft.slug} onChange={(e) => setDraft((p) => ({ ...p, slug: slugifyName(e.target.value) }))} />
            <select className="w-full border border-black/20 px-3 py-2" value={draft.internshipStatus} onChange={(e) => setDraft((p) => ({ ...p, internshipStatus: toStatus(e.target.value) }))}>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
            <p className="text-xs text-black/60">Public URL: domain.com/{draft.slug || "your-name"}</p>
          </article>

          <article className="space-y-3 border border-black/15 bg-white p-4">
            <h2 className="font-semibold">Resume + Skills + Billing</h2>
            <input type="file" accept="application/pdf" onChange={(e) => onResumePick(e.target.files?.[0])} />
            {draft.resumeFileName && (
              <div className="text-sm">
                {draft.resumeFileName} ({draft.resumeFileSizeKb} KB)
                <button onClick={() => { setResumeRemoved(true); setPendingResumeFile(null); setDraft((p) => ({ ...p, resumeFileName: "", resumeFileSizeKb: 0, published: false })); }} className="ml-2 border border-black/20 px-2 py-1 text-xs">Remove</button>
              </div>
            )}
            <input className="w-full border border-black/20 px-3 py-2" placeholder="Skills CSV" value={draft.skillsInput} onChange={(e) => setDraft((p) => ({ ...p, skillsInput: e.target.value }))} />
            <p className="text-xs text-black/60">Plan: {plans?.planType} | Max projects: {maxProjects}</p>
            <div className="flex gap-2">
              <button onClick={() => setCheckoutPlan("pro_monthly")} className="border border-black/20 px-2 py-1 text-xs">Pro monthly</button>
              <button onClick={() => setCheckoutPlan("pro_annual")} className="border border-black/20 px-2 py-1 text-xs">Pro annual</button>
              <button onClick={simulateUpgrade} disabled={saving} className="border border-black/20 px-2 py-1 text-xs">Simulate upgrade</button>
            </div>
          </article>
        </section>

        <section className="space-y-3 border border-black/15 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Projects</h2>
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
              className="border border-black/20 px-2 py-1 text-xs"
            >
              Add
            </button>
          </div>
          {draft.projects.map((project, idx) => (
            <article key={project.id} className="space-y-2 border border-black/10 p-3">
              <input className="w-full border border-black/20 px-3 py-2" placeholder="Title" value={project.title} onChange={(e) => setDraft((prev) => ({ ...prev, projects: prev.projects.map((p, i) => (i === idx ? { ...p, title: e.target.value } : p)) }))} />
              <input className="w-full border border-black/20 px-3 py-2" placeholder="Summary" value={project.summary} onChange={(e) => setDraft((prev) => ({ ...prev, projects: prev.projects.map((p, i) => (i === idx ? { ...p, summary: e.target.value } : p)) }))} />
              <input className="w-full border border-black/20 px-3 py-2" placeholder="Tech stack CSV" value={project.techStack} onChange={(e) => setDraft((prev) => ({ ...prev, projects: prev.projects.map((p, i) => (i === idx ? { ...p, techStack: e.target.value } : p)) }))} />
              <button onClick={() => setDraft((prev) => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }))} className="border border-black/20 px-2 py-1 text-xs">Remove</button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
