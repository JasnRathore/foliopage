import type {
  AccentColor,
  CheckoutPlan,
  DbProfile,
  DbProject,
  PlanType,
} from "@/lib/pseudo-db";

interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

export class ApiClientError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    token?: string;
    body?: unknown;
    cache?: RequestCache;
  } = {},
): Promise<T> {
  const headers = new Headers();
  if (options.token) {
    headers.set("authorization", `Bearer ${options.token}`);
  }
  if (options.body !== undefined) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(path, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
  });

  const payload = (await response
    .json()
    .catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || !payload?.ok || payload.data === undefined) {
    throw new ApiClientError(
      payload?.error ?? "Request failed.",
      response.status,
      payload?.details,
    );
  }

  return payload.data;
}

export interface AuthUser {
  id: string;
  email: string;
  planType: PlanType;
}

export interface SignInResponse {
  user: AuthUser;
  token: string;
}

export function signUp(email: string, password: string): Promise<SignInResponse> {
  return request<SignInResponse>("/api/auth/sign-up", {
    method: "POST",
    body: { email, password },
  });
}

export function signIn(email: string, password: string): Promise<SignInResponse> {
  return request<SignInResponse>("/api/auth/sign-in", {
    method: "POST",
    body: { email, password },
  });
}

export function resetPassword(
  email: string,
  nextPassword: string,
): Promise<{ user: { id: string; email: string }; message: string }> {
  return request<{ user: { id: string; email: string }; message: string }>(
    "/api/auth/password-reset",
    {
      method: "POST",
      body: { email, nextPassword },
    },
  );
}

export function getMe(token: string): Promise<{
  id: string;
  email: string;
  planType: PlanType;
  limits: { maxProjects: number };
}> {
  return request("/api/auth/me", { token, cache: "no-store" });
}

export function getPlans(token: string): Promise<{
  planType: PlanType;
  limits: { maxProjects: number };
  pricing: {
    proMonthly: number;
    proAnnual: number;
  };
}> {
  return request("/api/plans", { token, cache: "no-store" });
}

export function listProfiles(token: string): Promise<{ profiles: DbProfile[] }> {
  return request("/api/profiles", { token, cache: "no-store" });
}

export interface ProfilePayload {
  slug?: string;
  name?: string;
  headline?: string;
  university?: string;
  gradYear?: string;
  internshipStatus?: string;
  accentColor?: AccentColor;
}

export function createProfileApi(
  token: string,
  payload: Required<ProfilePayload>,
): Promise<{ profile: DbProfile }> {
  return request("/api/profiles", { method: "POST", token, body: payload });
}

export function getProfile(token: string, profileId: string): Promise<{ profile: DbProfile }> {
  return request<{ profile: DbProfile }>(`/api/profiles/${profileId}`, { token, cache: "no-store" }).then((data) => {
    if (!data.profile) {
      console.log("getProfile response:", data);
    }
    return data;
  });
}

export function updateProfileApi(
  token: string,
  profileId: string,
  payload: ProfilePayload,
): Promise<{ profile: DbProfile }> {
  return request(`/api/profiles/${profileId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export function deleteProfileApi(token: string, profileId: string): Promise<{ deleted: true }> {
  return request(`/api/profiles/${profileId}`, { method: "DELETE", token });
}

export function setPublishedApi(
  token: string,
  profileId: string,
  published: boolean,
): Promise<{ profile: DbProfile }> {
  return request(`/api/profiles/${profileId}/publish`, {
    method: "POST",
    token,
    body: { published },
  });
}

export function upsertResumeApi(
  token: string,
  profileId: string,
  payload: { fileName: string; fileSizeKb: number; fileUrl?: string },
): Promise<{ profile: DbProfile }> {
  return request(`/api/profiles/${profileId}/resume`, {
    method: "POST",
    token,
    body: payload,
  });
}

export function deleteResumeApi(token: string, profileId: string): Promise<{ profile: DbProfile }> {
  return request(`/api/profiles/${profileId}/resume`, {
    method: "DELETE",
    token,
  });
}

export function setSkillsApi(
  token: string,
  profileId: string,
  skills: string[] | string,
): Promise<{ profile: DbProfile }> {
  return request(`/api/profiles/${profileId}/skills`, {
    method: "PUT",
    token,
    body: { skills },
  });
}

export function listProjectsApi(
  token: string,
  profileId: string,
): Promise<{ projects: DbProject[] }> {
  return request(`/api/profiles/${profileId}/projects`, { token, cache: "no-store" });
}

export interface ProjectPayload {
  title?: string;
  summary?: string;
  highlights?: string[];
  githubUrl?: string;
  demoUrl?: string;
  techStack?: string[] | string;
}

export function createProjectApi(
  token: string,
  profileId: string,
  payload: Required<Pick<ProjectPayload, "title" | "summary">> & ProjectPayload,
): Promise<{ project: DbProject }> {
  return request(`/api/profiles/${profileId}/projects`, {
    method: "POST",
    token,
    body: payload,
  });
}

export function updateProjectApi(
  token: string,
  profileId: string,
  projectId: string,
  payload: ProjectPayload,
): Promise<{ project: DbProject }> {
  return request(`/api/profiles/${profileId}/projects/${projectId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export function deleteProjectApi(
  token: string,
  profileId: string,
  projectId: string,
): Promise<{ deleted: true }> {
  return request(`/api/profiles/${profileId}/projects/${projectId}`, {
    method: "DELETE",
    token,
  });
}

export function reorderProjectsApi(
  token: string,
  profileId: string,
  projectIds: string[],
): Promise<{ projects: DbProject[] }> {
  return request(`/api/profiles/${profileId}/projects/reorder`, {
    method: "POST",
    token,
    body: { projectIds },
  });
}

export function createCheckoutSessionApi(
  token: string,
  plan: CheckoutPlan,
): Promise<{ checkoutUrl: string; plan: CheckoutPlan }> {
  return request("/api/billing/checkout", {
    method: "POST",
    token,
    body: { plan },
  });
}

export function processBillingWebhookApi(payload: {
  event: "payment_succeeded" | "payment_failed";
  userId: string;
}): Promise<{ processed: boolean; message?: string; user?: { id: string; planType: PlanType } }> {
  return request("/api/billing/webhook", {
    method: "POST",
    body: payload,
  });
}

export interface PublicProfileApi {
  slug: string;
  name: string;
  headline: string;
  university: string;
  gradYear: string;
  internshipStatus: string;
  accentColor: AccentColor;
  skills: string[];
  resume: {
    fileName: string;
    fileUrl: string;
    fileSizeKb: number;
    updatedAt: string;
  } | null;
  projects: DbProject[];
  contact: {
    email: string;
  };
  publishedAt: string;
}

export function getPublicProfileApi(
  slug: string,
  recruiterMode: boolean,
): Promise<{ mode: "default" | "recruiter"; profile: PublicProfileApi }> {
  const query = recruiterMode ? "?view=recruiter" : "";
  return request(`/api/public/${encodeURIComponent(slug)}${query}`, { cache: "no-store" });
}
