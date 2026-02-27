import { NextRequest } from "next/server";
import { reorderProjects } from "@/lib/pseudo-db";
import { fail, ok, readJson, requireAuth } from "@/lib/api-route-utils";

interface ReorderBody {
  projectIds?: string[];
}

interface RouteContext {
  params: Promise<{ profileId: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { user, response } = requireAuth(request);
  if (response) {
    return response;
  }

  try {
    const body = await readJson<ReorderBody>(request);
    if (!body.projectIds || body.projectIds.length === 0) {
      return fail("projectIds are required.", 422);
    }

    const { profileId } = await context.params;
    const projects = reorderProjects(profileId, user.id, body.projectIds);
    return ok({ projects });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}

