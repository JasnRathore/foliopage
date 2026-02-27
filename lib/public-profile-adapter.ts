import type { PublicProfileApi } from "@/lib/site-api";
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
    plan: "free",
    summary: "Profile published with foliopage.",
    resume: {
      url: profile.resume?.fileUrl ?? "#",
      fileSizeLabel: profile.resume ? formatResumeSize(profile.resume.fileSizeKb) : "No resume uploaded",
      lastUpdated: profile.resume?.updatedAt.slice(0, 10) ?? profile.publishedAt.slice(0, 10),
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
      languages: [],
      frameworks: [],
      tools: [],
      other: profile.skills,
    },
    experiences: [],
    contact: {
      email: profile.contact.email,
      github: "#",
      linkedin: "#",
    },
    childPages: [],
  };
}
