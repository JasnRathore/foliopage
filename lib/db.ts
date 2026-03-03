import { turso } from "./turso";
import type {
  PlanType,
  CheckoutPlan,
  ResumeBlockType,
  DbUser,
  DbSession,
  DbResume,
  DbProfileSocials,
  DbProfileSkills,
  DbProfile,
  DbProject,
  DbPublicProfile,
} from "./db-types";
import { ensureSchema } from "./schema";
import { fromJson, nowIso, toJson } from "./utils";

// SQL-backed DB implementation using Turso (@libsql/client).
// On startup it creates tables (if needed) and performs a one-time migration
// from the legacy serialized `kv` store (key "store") into structured tables.

async function runMigrationIfNeeded() {
  try {
    // If migration flag present, skip
    const flag = await turso.execute(`SELECT v FROM kv WHERE k = ?`, ["migrated_v1"]);
    const rows = (flag as any)?.rows ?? (flag as any)?.results ?? [];
    if (rows.length > 0 && (rows[0].v ?? rows[0]["v"])) {
      return;
    }

    // Check if any users exist already
    const usersRes = await turso.execute(`SELECT COUNT(*) as count FROM users`);
    const usersRows = (usersRes as any)?.rows ?? (usersRes as any)?.results ?? [];
    const userCount = usersRows[0]?.count ?? usersRows[0]?.[0] ?? 0;
    if (Number(userCount) > 0) {
      // Already migrated or have live data
      await turso.execute(`INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)`, ["migrated_v1", "1"]);
      return;
    }

    // Try to load legacy serialized store under key "store"
    const res = await turso.execute(`SELECT v FROM kv WHERE k = ?`, ["store"]);
    const legacyRows = (res as any)?.rows ?? (res as any)?.results ?? [];
    if (!legacyRows || legacyRows.length === 0) {
      // nothing to migrate
      await turso.execute(`INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)`, ["migrated_v1", "1"]);
      return;
    }

    const raw = legacyRows[0].v ?? legacyRows[0]["v"];
    if (!raw) {
      await turso.execute(`INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)`, ["migrated_v1", "1"]);
      return;
    }

    const parsed = JSON.parse(raw) as any;
    // usersById: [id, user]
    for (const [id, user] of parsed.usersById ?? []) {
      await turso.execute(
        `INSERT OR REPLACE INTO users (id, email, password, planType, createdAt) VALUES (?, ?, ?, ?, ?)`,
        [id, user.email, user.password, user.planType, user.createdAt],
      );
    }

    for (const [token, session] of parsed.sessionsByToken ?? []) {
      await turso.execute(
        `INSERT OR REPLACE INTO sessions (token, userId, createdAt) VALUES (?, ?, ?)`,
        [token, session.userId, session.createdAt],
      );
    }

    for (const [id, profile] of parsed.profilesById ?? []) {
      await turso.execute(
        `INSERT OR REPLACE INTO profiles (id, userId, slug, name, headline, summary, university, gradYear, internshipStatus, accentColor, templateId, published, createdAt, updatedAt, skills, resume, profileImageUrl, profileImageVisible, bgImageUrl, bgImageOverlay, contactEmail, emailVisible, resumeBlockType, socials) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          profile.userId,
          profile.slug,
          profile.name,
          profile.headline,
          profile.summary,
          profile.university,
          profile.gradYear,
          profile.internshipStatus,
          profile.accentColor,
          profile.templateId ?? null,
          profile.published ? 1 : 0,
          profile.createdAt,
          profile.updatedAt,
          toJson(profile.skills),
          toJson(profile.resume),
          profile.profileImageUrl ?? null,
          profile.profileImageVisible ? 1 : 0,
          profile.bgImageUrl ?? null,
          profile.bgImageOverlay ?? 50,
          profile.contactEmail ?? null,
          profile.emailVisible ? 1 : 0,
          profile.resumeBlockType ?? null,
          toJson(profile.socials ?? null),
        ],
      );
    }

    for (const [id, project] of parsed.projectsById ?? []) {
      await turso.execute(
        `INSERT OR REPLACE INTO projects (id, profileId, title, summary, highlights, githubUrl, demoUrl, techStack, orderIndex, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          project.profileId,
          project.title,
          project.summary,
          toJson(project.highlights),
          project.githubUrl ?? null,
          project.demoUrl ?? null,
          toJson(project.techStack),
          project.orderIndex ?? 0,
          project.createdAt,
          project.updatedAt,
        ],
      );
    }

    // mark migrated
    await turso.execute(`INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)`, ["migrated_v1", "1"]);
  } catch (err) {
    // ignore migration errors; leave kv flag absent so future attempts can retry
    // console.warn('migration error', err);
  }
}

async function init() {
  await ensureSchema(turso);
  await runMigrationIfNeeded();
}

// Initialize in background (best-effort)
void init();

// --- Helper SQL wrappers ---
async function queryOne<T = any>(sql: string, params: unknown[] = []): Promise<T | null> {
  const res = await turso.execute(sql, params as any);
  const rows = (res as any)?.rows ?? (res as any)?.results ?? [];
  if (!rows || rows.length === 0) return null;
  return rows[0] as T;
}

async function queryAll<T = any>(sql: string, params: unknown[] = []): Promise<T[]> {
  const res = await turso.execute(sql, params as any);
  const rows = (res as any)?.rows ?? (res as any)?.results ?? [];
  return rows as T[];
}

// --- Plan limits ---
export function getPlanLimits(planType: PlanType): { maxProjects: number } {
  if (planType === "free") return { maxProjects: 3 };
  return { maxProjects: 1000 };
}

// --- Auth / users ---
export async function signUp(email: string, password: string): Promise<DbUser> {
  const id = `user_${Math.random().toString(36).slice(2, 9)}`;
  const createdAt = nowIso();
  await turso.execute(`INSERT INTO users (id, email, password, planType, createdAt) VALUES (?, ?, ?, ?, ?)`, [
    id,
    email.trim().toLowerCase(),
    password,
    "free",
    createdAt,
  ]);
  return { id, email: email.trim().toLowerCase(), password, planType: "free", createdAt };
}

export async function signIn(email: string, password: string): Promise<DbUser> {
  const row = await queryOne<any>(`SELECT * FROM users WHERE lower(email) = lower(?)`, [email.trim()]);
  if (!row || row.password !== password) {
    throw new Error("Invalid email or password.");
  }
  return { id: row.id, email: row.email, password: row.password, planType: row.planType, createdAt: row.createdAt };
}

export async function resetPassword(email: string, nextPassword: string): Promise<DbUser> {
  const user = await queryOne<any>(`SELECT * FROM users WHERE lower(email) = lower(?)`, [email.trim()]);
  if (!user) throw new Error("User not found.");
  await turso.execute(`UPDATE users SET password = ? WHERE id = ?`, [nextPassword, user.id]);
  return { id: user.id, email: user.email, password: nextPassword, planType: user.planType, createdAt: user.createdAt };
}

export async function createSession(userId: string): Promise<DbSession> {
  const token = `session_${Math.random().toString(36).slice(2, 12)}`;
  const createdAt = nowIso();
  await turso.execute(`INSERT INTO sessions (token, userId, createdAt) VALUES (?, ?, ?)`, [token, userId, createdAt]);
  return { token, userId, createdAt };
}

export async function getUserFromToken(token: string): Promise<DbUser | null> {
  const session = await queryOne<any>(`SELECT * FROM sessions WHERE token = ?`, [token]);
  if (!session) return null;
  const user = await queryOne<any>(`SELECT * FROM users WHERE id = ?`, [session.userId]);
  if (!user) return null;
  return { id: user.id, email: user.email, password: user.password, planType: user.planType, createdAt: user.createdAt };
}

export async function upgradePlan(userId: string, planType: PlanType): Promise<DbUser> {
  const user = await queryOne<any>(`SELECT * FROM users WHERE id = ?`, [userId]);
  if (!user) throw new Error("User not found.");
  await turso.execute(`UPDATE users SET planType = ? WHERE id = ?`, [planType, userId]);
  return { id: user.id, email: user.email, password: user.password, planType, createdAt: user.createdAt };
}

export async function createCheckoutSession(userId: string, plan: CheckoutPlan): Promise<{ checkoutUrl: string; plan: CheckoutPlan }> {
  const user = await queryOne<any>(`SELECT * FROM users WHERE id = ?`, [userId]);
  if (!user) throw new Error("User not found.");
  return { checkoutUrl: `https://checkout.foliopage.local/session/${Math.random().toString(36).slice(2, 9)}?plan=${plan}`, plan };
}

// --- Profiles & projects ---
export async function listProfilesForUser(userId: string): Promise<DbProfile[]> {
  const rows = await queryAll<any>(`SELECT * FROM profiles WHERE userId = ? ORDER BY createdAt DESC`, [userId]);
  return rows.map((r) => toDbProfile(r));
}

function toDbProfile(row: any): DbProfile {
  return {
    id: row.id,
    userId: row.userId,
    slug: row.slug,
    name: row.name,
    headline: row.headline,
    summary: row.summary,
    university: row.university,
    gradYear: row.gradYear,
    internshipStatus: row.internshipStatus,
    accentColor: row.accentColor,
    templateId: row.templateId ?? undefined,
    published: Boolean(row.published),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    skills: fromJson<DbProfileSkills>(row.skills) ?? { languages: [], frameworks: [], tools: [], other: [] },
    resume: fromJson<DbResume>(row.resume) ?? null,
    profileImageUrl: row.profileImageUrl ?? "",
    profileImageVisible: Boolean(row.profileImageVisible),
    bgImageUrl: row.bgImageUrl ?? "",
    bgImageOverlay: row.bgImageOverlay ?? 50,
    contactEmail: row.contactEmail ?? "",
    emailVisible: Boolean(row.emailVisible ?? true),
    resumeBlockType: (row.resumeBlockType as ResumeBlockType) ?? "without_preview",
    socials: fromJson<DbProfileSocials>(row.socials) ?? {
      linkedin: { url: "", visible: false },
      github: { url: "", visible: false },
      twitter: { url: "", visible: false },
      instagram: { url: "", visible: false },
    },
  };
}

export async function createProfile(userId: string, input: any): Promise<DbProfile> {
  // check slug uniqueness
  const existing = await queryOne<any>(`SELECT id FROM profiles WHERE lower(slug) = lower(?)`, [input.slug]);
  if (existing) throw new Error("Slug already in use.");
  const id = `profile_${Math.random().toString(36).slice(2, 9)}`;
  const createdAt = nowIso();
  await turso.execute(`INSERT INTO profiles (id, userId, slug, name, headline, summary, university, gradYear, internshipStatus, accentColor, templateId, published, createdAt, updatedAt, skills, resume, profileImageUrl, profileImageVisible, bgImageUrl, bgImageOverlay, contactEmail, emailVisible, resumeBlockType, socials) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    id,
    userId,
    input.slug,
    input.name,
    input.headline,
    input.summary ?? "",
    input.university ?? "",
    input.gradYear ?? "",
    input.internshipStatus ?? "",
    input.accentColor,
    input.templateId ?? null,
    0,
    createdAt,
    createdAt,
    toJson({ languages: [], frameworks: [], tools: [], other: [] }),
    null,
    input.profileImageUrl ?? null,
    input.profileImageVisible ? 1 : 0,
    input.bgImageUrl ?? null,
    input.bgImageOverlay ?? 50,
    "",
    1,
    input.resumeBlockType ?? null,
    toJson(null),
  ]);
  const row = await queryOne<any>(`SELECT * FROM profiles WHERE id = ?`, [id]);
  return toDbProfile(row);
}

export async function getProfileForUser(profileId: string, userId: string): Promise<DbProfile> {
  const row = await queryOne<any>(`SELECT * FROM profiles WHERE id = ? AND userId = ?`, [profileId, userId]);
  if (!row) throw new Error("Profile not found.");
  return toDbProfile(row);
}

export async function updateProfile(profileId: string, userId: string, input: any): Promise<DbProfile> {
  const profile = await getProfileForUser(profileId, userId);
  if (input.slug && input.slug !== profile.slug) {
    const exists = await queryOne<any>(`SELECT id FROM profiles WHERE lower(slug) = lower(?) AND id != ?`, [input.slug, profileId]);
    if (exists) throw new Error("Slug already in use.");
  }
  const updatedAt = nowIso();
  // merge fields
  const next = { ...profile, ...input, updatedAt };
  await turso.execute(`UPDATE profiles SET slug = ?, name = ?, headline = ?, summary = ?, university = ?, gradYear = ?, internshipStatus = ?, accentColor = ?, templateId = ?, updatedAt = ?, skills = ?, resume = ?, profileImageUrl = ?, profileImageVisible = ?, bgImageUrl = ?, bgImageOverlay = ?, contactEmail = ?, emailVisible = ?, resumeBlockType = ?, socials = ? WHERE id = ?`, [
    next.slug,
    next.name,
    next.headline,
    next.summary,
    next.university,
    next.gradYear,
    next.internshipStatus,
    next.accentColor,
    next.templateId ?? null,
    next.updatedAt,
    toJson(next.skills),
    toJson(next.resume),
    next.profileImageUrl ?? null,
    next.profileImageVisible ? 1 : 0,
    next.bgImageUrl ?? null,
    next.bgImageOverlay ?? 50,
    next.contactEmail ?? null,
    next.emailVisible ? 1 : 0,
    next.resumeBlockType ?? null,
    toJson(next.socials ?? null),
    profileId,
  ]);
  const row = await queryOne<any>(`SELECT * FROM profiles WHERE id = ?`, [profileId]);
  return toDbProfile(row);
}

export async function deleteProfile(profileId: string, userId: string): Promise<{ deleted: true }> {
  const profile = await getProfileForUser(profileId, userId);
  await turso.execute(`DELETE FROM profiles WHERE id = ?`, [profile.id]);
  await turso.execute(`DELETE FROM projects WHERE profileId = ?`, [profile.id]);
  return { deleted: true };
}

export async function setPublished(profileId: string, userId: string, published: boolean): Promise<DbProfile> {
  const profile = await getProfileForUser(profileId, userId);
  if (published && !profile.resume) throw new Error("Upload a resume before publishing.");
  const updatedAt = nowIso();
  await turso.execute(`UPDATE profiles SET published = ?, updatedAt = ? WHERE id = ?`, [published ? 1 : 0, updatedAt, profileId]);
  const row = await queryOne<any>(`SELECT * FROM profiles WHERE id = ?`, [profileId]);
  return toDbProfile(row);
}

export async function setSkills(profileId: string, userId: string, skills: DbProfileSkills | string[]): Promise<DbProfile> {
  const profile = await getProfileForUser(profileId, userId);
  const skillsJson = Array.isArray(skills) ? toJson({ languages: [], frameworks: [], tools: [], other: skills }) : toJson(skills);
  const updatedAt = nowIso();
  await turso.execute(`UPDATE profiles SET skills = ?, updatedAt = ? WHERE id = ?`, [skillsJson, updatedAt, profileId]);
  const row = await queryOne<any>(`SELECT * FROM profiles WHERE id = ?`, [profileId]);
  return toDbProfile(row);
}

export async function setSkillsFromCsv(profileId: string, userId: string, csv: string): Promise<DbProfile> {
  const parsed = csv.split(",").map((s) => s.trim()).filter(Boolean);
  return setSkills(profileId, userId, parsed);
}

export async function upsertResume(profileId: string, userId: string, input: { fileName: string; fileSizeKb: number; fileUrl?: string }): Promise<DbProfile> {
  const profile = await getProfileForUser(profileId, userId);
  const safeFileName = input.fileName.trim();
  const resume: DbResume = {
    fileName: safeFileName,
    fileSizeKb: input.fileSizeKb,
    fileUrl: input.fileUrl ?? `https://storage.foliopage.local/resumes/${profileId}/${encodeURIComponent(safeFileName)}`,
    updatedAt: nowIso(),
  };
  const updatedAt = nowIso();
  await turso.execute(`UPDATE profiles SET resume = ?, updatedAt = ? WHERE id = ?`, [toJson(resume), updatedAt, profileId]);
  const row = await queryOne<any>(`SELECT * FROM profiles WHERE id = ?`, [profileId]);
  return toDbProfile(row);
}

export async function deleteResume(profileId: string, userId: string): Promise<DbProfile> {
  const profile = await getProfileForUser(profileId, userId);
  const updatedAt = nowIso();
  await turso.execute(`UPDATE profiles SET resume = NULL, published = 0, updatedAt = ? WHERE id = ?`, [updatedAt, profileId]);
  const row = await queryOne<any>(`SELECT * FROM profiles WHERE id = ?`, [profileId]);
  return toDbProfile(row);
}

export async function listProjects(profileId: string, userId: string): Promise<DbProject[]> {
  await getProfileForUser(profileId, userId);
  const rows = await queryAll<any>(`SELECT * FROM projects WHERE profileId = ? ORDER BY orderIndex ASC`, [profileId]);
  return rows.map((r) => ({
    id: r.id,
    profileId: r.profileId,
    title: r.title,
    summary: r.summary,
    highlights: fromJson<string[]>(r.highlights) ?? [],
    githubUrl: r.githubUrl ?? "",
    demoUrl: r.demoUrl ?? "",
    techStack: fromJson<string[]>(r.techStack) ?? [],
    orderIndex: r.orderIndex,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

export async function createProject(profileId: string, userId: string, input: any): Promise<DbProject> {
  const profile = await getProfileForUser(profileId, userId);
  const user = await queryOne<any>(`SELECT * FROM users WHERE id = ?`, [userId]);
  if (!user) throw new Error("User not found.");
  const existingProjects = await listProjects(profileId, userId);
  const { maxProjects } = getPlanLimits(user.planType);
  if (existingProjects.length >= maxProjects) throw new Error(`Project limit reached for ${user.planType} plan.`);
  const id = `project_${Math.random().toString(36).slice(2, 9)}`;
  const createdAt = nowIso();
  const orderIndex = existingProjects.length + 1;
  await turso.execute(`INSERT INTO projects (id, profileId, title, summary, highlights, githubUrl, demoUrl, techStack, orderIndex, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    id,
    profileId,
    (input.title ?? "").trim(),
    (input.summary ?? "").trim(),
    toJson((input.highlights ?? [])),
    input.githubUrl ?? null,
    input.demoUrl ?? null,
    toJson(input.techStack ?? []),
    orderIndex,
    createdAt,
    createdAt,
  ]);
  return (await queryOne<any>(`SELECT * FROM projects WHERE id = ?`, [id])) as DbProject;
}

export async function updateProject(profileId: string, projectId: string, userId: string, input: any): Promise<DbProject> {
  await getProfileForUser(profileId, userId);
  const project = await queryOne<any>(`SELECT * FROM projects WHERE id = ?`, [projectId]);
  if (!project || project.profileId !== profileId) throw new Error("Project not found.");
  const updatedAt = nowIso();
  const highlights = input.highlights ? toJson(input.highlights) : project.highlights;
  const techStack = input.techStack ? toJson(input.techStack) : project.techStack;
  const title = input.title !== undefined ? (input.title ?? "").trim() : project.title;
  const summary = input.summary !== undefined ? (input.summary ?? "").trim() : project.summary;
  const githubUrl = input.githubUrl !== undefined ? input.githubUrl ?? null : project.githubUrl;
  const demoUrl = input.demoUrl !== undefined ? input.demoUrl ?? null : project.demoUrl;
  await turso.execute(`UPDATE projects SET title = ?, summary = ?, highlights = ?, techStack = ?, githubUrl = ?, demoUrl = ?, updatedAt = ? WHERE id = ?`, [title, summary, highlights, techStack, githubUrl, demoUrl, updatedAt, projectId]);
  return (await queryOne<any>(`SELECT * FROM projects WHERE id = ?`, [projectId])) as DbProject;
}

export async function deleteProject(profileId: string, projectId: string, userId: string): Promise<{ deleted: true }> {
  await getProfileForUser(profileId, userId);
  const project = await queryOne<any>(`SELECT * FROM projects WHERE id = ?`, [projectId]);
  if (!project || project.profileId !== profileId) throw new Error("Project not found.");
  await turso.execute(`DELETE FROM projects WHERE id = ?`, [projectId]);
  // resequence
  const projects = await queryAll<any>(`SELECT id FROM projects WHERE profileId = ? ORDER BY orderIndex ASC`, [profileId]);
  let idx = 1;
  for (const p of projects) {
    await turso.execute(`UPDATE projects SET orderIndex = ? WHERE id = ?`, [idx++, p.id]);
  }
  return { deleted: true };
}

export async function reorderProjects(profileId: string, userId: string, orderedProjectIds: string[]): Promise<DbProject[]> {
  await getProfileForUser(profileId, userId);
  const current = await listProjects(profileId, userId);
  if (current.length !== orderedProjectIds.length) throw new Error("Project order payload mismatch.");
  const currentIds = new Set(current.map((p) => p.id));
  for (const id of orderedProjectIds) {
    if (!currentIds.has(id)) throw new Error("Invalid project IDs.");
  }
  for (let i = 0; i < orderedProjectIds.length; i++) {
    await turso.execute(`UPDATE projects SET orderIndex = ? WHERE id = ?`, [i + 1, orderedProjectIds[i]]);
  }
  return await listProjects(profileId, userId);
}

export async function getPublicProfileBySlug(
  slug: string,
  recruiterView: boolean,
): Promise<DbPublicProfile> {
  const row = await queryOne<any>(`SELECT * FROM profiles WHERE lower(slug) = lower(?) AND published = 1`, [slug]);
  if (!row) throw new Error("Published profile not found.");
  const profile = toDbProfile(row);
  const user = await queryOne<any>(`SELECT * FROM users WHERE id = ?`, [profile.userId]);
  if (!user) throw new Error("Profile owner not found.");
  const projects = await listProjects(profile.id, profile.userId);
  const emailValue = (profile.contactEmail?.trim() || user.email) ?? null;
  const visibleSocials = {
    linkedin: profile.socials.linkedin.visible && profile.socials.linkedin.url ? profile.socials.linkedin.url : null,
    github: profile.socials.github.visible && profile.socials.github.url ? profile.socials.github.url : null,
    twitter: profile.socials.twitter.visible && profile.socials.twitter.url ? profile.socials.twitter.url : null,
    instagram: profile.socials.instagram.visible && profile.socials.instagram.url ? profile.socials.instagram.url : null,
  };
  return {
    slug: profile.slug,
    name: profile.name,
    headline: profile.headline,
    summary: profile.summary,
    university: profile.university,
    gradYear: profile.gradYear,
    internshipStatus: profile.internshipStatus,
    accentColor: profile.accentColor,
    templateId: profile.templateId ?? "default",
    skills: recruiterView ? { languages: [], frameworks: [], tools: [], other: [] } : profile.skills,
    resume: profile.resume,
    profileImageUrl: profile.profileImageVisible && profile.profileImageUrl ? profile.profileImageUrl : null,
    bgImageUrl: profile.bgImageUrl || null,
    bgImageOverlay: profile.bgImageOverlay,
    projects,
    contact: {
      email: profile.emailVisible ? emailValue : null,
      socials: visibleSocials,
    },
    resumeBlockType: profile.resumeBlockType,
    publishedAt: profile.updatedAt || profile.createdAt,
  };
}

export async function getUserPlan(userId: string) {
  const user = await queryOne<any>(`SELECT * FROM users WHERE id = ?`, [userId]);
  if (!user) throw new Error("User not found.");
  return { planType: user.planType as PlanType, limits: getPlanLimits(user.planType) };
}

// Re-export shared DB types for API and UI layers.
export type {
  PlanType,
  AccentColor,
  CheckoutPlan,
  ResumeBlockType,
  DbUser,
  DbSession,
  DbResume,
  DbSocialLink,
  DbProfileSocials,
  DbProfileSkills,
  DbProfile,
  DbProject,
  DbPublicProfile,
} from "./db-types";
