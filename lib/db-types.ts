import type { ProfileTemplateId } from "@/lib/profile-templates";

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

export interface DbPublicProfile {
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
