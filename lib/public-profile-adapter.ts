import type { PublicProfileApi } from "@/lib/site-api";
import { defaultProfileTemplateId } from "@/lib/profile-templates";
import type { ProfileData } from "@/lib/site-data";

function formatResumeSize(fileSizeKb: number): string {
  return `${fileSizeKb} KB PDF`;
}

export function mapPublicApiProfileToProfileData(profile: PublicProfileApi): ProfileData {
  return {
    username: profile.slug,
    name: profile.name,
    headline: profile.headline,
    university: profile.university,
    gradYear: profile.gradYear,
    internshipStatus: profile.internshipStatus,
    accentColor: profile.accentColor,
    templateId: profile.templateId ?? defaultProfileTemplateId,
    plan: "free",
    summary: "Profile published with foliopage.",
    resume: {
      url: profile.resume?.fileUrl ?? "#",
      fileSizeLabel: profile.resume ? formatResumeSize(profile.resume.fileSizeKb) : "No resume uploaded",
      lastUpdated: profile.resume?.updatedAt.slice(0, 10) ?? profile.publishedAt.slice(0, 10),
      displayMode: profile.resumeBlockType,
      summary: profile.resume
        ? "Most recent resume upload from dashboard."
        : "No resume uploaded yet.",
    },
    projects: profile.projects.map((project) => ({
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
