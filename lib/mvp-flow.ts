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
  slug: string;
  plan: PlanType;
  resumeFileName: string;
  resumeFileSizeKb: number;
  resumeUpdatedAt: string;
  skillsInput: string;
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
    slug: "",
    plan: "free",
    resumeFileName: "",
    resumeFileSizeKb: 0,
    resumeUpdatedAt: now,
    skillsInput: "",
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

