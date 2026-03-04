import { NextRequest } from "next/server";
import { createProject, listProjects } from "@/lib/db";
import { fail, ok, readJson, requireAuth } from "@/lib/api-route-utils";

interface CreateProjectBody {
  title?: string;
  summary?: string;
  highlights?: string[];
  githubUrl?: string;
  demoUrl?: string;
  techStack?: string[] | string;
}

interface RouteContext {
  params: Promise<{ profileId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = await requireAuth(request);
  if (auth.response) {
    return auth.response;
  }
  const user = auth.user;

  try {
    const { profileId } = await context.params;
    const projects = await listProjects(profileId, user.id);
    return ok({ projects });
  } catch (error) {
    return fail((error as Error).message, 404);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = await requireAuth(request);
  if (auth.response) {
    return auth.response;
  }
  const user = auth.user;

  try {
    const { profileId } = await context.params;
    const body = await readJson<CreateProjectBody>(request);

    if (!body.title?.trim() || !body.summary?.trim()) {
      return fail("title and summary are required.", 422);
    }

    const techStack =
      typeof body.techStack === "string"
        ? body.techStack.split(",").map((item) => item.trim())
        : body.techStack ?? [];

    const project = await createProject(profileId, user.id, {
      title: body.title.trim(),
      summary: body.summary.trim(),
      highlights: body.highlights ?? [],
      githubUrl: body.githubUrl,
      demoUrl: body.demoUrl,
      techStack,
    });

    return ok({ project }, 201);
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}

