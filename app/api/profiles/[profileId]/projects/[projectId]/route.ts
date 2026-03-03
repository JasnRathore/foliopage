import { NextRequest } from "next/server";
import { deleteProject, updateProject } from "@/lib/db";
import { fail, ok, readJson, requireAuth } from "@/lib/api-route-utils";

interface UpdateProjectBody {
  title?: string;
  summary?: string;
  highlights?: string[];
  githubUrl?: string;
  demoUrl?: string;
  techStack?: string[] | string;
}

interface RouteContext {
  params: Promise<{ profileId: string; projectId: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireAuth(request);
  if (auth.response) {
    return auth.response;
  }
  const user = auth.user as any;

  try {
    const { profileId, projectId } = await context.params;
    const body = await readJson<UpdateProjectBody>(request);
    const techStack =
      typeof body.techStack === "string"
        ? body.techStack.split(",").map((item) => item.trim())
        : body.techStack;

    const project = await updateProject(profileId, projectId, user.id, {
      ...body,
      techStack,
    });

    return ok({ project });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await requireAuth(request);
  if (auth.response) {
    return auth.response;
  }
  const user = auth.user as any;

  try {
    const { profileId, projectId } = await context.params;
    const result = await deleteProject(profileId, projectId, user.id);
    return ok(result);
  } catch (error) {
    return fail((error as Error).message, 404);
  }
}

