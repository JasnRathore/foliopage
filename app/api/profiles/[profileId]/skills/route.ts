import { NextRequest } from "next/server";
import { setSkills, setSkillsFromCsv } from "@/lib/pseudo-db";
import { fail, ok, readJson, requireAuth } from "@/lib/api-route-utils";

interface SkillsBody {
  skills?: string[] | string;
}

interface RouteContext {
  params: Promise<{ profileId: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { user, response } = requireAuth(request);
  if (response) {
    return response;
  }

  try {
    const { profileId } = await context.params;
    const body = await readJson<SkillsBody>(request);
    const { skills } = body;

    const profile =
      typeof skills === "string"
        ? setSkillsFromCsv(profileId, user.id, skills)
        : setSkills(
            profileId,
            user.id,
            (skills ?? []).map((item) => item.trim()).filter((item) => item.length > 0),
          );

    return ok({ profile });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}

