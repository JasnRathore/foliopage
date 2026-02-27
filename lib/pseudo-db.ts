export type PlanType = "free" | "pro";
export type AccentColor = "blue" | "purple" | "emerald" | "black";
export type CheckoutPlan = "pro_monthly" | "pro_annual";

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

export interface DbProfile {
  id: string;
  userId: string;
  slug: string;
  name: string;
  headline: string;
  university: string;
  gradYear: string;
  internshipStatus: string;
  accentColor: AccentColor;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  skills: string[];
  resume: DbResume | null;
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
  university: string;
  gradYear: string;
  internshipStatus: string;
  accentColor: AccentColor;
}

interface UpdateProfileInput {
  slug?: string;
  name?: string;
  headline?: string;
  university?: string;
  gradYear?: string;
  internshipStatus?: string;
  accentColor?: AccentColor;
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
  university: string;
  gradYear: string;
  internshipStatus: string;
  accentColor: AccentColor;
  skills: string[];
  resume: DbResume | null;
  projects: DbProject[];
  contact: {
    email: string;
  };
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

function normalizeHighlights(values: string[]): string[] {
  return values.map((item) => item.trim()).filter((item) => item.length > 0).slice(0, 3);
}

function normalizeTechStack(values: string[]): string[] {
  return values.map((item) => item.trim()).filter((item) => item.length > 0).slice(0, 10);
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
  return [...profilesById.values()].filter((profile) => profile.userId === userId);
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
    university: input.university,
    gradYear: input.gradYear,
    internshipStatus: input.internshipStatus,
    accentColor: input.accentColor,
    published: false,
    createdAt,
    updatedAt: createdAt,
    skills: [],
    resume: null,
  };

  profilesById.set(profile.id, profile);
  return profile;
}

export function getProfileForUser(profileId: string, userId: string): DbProfile {
  const profile = profilesById.get(profileId);
  if (!profile || profile.userId !== userId) {
    throw new Error("Profile not found.");
  }
  return profile;
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

export function setSkills(profileId: string, userId: string, skills: string[]): DbProfile {
  const profile = getProfileForUser(profileId, userId);
  const updated = {
    ...profile,
    skills,
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

  const user = usersById.get(profile.userId);
  if (!user) {
    throw new Error("Profile owner not found.");
  }

  const projects = getProjectsForProfile(profile.id);
  const payload: PublicProfileResponse = {
    slug: profile.slug,
    name: profile.name,
    headline: profile.headline,
    university: profile.university,
    gradYear: profile.gradYear,
    internshipStatus: profile.internshipStatus,
    accentColor: profile.accentColor,
    skills: recruiterView ? [] : profile.skills,
    resume: profile.resume,
    projects,
    contact: {
      email: user.email,
    },
    publishedAt: profile.updatedAt,
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
}

seedDemoData();
