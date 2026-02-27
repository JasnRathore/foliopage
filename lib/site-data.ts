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

const profiles: ProfileData[] = [
  {
    username: "ava-chen",
    name: "Ava Chen",
    headline: "Computer Science Student building reliable intern-ready apps.",
    university: "University of Illinois Urbana-Champaign",
    gradYear: "2027",
    location: "Chicago, IL",
    internshipStatus: "Seeking Summer 2026 internship",
    accentColor: "blue",
    templateId: "linkboard",
    plan: "free",
    summary:
      "I build practical products with clear UX and measurable outcomes. My focus is full-stack web apps and collaboration-heavy engineering work.",
    resume: {
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSizeLabel: "426 KB PDF",
      lastUpdated: "2026-02-12",
      displayMode: "with_preview",
      summary: "Product-focused resume with project outcomes and impact metrics.",
    },
    projects: [
      {
        title: "FocusFlow",
        summary: "Task planning app for student teams with async standups.",
        problem:
          "Student project teams lost context between classes and meetings.",
        solution:
          "Built a shared board with standup prompts, sprint views, and role-based notes.",
        impact:
          "Used by 120+ students in two orgs and cut meeting time by 23%.",
        highlights: [
          "Shipped role-based task board with optimistic updates.",
          "Added meeting digest email to reduce context switching.",
          "Implemented keyboard shortcuts for fast backlog grooming.",
        ],
        techStack: ["Next.js", "TypeScript", "Postgres", "Supabase"],
        githubUrl: "https://github.com/example/focusflow",
        demoUrl: "https://focusflow.demo.app",
      },
      {
        title: "SafeRoute",
        summary: "Campus-safe routing app using crowd and lighting signals.",
        problem:
          "Late-night campus routes often ignored safety conditions and lighting.",
        solution:
          "Combined map routing with incident and lighting overlays for safer path suggestions.",
        impact:
          "Won 2nd place at a campus hackathon and piloted by 45 students.",
        highlights: [
          "Merged external map APIs with custom safety scoring.",
          "Created mobile-first route cards optimized for quick glance.",
          "Documented data assumptions and confidence for each route.",
        ],
        techStack: ["React", "Node.js", "Prisma", "Mapbox"],
        githubUrl: "https://github.com/example/saferoute",
      },
      {
        title: "PatchPanel",
        summary: "Frontend issue triage dashboard for student dev clubs.",
        problem:
          "Volunteer teams struggled to prioritize UI bugs across multiple repos.",
        solution:
          "Centralized issue intake and scoring based on user impact and complexity.",
        impact:
          "Reduced unresolved UI issues by 41% in one semester.",
        highlights: [
          "Added impact-first sorting logic and assignment workflow.",
          "Integrated lightweight metrics snapshot for weekly triage.",
          "Created contributor onboarding docs with issue templates.",
        ],
        techStack: ["React", "Tailwind", "Express", "SQLite"],
        demoUrl: "https://patchpanel.demo.app",
      },
    ],
    skills: {
      languages: ["TypeScript", "JavaScript", "Python", "SQL"],
      frameworks: ["Next.js", "React", "Express", "Tailwind"],
      tools: ["GitHub Actions", "Figma", "Postman", "Vercel"],
      other: ["Product Thinking", "Technical Writing", "User Interviews"],
    },
    experiences: [
      {
        role: "Frontend Engineering Intern",
        org: "Nexa Labs",
        period: "May 2025 - Aug 2025",
        bullets: [
          "Implemented 11 customer-facing UI improvements in a React dashboard.",
          "Worked with design to reduce onboarding friction in trial flow.",
        ],
      },
      {
        role: "Teaching Assistant - Intro to Web Dev",
        org: "UIUC CS Department",
        period: "Jan 2025 - Present",
        bullets: [
          "Supported weekly labs and code reviews for 90+ students.",
          "Created debugging guides now used in onboarding.",
        ],
      },
    ],
    contact: {
      email: "ava.chen@example.com",
      github: "https://github.com/example",
      linkedin: "https://linkedin.com/in/example",
      calendar: "https://cal.com/example",
    },
    childPages: [
      {
        slugSegments: ["case-studies", "focusflow"],
        title: "FocusFlow Case Study",
        subtitle: "How a student team workflow tool moved from idea to 120 users",
        blocks: [
          {
            heading: "Context",
            body: "Three clubs at my university needed a lightweight, shared planning flow that did not feel like enterprise software.",
          },
          {
            heading: "Execution",
            body: "I ran 9 interviews, turned findings into scoped milestones, and delivered the MVP in 4 weeks with weekly feedback rounds.",
            links: [
              {
                label: "Live demo",
                href: "https://focusflow.demo.app",
              },
            ],
          },
          {
            heading: "Outcome",
            body: "The product became the default planning workflow for two clubs and improved sprint completion consistency.",
          },
        ],
      },
      {
        slugSegments: ["notes", "internship-prep"],
        title: "Internship Prep Notes",
        subtitle: "Systematic playbook for recruiting cycles",
        blocks: [
          {
            heading: "Weekly Structure",
            body: "I use a fixed weekly cadence for applications, outreach, and project polish to stay consistent over long hiring cycles.",
          },
          {
            heading: "Artifacts",
            body: "I maintain role-specific resume versions, one polished project page per role type, and interview debrief notes.",
          },
        ],
      },
    ],
  },
  {
    username: "jordan-kim",
    name: "Jordan Kim",
    headline: "Early-career product engineer focused on shipping clear UX.",
    university: "Northeastern University",
    gradYear: "2026",
    location: "Boston, MA",
    internshipStatus: "Open to Fall 2026 co-op",
    accentColor: "emerald",
    templateId: "linkboard",
    plan: "pro",
    summary:
      "I build software that is easy to adopt and hard to break. I care about maintainable systems and practical product detail.",
    resume: {
      url: "#",
      fileSizeLabel: "512 KB PDF",
      lastUpdated: "2026-02-10",
      displayMode: "without_preview",
      summary: "Resume available on request.",
    },
    projects: [
      {
        title: "LabLedger",
        summary: "Research lab inventory tracker with audit-safe change logs.",
        problem:
          "Lab inventory updates were scattered across spreadsheets and chat.",
        solution:
          "Built a transaction-backed inventory service with role-based approval flow.",
        impact:
          "Reduced stockout incidents by 35% over one term.",
        highlights: [
          "Implemented conflict handling for simultaneous edits.",
          "Added alerting for low stock and expiring materials.",
          "Introduced CSV import for legacy migration.",
        ],
        techStack: ["Next.js", "Postgres", "Prisma", "Zod"],
        githubUrl: "https://github.com/example/labledger",
      },
    ],
    skills: {
      languages: ["TypeScript", "Go", "SQL"],
      frameworks: ["Next.js", "React", "Gin"],
      tools: ["Docker", "CI/CD", "Vercel"],
      other: ["System Design", "Mentorship"],
    },
    experiences: [
      {
        role: "Software Engineering Co-op",
        org: "Atlas Systems",
        period: "Jul 2025 - Dec 2025",
        bullets: [
          "Built internal workflow tooling used by 4 cross-functional teams.",
          "Improved reliability of async job processing and retry behavior.",
        ],
      },
    ],
    contact: {
      email: "jordan.kim@example.com",
      github: "https://github.com/example-jordan",
      linkedin: "https://linkedin.com/in/example-jordan",
    },
    childPages: [
      {
        slugSegments: ["writing", "ship-fast-without-chaos"],
        title: "Ship Fast Without Chaos",
        subtitle: "Working notes on balancing speed and software quality",
        blocks: [
          {
            heading: "Operating Principle",
            body: "Move fast on user-facing experiments, but keep core architecture boring and observable.",
          },
        ],
      },
    ],
  },
];

export function listProfiles(): ProfileData[] {
  return profiles;
}

export function getProfileByUsername(username: string): ProfileData | undefined {
  return profiles.find(
    (profile) => profile.username.toLowerCase() === username.toLowerCase(),
  );
}

export function getChildPageBySegments(
  profile: ProfileData,
  slugSegments: string[],
): ChildPageData | undefined {
  const target = slugSegments.join("/").toLowerCase();
  return profile.childPages.find(
    (childPage) => childPage.slugSegments.join("/").toLowerCase() === target,
  );
}
