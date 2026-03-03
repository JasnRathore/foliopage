import {
  defaultProfileTemplateId,
  listTemplates,
  type ProfileTemplateId,
} from "@/lib/profile-templates";

export type PlanType = "free" | "pro";
export type AccentColor = "blue" | "purple" | "emerald" | "black";
export type CheckoutPlan = "pro_monthly" | "pro_annual";
export type ResumeBlockType = "with_preview" | "without_preview";

export interface DbUser {
  id: string;
  email: string;
  password: string;
  planType: PlanType;
  createdAt: string;
}

export interface DbSession {
  token: string;
  userId: string;
  createdAt: string;
}

export interface DbResume {
  fileName: string;
  fileUrl: string;
  fileSizeKb: number;
  updatedAt: string;
}

export type SocialPlatform = "linkedin" | "github" | "twitter" | "instagram";

export interface DbSocialLink {
  url: string;
  visible: boolean;
}

export interface DbProfileSocials {
  linkedin: DbSocialLink;
  github: DbSocialLink;
  twitter: DbSocialLink;
  instagram: DbSocialLink;
}

export interface DbProfileSkills {
  languages: string[];
  frameworks: string[];
  tools: string[];
  other: string[];
}

export interface DbProfile {
  id: string;
  userId: string;
  slug: string;
  name: string;
  headline: string;
  summary: string;
  university: string;
  gradYear: string;
  internshipStatus: string;
  accentColor: AccentColor;
  templateId: ProfileTemplateId;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  skills: DbProfileSkills;
  resume: DbResume | null;
  profileImageUrl: string;
  profileImageVisible: boolean;
  bgImageUrl: string;
  bgImageOverlay: number;
  contactEmail: string;
  emailVisible: boolean;
  resumeBlockType: ResumeBlockType;
  socials: DbProfileSocials;
}

export interface DbProject {
  id: string;
  profileId: string;
  title: string;
  summary: string;
  highlights: string[];
  githubUrl: string;
  demoUrl: string;
  techStack: string[];
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateProfileInput {
  slug: string;
  name: string;
  headline: string;
  summary: string;
  university: string;
  gradYear: string;
  internshipStatus: string;
  accentColor: AccentColor;
  templateId?: ProfileTemplateId;
  resumeBlockType?: ResumeBlockType;
  profileImageUrl?: string;
  profileImageVisible?: boolean;
  bgImageUrl?: string;
  bgImageOverlay?: number;
}

interface UpdateProfileInput {
  slug?: string;
  name?: string;
  headline?: string;
  summary?: string;
  university?: string;
  gradYear?: string;
  internshipStatus?: string;
  accentColor?: AccentColor;
  templateId?: ProfileTemplateId;
  resumeBlockType?: ResumeBlockType;
  profileImageUrl?: string;
  profileImageVisible?: boolean;
  bgImageUrl?: string;
  bgImageOverlay?: number;
  contactEmail?: string;
  emailVisible?: boolean;
  socials?: Partial<Record<SocialPlatform, Partial<DbSocialLink>>>;
}

interface UpsertResumeInput {
  fileName: string;
  fileSizeKb: number;
  fileUrl?: string;
}

interface CreateProjectInput {
  title: string;
  summary: string;
  highlights: string[];
  githubUrl?: string;
  demoUrl?: string;
  techStack?: string[];
}

interface UpdateProjectInput {
  title?: string;
  summary?: string;
  highlights?: string[];
  githubUrl?: string;
  demoUrl?: string;
  techStack?: string[];
}

interface PublicProfileResponse {
  slug: string;
  name: string;
  headline: string;
  summary: string;
  university: string;
  gradYear: string;
  internshipStatus: string;
  accentColor: AccentColor;
  templateId: ProfileTemplateId;
  skills: DbProfileSkills;
  resume: DbResume | null;
  profileImageUrl: string | null;
  bgImageUrl: string | null;
  bgImageOverlay: number;
  projects: DbProject[];
  contact: {
    email: string | null;
    socials: {
      linkedin: string | null;
      github: string | null;
      twitter: string | null;
      instagram: string | null;
    };
  };
  resumeBlockType: ResumeBlockType;
  publishedAt: string;
}

interface PseudoDbStore {
  usersById: Map<string, DbUser>;
  sessionsByToken: Map<string, DbSession>;
  profilesById: Map<string, DbProfile>;
  projectsById: Map<string, DbProject>;
  idCounter: number;
}

declare global {
  var __foliopageStore: PseudoDbStore | undefined;
}

const store: PseudoDbStore = globalThis.__foliopageStore ?? {
  usersById: new Map<string, DbUser>(),
  sessionsByToken: new Map<string, DbSession>(),
  profilesById: new Map<string, DbProfile>(),
  projectsById: new Map<string, DbProject>(),
  idCounter: 0,
};

if (!globalThis.__foliopageStore) {
  globalThis.__foliopageStore = store;
}

const usersById = store.usersById;
const sessionsByToken = store.sessionsByToken;
const profilesById = store.profilesById;
const projectsById = store.projectsById;

function nowIso(): string {
  return new Date().toISOString();
}

function nextId(prefix: string): string {
  store.idCounter += 1;
  return `${prefix}_${store.idCounter}`;
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function getUserByEmail(email: string): DbUser | undefined {
  const target = normalizeEmail(email);
  return [...usersById.values()].find((user) => normalizeEmail(user.email) === target);
}

function getProjectsForProfile(profileId: string): DbProject[] {
  return [...projectsById.values()]
    .filter((project) => project.profileId === profileId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

function resequenceProjects(profileId: string): void {
  const projects = getProjectsForProfile(profileId);
  projects.forEach((project, index) => {
    const next = { ...project, orderIndex: index + 1, updatedAt: nowIso() };
    projectsById.set(project.id, next);
  });
}

function parseSkillsFromCsv(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function normalizeSkills(values: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const value of values) {
    const item = value.trim();
    if (!item) continue;
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(item);
  }
  return normalized;
}

function normalizeHighlights(values: string[]): string[] {
  return values.map((item) => item.trim()).filter((item) => item.length > 0).slice(0, 3);
}

function normalizeTechStack(values: string[]): string[] {
  return values.map((item) => item.trim()).filter((item) => item.length > 0).slice(0, 10);
}

function createDefaultSocials(): DbProfileSocials {
  return {
    linkedin: { url: "", visible: false },
    github: { url: "", visible: false },
    twitter: { url: "", visible: false },
    instagram: { url: "", visible: false },
  };
}

function createDefaultSkills(): DbProfileSkills {
  return {
    languages: [],
    frameworks: [],
    tools: [],
    other: [],
  };
}

function normalizeResumeBlockType(value: unknown): ResumeBlockType {
  return value === "with_preview" ? "with_preview" : "without_preview";
}

function normalizeProfileImageUrl(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBgImageUrl(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBgImageOverlay(value: unknown): number {
  const raw = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(raw)) return 50;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

const profileTemplateIds = new Set<ProfileTemplateId>(
  listTemplates().map((template) => template.id),
);

function normalizeTemplateId(value: unknown): ProfileTemplateId {
  if (typeof value === "string" && profileTemplateIds.has(value as ProfileTemplateId)) {
    return value as ProfileTemplateId;
  }
  return defaultProfileTemplateId;
}

function normalizeProfileSkills(input: DbProfileSkills | string[]): DbProfileSkills {
  if (Array.isArray(input)) {
    return {
      ...createDefaultSkills(),
      other: normalizeSkills(input),
    };
  }

  return {
    languages: normalizeSkills(input.languages ?? []),
    frameworks: normalizeSkills(input.frameworks ?? []),
    tools: normalizeSkills(input.tools ?? []),
    other: normalizeSkills(input.other ?? []),
  };
}

function withProfileDefaults(profile: DbProfile): DbProfile {
  const rawSkills = profile.skills as unknown;
  return {
    ...profile,
    templateId: normalizeTemplateId(
      (profile as DbProfile & { templateId?: unknown }).templateId,
    ),
    profileImageUrl: normalizeProfileImageUrl(
      (profile as DbProfile & { profileImageUrl?: unknown }).profileImageUrl,
    ),
    profileImageVisible: Boolean(
      (profile as DbProfile & { profileImageVisible?: unknown }).profileImageVisible === true,
    ),
    bgImageUrl: normalizeBgImageUrl(
      (profile as DbProfile & { bgImageUrl?: unknown }).bgImageUrl,
    ),
    bgImageOverlay: normalizeBgImageOverlay(
      (profile as DbProfile & { bgImageOverlay?: unknown }).bgImageOverlay,
    ),
    contactEmail: profile.contactEmail ?? "",
    emailVisible: profile.emailVisible ?? true,
    resumeBlockType: normalizeResumeBlockType(
      (profile as DbProfile & { resumeBlockType?: unknown }).resumeBlockType,
    ),
    skills: normalizeProfileSkills(
      Array.isArray(rawSkills)
        ? (rawSkills as string[])
        : ((rawSkills as DbProfileSkills | undefined) ?? createDefaultSkills()),
    ),
    socials: {
      ...createDefaultSocials(),
      ...(profile.socials ?? {}),
      linkedin: {
        ...createDefaultSocials().linkedin,
        ...(profile.socials?.linkedin ?? {}),
      },
      github: {
        ...createDefaultSocials().github,
        ...(profile.socials?.github ?? {}),
      },
      twitter: {
        ...createDefaultSocials().twitter,
        ...(profile.socials?.twitter ?? {}),
      },
      instagram: {
        ...createDefaultSocials().instagram,
        ...(profile.socials?.instagram ?? {}),
      },
    },
  };
}

function mergeSocials(
  current: DbProfileSocials,
  input: UpdateProfileInput["socials"],
): DbProfileSocials {
  if (!input) {
    return current;
  }

  return {
    linkedin: {
      ...current.linkedin,
      ...(input.linkedin ?? {}),
      url: input.linkedin?.url?.trim() ?? current.linkedin.url,
    },
    github: {
      ...current.github,
      ...(input.github ?? {}),
      url: input.github?.url?.trim() ?? current.github.url,
    },
    twitter: {
      ...current.twitter,
      ...(input.twitter ?? {}),
      url: input.twitter?.url?.trim() ?? current.twitter.url,
    },
    instagram: {
      ...current.instagram,
      ...(input.instagram ?? {}),
      url: input.instagram?.url?.trim() ?? current.instagram.url,
    },
  };
}

export function getPlanLimits(planType: PlanType): { maxProjects: number } {
  if (planType === "free") {
    return { maxProjects: 3 };
  }
  return { maxProjects: 1000 };
}

export function signUp(email: string, password: string): DbUser {
  if (getUserByEmail(email)) {
    throw new Error("Email already exists.");
  }

  const user: DbUser = {
    id: nextId("user"),
    email: normalizeEmail(email),
    password,
    planType: "free",
    createdAt: nowIso(),
  };

  usersById.set(user.id, user);
  return user;
}

export function signIn(email: string, password: string): DbUser {
  const user = getUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password.");
  }
  return user;
}

export function resetPassword(email: string, nextPassword: string): DbUser {
  const user = getUserByEmail(email);
  if (!user) {
    throw new Error("User not found.");
  }

  const updated = { ...user, password: nextPassword };
  usersById.set(updated.id, updated);
  return updated;
}

export function createSession(userId: string): DbSession {
  const token = `${nextId("session")}_${Math.random().toString(36).slice(2, 12)}`;
  const session: DbSession = {
    token,
    userId,
    createdAt: nowIso(),
  };
  sessionsByToken.set(token, session);
  return session;
}

export function getUserFromToken(token: string): DbUser | null {
  const session = sessionsByToken.get(token);
  if (!session) {
    return null;
  }
  return usersById.get(session.userId) ?? null;
}

export function upgradePlan(userId: string, planType: PlanType): DbUser {
  const user = usersById.get(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  const updated = { ...user, planType };
  usersById.set(userId, updated);
  return updated;
}

export function createCheckoutSession(
  userId: string,
  plan: CheckoutPlan,
): { checkoutUrl: string; plan: CheckoutPlan } {
  const user = usersById.get(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  return {
    checkoutUrl: `https://checkout.foliopage.local/session/${nextId("checkout")}?plan=${plan}`,
    plan,
  };
}

export function listProfilesForUser(userId: string): DbProfile[] {
  return [...profilesById.values()]
    .filter((profile) => profile.userId === userId)
    .map((profile) => withProfileDefaults(profile));
}

export function createProfile(userId: string, input: CreateProfileInput): DbProfile {
  const slugExists = [...profilesById.values()].some(
    (profile) => profile.slug.toLowerCase() === input.slug.toLowerCase(),
  );
  if (slugExists) {
    throw new Error("Slug already in use.");
  }

  const createdAt = nowIso();
  const profile: DbProfile = {
    id: nextId("profile"),
    userId,
    slug: input.slug,
    name: input.name,
    headline: input.headline,
    summary: input.summary,
    university: input.university,
    gradYear: input.gradYear,
    internshipStatus: input.internshipStatus,
    accentColor: input.accentColor,
    templateId: normalizeTemplateId(input.templateId),
    published: false,
    createdAt,
    updatedAt: createdAt,
    skills: createDefaultSkills(),
    resume: null,
    profileImageUrl: normalizeProfileImageUrl(input.profileImageUrl),
    profileImageVisible: input.profileImageVisible === true,
    bgImageUrl: normalizeBgImageUrl(input.bgImageUrl),
    bgImageOverlay: normalizeBgImageOverlay(input.bgImageOverlay),
    contactEmail: "",
    emailVisible: true,
    resumeBlockType: normalizeResumeBlockType(input.resumeBlockType),
    socials: createDefaultSocials(),
  };

  profilesById.set(profile.id, profile);
  return profile;
}

export function getProfileForUser(profileId: string, userId: string): DbProfile {
  const profile = profilesById.get(profileId);
  if (!profile || profile.userId !== userId) {
    throw new Error("Profile not found.");
  }
  const safeProfile = withProfileDefaults(profile);
  if (safeProfile !== profile) {
    profilesById.set(profileId, safeProfile);
  }
  return safeProfile;
}

export function updateProfile(
  profileId: string,
  userId: string,
  input: UpdateProfileInput,
): DbProfile {
  const profile = getProfileForUser(profileId, userId);
  if (input.slug && input.slug !== profile.slug) {
    const slugExists = [...profilesById.values()].some(
      (entry) =>
        entry.id !== profileId && entry.slug.toLowerCase() === input.slug?.toLowerCase(),
    );
    if (slugExists) {
      throw new Error("Slug already in use.");
    }
  }

  const updated: DbProfile = {
    ...profile,
    ...input,
    summary:
      input.summary !== undefined ? input.summary : profile.summary,
    templateId:
      input.templateId !== undefined
        ? normalizeTemplateId(input.templateId)
        : profile.templateId,
    resumeBlockType:
      input.resumeBlockType !== undefined
        ? normalizeResumeBlockType(input.resumeBlockType)
        : profile.resumeBlockType,
    profileImageUrl:
      input.profileImageUrl !== undefined
        ? normalizeProfileImageUrl(input.profileImageUrl)
        : profile.profileImageUrl,
    profileImageVisible:
      input.profileImageVisible !== undefined
        ? input.profileImageVisible === true
        : profile.profileImageVisible,
    bgImageUrl:
      input.bgImageUrl !== undefined
        ? normalizeBgImageUrl(input.bgImageUrl)
        : profile.bgImageUrl,
    bgImageOverlay:
      input.bgImageOverlay !== undefined
        ? normalizeBgImageOverlay(input.bgImageOverlay)
        : profile.bgImageOverlay,
    contactEmail:
      input.contactEmail !== undefined ? input.contactEmail.trim() : profile.contactEmail,
    emailVisible:
      input.emailVisible !== undefined ? Boolean(input.emailVisible) : profile.emailVisible,
    socials: mergeSocials(profile.socials, input.socials),
    updatedAt: nowIso(),
  };
  profilesById.set(profileId, updated);
  return updated;
}

export function deleteProfile(profileId: string, userId: string): { deleted: true } {
  const profile = getProfileForUser(profileId, userId);
  profilesById.delete(profile.id);
  getProjectsForProfile(profile.id).forEach((project) => projectsById.delete(project.id));
  return { deleted: true };
}

export function setPublished(
  profileId: string,
  userId: string,
  published: boolean,
): DbProfile {
  const profile = getProfileForUser(profileId, userId);
  if (published && !profile.resume) {
    throw new Error("Upload a resume before publishing.");
  }
  const updated = {
    ...profile,
    published,
    updatedAt: nowIso(),
  };
  profilesById.set(profileId, updated);
  return updated;
}

export function setSkills(
  profileId: string,
  userId: string,
  skills: DbProfileSkills | string[],
): DbProfile {
  const profile = getProfileForUser(profileId, userId);
  const updated = {
    ...profile,
    skills: normalizeProfileSkills(skills),
    updatedAt: nowIso(),
  };
  profilesById.set(profileId, updated);
  return updated;
}

export function setSkillsFromCsv(profileId: string, userId: string, csv: string): DbProfile {
  return setSkills(profileId, userId, parseSkillsFromCsv(csv));
}

export function upsertResume(
  profileId: string,
  userId: string,
  input: UpsertResumeInput,
): DbProfile {
  const profile = getProfileForUser(profileId, userId);
  const safeFileName = input.fileName.trim();
  const resume: DbResume = {
    fileName: safeFileName,
    fileSizeKb: input.fileSizeKb,
    fileUrl:
      input.fileUrl ??
      `https://storage.foliopage.local/resumes/${profileId}/${encodeURIComponent(safeFileName)}`,
    updatedAt: nowIso(),
  };

  const updated = {
    ...profile,
    resume,
    updatedAt: nowIso(),
  };
  profilesById.set(profileId, updated);
  return updated;
}

export function deleteResume(profileId: string, userId: string): DbProfile {
  const profile = getProfileForUser(profileId, userId);
  const updated = {
    ...profile,
    resume: null,
    published: false,
    updatedAt: nowIso(),
  };
  profilesById.set(profileId, updated);
  return updated;
}

export function listProjects(profileId: string, userId: string): DbProject[] {
  getProfileForUser(profileId, userId);
  return getProjectsForProfile(profileId);
}

export function createProject(
  profileId: string,
  userId: string,
  input: CreateProjectInput,
): DbProject {
  const profile = getProfileForUser(profileId, userId);
  const user = usersById.get(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  const existingProjects = getProjectsForProfile(profileId);
  const { maxProjects } = getPlanLimits(user.planType);
  if (existingProjects.length >= maxProjects) {
    throw new Error(`Project limit reached for ${user.planType} plan.`);
  }

  const project: DbProject = {
    id: nextId("project"),
    profileId: profile.id,
    title: input.title.trim(),
    summary: input.summary.trim(),
    highlights: normalizeHighlights(input.highlights),
    githubUrl: (input.githubUrl ?? "").trim(),
    demoUrl: (input.demoUrl ?? "").trim(),
    techStack: normalizeTechStack(input.techStack ?? []),
    orderIndex: existingProjects.length + 1,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  projectsById.set(project.id, project);
  return project;
}

export function updateProject(
  profileId: string,
  projectId: string,
  userId: string,
  input: UpdateProjectInput,
): DbProject {
  getProfileForUser(profileId, userId);
  const project = projectsById.get(projectId);
  if (!project || project.profileId !== profileId) {
    throw new Error("Project not found.");
  }

  const updated: DbProject = {
    ...project,
    ...input,
    highlights: input.highlights ? normalizeHighlights(input.highlights) : project.highlights,
    techStack: input.techStack ? normalizeTechStack(input.techStack) : project.techStack,
    githubUrl: input.githubUrl !== undefined ? input.githubUrl.trim() : project.githubUrl,
    demoUrl: input.demoUrl !== undefined ? input.demoUrl.trim() : project.demoUrl,
    updatedAt: nowIso(),
  };

  projectsById.set(projectId, updated);
  return updated;
}

export function deleteProject(
  profileId: string,
  projectId: string,
  userId: string,
): { deleted: true } {
  getProfileForUser(profileId, userId);
  const project = projectsById.get(projectId);
  if (!project || project.profileId !== profileId) {
    throw new Error("Project not found.");
  }

  projectsById.delete(projectId);
  resequenceProjects(profileId);
  return { deleted: true };
}

export function reorderProjects(
  profileId: string,
  userId: string,
  orderedProjectIds: string[],
): DbProject[] {
  getProfileForUser(profileId, userId);
  const current = getProjectsForProfile(profileId);
  if (current.length !== orderedProjectIds.length) {
    throw new Error("Project order payload mismatch.");
  }

  const currentIds = new Set(current.map((project) => project.id));
  const incomingIds = new Set(orderedProjectIds);
  if (currentIds.size !== incomingIds.size) {
    throw new Error("Invalid project IDs.");
  }
  for (const id of orderedProjectIds) {
    if (!currentIds.has(id)) {
      throw new Error("Invalid project IDs.");
    }
  }

  orderedProjectIds.forEach((projectId, index) => {
    const project = projectsById.get(projectId);
    if (!project) {
      return;
    }
    projectsById.set(projectId, {
      ...project,
      orderIndex: index + 1,
      updatedAt: nowIso(),
    });
  });

  return getProjectsForProfile(profileId);
}

export function getPublicProfileBySlug(
  slug: string,
  recruiterView: boolean,
): PublicProfileResponse {
  const profile = [...profilesById.values()].find(
    (entry) => entry.slug.toLowerCase() === slug.toLowerCase() && entry.published,
  );
  if (!profile) {
    throw new Error("Published profile not found.");
  }
  const safeProfile = withProfileDefaults(profile);
  if (safeProfile !== profile) {
    profilesById.set(profile.id, safeProfile);
  }

  const user = usersById.get(profile.userId);
  if (!user) {
    throw new Error("Profile owner not found.");
  }

  const projects = getProjectsForProfile(safeProfile.id);
  const emailValue = safeProfile.contactEmail.trim() || user.email;
  const visibleSocials = {
    linkedin:
      safeProfile.socials.linkedin.visible && safeProfile.socials.linkedin.url
        ? safeProfile.socials.linkedin.url
        : null,
    github:
      safeProfile.socials.github.visible && safeProfile.socials.github.url
        ? safeProfile.socials.github.url
        : null,
    twitter:
      safeProfile.socials.twitter.visible && safeProfile.socials.twitter.url
        ? safeProfile.socials.twitter.url
        : null,
    instagram:
      safeProfile.socials.instagram.visible && safeProfile.socials.instagram.url
        ? safeProfile.socials.instagram.url
        : null,
  };
  const payload: PublicProfileResponse = {
    slug: safeProfile.slug,
    name: safeProfile.name,
    headline: safeProfile.headline,
    summary: safeProfile.summary,
    university: safeProfile.university,
    gradYear: safeProfile.gradYear,
    internshipStatus: safeProfile.internshipStatus,
    accentColor: safeProfile.accentColor,
    templateId: safeProfile.templateId,
    skills: recruiterView ? createDefaultSkills() : safeProfile.skills,
    resume: safeProfile.resume,
    profileImageUrl:
      safeProfile.profileImageVisible && safeProfile.profileImageUrl
        ? safeProfile.profileImageUrl
        : null,
    bgImageUrl: safeProfile.bgImageUrl || null,
    bgImageOverlay: safeProfile.bgImageOverlay,
    projects,
    contact: {
      email: safeProfile.emailVisible ? emailValue : null,
      socials: visibleSocials,
    },
    resumeBlockType: safeProfile.resumeBlockType,
    publishedAt: safeProfile.updatedAt,
  };

  return payload;
}

export function getUserPlan(userId: string): {
  planType: PlanType;
  limits: { maxProjects: number };
} {
  const user = usersById.get(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  return {
    planType: user.planType,
    limits: getPlanLimits(user.planType),
  };
}

function seedDemoData() {
  if (usersById.size > 0) {
    return;
  }
  /*
  const user = signUp("demo@foliopage.app", "demo-pass");
  const profile = createProfile(user.id, {
    slug: "ava-chen",
    name: "Ava Chen",
    headline: "Computer Science Student building reliable intern-ready apps.",
    university: "University of Illinois Urbana-Champaign",
    gradYear: "2027",
    internshipStatus: "Seeking Summer 2026 internship",
    accentColor: "blue",
  });

  setSkills(profile.id, user.id, ["TypeScript", "React", "SQL"]);
  upsertResume(profile.id, user.id, {
    fileName: "ava-chen-resume.pdf",
    fileSizeKb: 426,
  });

  createProject(profile.id, user.id, {
    title: "FocusFlow",
    summary: "Task planning app for student teams.",
    highlights: [
      "Shipped role-based task board.",
      "Reduced meeting time by 23%.",
      "Supported 120+ students.",
    ],
    githubUrl: "https://github.com/example/focusflow",
    demoUrl: "https://focusflow.demo.app",
    techStack: ["Next.js", "TypeScript", "Supabase"],
  });

  setPublished(profile.id, user.id, true);
  */
}

seedDemoData();
