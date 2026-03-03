import type { ProfileTemplateId } from "@/lib/profile-templates";

export type AccentColor = "blue" | "purple" | "emerald" | "black";
export type PlanType = "free" | "pro";
export type ResumeDisplayMode = "with_preview" | "without_preview";

export interface ResumeData {
  url: string;
  fileSizeLabel: string;
  lastUpdated: string;
  displayMode?: ResumeDisplayMode;
  previewUrl?: string;
  summary?: string;
}

export interface ProjectData {
  title: string;
  summary: string;
  problem: string;
  solution: string;
  impact: string;
  highlights: string[];
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export interface ExperienceData {
  role: string;
  org: string;
  period: string;
  bullets: string[];
}

export interface SkillsData {
  languages: string[];
  frameworks: string[];
  tools: string[];
  other: string[];
}

export interface ContactData {
  email?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  calendar?: string;
}

export interface ChildPageBlock {
  heading: string;
  body: string;
  links?: Array<{ label: string; href: string }>;
}

export interface ChildPageData {
  slugSegments: string[];
  title: string;
  subtitle: string;
  blocks: ChildPageBlock[];
}

export interface ProfileData {
  username: string;
  name: string;
  headline: string;
  university: string;
  gradYear: string;
  location?: string;
  internshipStatus: string;
  accentColor: AccentColor;
  templateId?: ProfileTemplateId;
  profileImageUrl?: string;
  bgImageUrl?: string;         // background image for layouts that support it
  bgImageOverlay?: number;     // 0–100 overlay darkness, default 50
  plan: PlanType;
  summary: string;
  resume: ResumeData;
  projects: ProjectData[];
  skills: SkillsData;
  experiences: ExperienceData[];
  contact: ContactData;
  childPages: ChildPageData[];
}

export const accentPalette: Record<
  AccentColor,
  { solid: string; soft: string; ring: string; ink: string }
> = {
  blue: {
    solid: "#1d4ed8",
    soft: "#dbeafe",
    ring: "#93c5fd",
    ink: "#1e3a8a",
  },
  purple: {
    solid: "#7c3aed",
    soft: "#ede9fe",
    ring: "#c4b5fd",
    ink: "#4c1d95",
  },
  emerald: {
    solid: "#0f766e",
    soft: "#ccfbf1",
    ring: "#5eead4",
    ink: "#134e4a",
  },
  black: {
    solid: "#111827",
    soft: "#e5e7eb",
    ring: "#9ca3af",
    ink: "#030712",
  },
};


export function getChildPageBySegments(
  profile: ProfileData,
  slugSegments: string[],
): ChildPageData | undefined {
  const target = slugSegments.join("/").toLowerCase();
  return profile.childPages.find(
    (childPage) => childPage.slugSegments.join("/").toLowerCase() === target,
  );
}