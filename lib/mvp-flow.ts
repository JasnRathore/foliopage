import type { ProfileTemplateId } from "@/lib/profile-templates";

export type InternshipStatus =
  | "Seeking Summer 2026 internship"
  | "Open to Fall 2026 co-op"
  | "Open to full-time 2027"
  | "Not actively seeking";

export type PlanType = "free" | "pro";

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
  university: string;
  gradYear: string;
  internshipStatus: InternshipStatus;
  accentColor: "blue" | "purple" | "emerald" | "black";
  templateId: ProfileTemplateId;
  slug: string;
  plan: PlanType;
  resumeBlockType: "with_preview" | "without_preview";
  resumeFileName: string;
  resumeFileSizeKb: number;
  resumeUpdatedAt: string;
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
