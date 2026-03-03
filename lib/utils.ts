import type { AccentColor, PlanType, ResumeBlockType } from "@/lib/db-types";
import type { ProfileTemplateId } from "@/lib/profile-templates";

export type InternshipStatus =
  | "Seeking Summer 2026 internship"
  | "Open to Fall 2026 co-op"
  | "Open to full-time 2027"
  | "Not actively seeking";

export interface ProjectDraft {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
  githubUrl: string;
  demoUrl: string;
  techStack: string;
}

export interface ProfileDraft {
  fullName: string;
  headline: string;
  summary: string;
  university: string;
  gradYear: string;
  internshipStatus: InternshipStatus;
  accentColor: AccentColor;
  templateId: ProfileTemplateId;
  slug: string;
  plan: PlanType;
  resumeBlockType: ResumeBlockType;
  resumeFileName: string;
  resumeFileSizeKb: number;
  resumeUpdatedAt: string;
  profileImageUrl: string;
  profileImageVisible: boolean;
  bgImageUrl: string;
  bgImageOverlay: number;
  skillsLanguagesInput: string;
  skillsFrameworksInput: string;
  skillsToolsInput: string;
  skillsOtherInput: string;
  contactEmail: string;
  emailVisible: boolean;
  linkedinUrl: string;
  linkedinVisible: boolean;
  githubUrl: string;
  githubVisible: boolean;
  twitterUrl: string;
  twitterVisible: boolean;
  instagramUrl: string;
  instagramVisible: boolean;
  published: boolean;
  projects: ProjectDraft[];
}

export function createProjectDraft(id: string): ProjectDraft {
  return {
    id,
    title: "",
    summary: "",
    highlights: ["", "", ""],
    githubUrl: "",
    demoUrl: "",
    techStack: "",
  };
}

export function slugifyName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 32);
}

export function createDefaultDraft(): ProfileDraft {
  const now = new Date().toISOString().slice(0, 10);

  return {
    fullName: "",
    headline: "",
    summary: "",
    university: "",
    gradYear: "2027",
    internshipStatus: "Seeking Summer 2026 internship",
    accentColor: "blue",
    templateId: "linkboard",
    slug: "",
    plan: "free",
    resumeBlockType: "without_preview",
    resumeFileName: "",
    resumeFileSizeKb: 0,
    resumeUpdatedAt: now,
    profileImageUrl: "",
    profileImageVisible: false,
    bgImageUrl: "",
    bgImageOverlay: 50,
    skillsLanguagesInput: "",
    skillsFrameworksInput: "",
    skillsToolsInput: "",
    skillsOtherInput: "",
    contactEmail: "",
    emailVisible: true,
    linkedinUrl: "",
    linkedinVisible: false,
    githubUrl: "",
    githubVisible: false,
    twitterUrl: "",
    twitterVisible: false,
    instagramUrl: "",
    instagramVisible: false,
    published: false,
    projects: [createProjectDraft("project-1")],
  };
}

export function parseSkills(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function toJson(value: unknown): string {
  return JSON.stringify(value ?? null);
}

export function fromJson<T>(value: string | null | undefined): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
