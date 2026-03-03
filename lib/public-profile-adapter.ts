import type { PublicProfileApi } from "@/lib/site-api";
import { defaultProfileTemplateId } from "@/lib/profile-templates";
import type { ProfileData } from "@/lib/profile-data";

function formatResumeSize(fileSizeKb: number): string {
  return `${fileSizeKb} KB PDF`;
}

function formatDatePrefix(value: string | null | undefined): string | undefined {
  if (typeof value !== "string" || value.length === 0) {
    return undefined;
  }
  return value.slice(0, 10);
}

export function mapPublicApiProfileToProfileData(profile: PublicProfileApi): ProfileData {
  const lastUpdated =
    formatDatePrefix(profile.resume?.updatedAt) ??
    formatDatePrefix(profile.publishedAt) ??
    "Unknown";
  const projects = Array.isArray(profile.projects) ? profile.projects : [];

  return {
    username: profile.slug,
    name: profile.name,
    headline: profile.headline,
    summary: profile.summary,
    university: profile.university,
    gradYear: profile.gradYear,
    internshipStatus: profile.internshipStatus,
    accentColor: profile.accentColor,
    templateId: profile.templateId ?? defaultProfileTemplateId,
    profileImageUrl: profile.profileImageUrl ?? undefined,
    bgImageUrl: profile.bgImageUrl ?? undefined,
    bgImageOverlay: profile.bgImageOverlay,
    plan: "free",
    resume: {
      url: profile.resume?.fileUrl ?? "#",
      fileSizeLabel: profile.resume ? formatResumeSize(profile.resume.fileSizeKb) : "No resume uploaded",
      lastUpdated,
      displayMode: profile.resumeBlockType,
      summary: profile.resume
        ? "Most recent resume upload from dashboard."
        : "No resume uploaded yet.",
    },
    projects: projects.map((project) => ({
      title: project.title,
      summary: project.summary,
      problem: project.highlights[0] ?? "Problem details coming soon.",
      solution: project.highlights[1] ?? "Solution details coming soon.",
      impact: project.highlights[2] ?? "Impact details coming soon.",
      highlights: project.highlights,
      techStack: project.techStack,
      githubUrl: project.githubUrl || undefined,
      demoUrl: project.demoUrl || undefined,
    })),
    skills: {
      languages: profile.skills.languages,
      frameworks: profile.skills.frameworks,
      tools: profile.skills.tools,
      other: profile.skills.other,
    },
    experiences: [],
    contact: {
      email: profile.contact.email ?? undefined,
      github: profile.contact.socials.github ?? undefined,
      linkedin: profile.contact.socials.linkedin ?? undefined,
      twitter: profile.contact.socials.twitter ?? undefined,
      instagram: profile.contact.socials.instagram ?? undefined,
    },
    childPages: [],
  };
}
