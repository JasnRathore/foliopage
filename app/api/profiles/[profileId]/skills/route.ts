import { NextRequest } from "next/server";
import { setSkills, setSkillsFromCsv, type DbProfileSkills } from "@/lib/db";
import { fail, ok, readJson, requireAuth } from "@/lib/api-route-utils";

interface SkillsBody {
  skills?: DbProfileSkills | string[] | string;
}

interface RouteContext {
  params: Promise<{ profileId: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireAuth(request);
  if (response) {
    return response;
  }

  try {
    const { profileId } = await context.params;
    const body = await readJson<SkillsBody>(request);
    const { skills } = body;

    const profile =
      typeof skills === "string"
        ? await setSkillsFromCsv(profileId, user.id, skills)
        : Array.isArray(skills)
          ? await setSkills(
              profileId,
              user.id,
              skills.map((item) => item.trim()).filter((item) => item.length > 0),
            )
          : await setSkills(profileId, user.id, {
              languages: (skills?.languages ?? []).map((item) => item.trim()),
              frameworks: (skills?.frameworks ?? []).map((item) => item.trim()),
              tools: (skills?.tools ?? []).map((item) => item.trim()),
              other: (skills?.other ?? []).map((item) => item.trim()),
            });

    return ok({ profile });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}
