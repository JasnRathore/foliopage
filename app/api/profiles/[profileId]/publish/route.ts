import { NextRequest } from "next/server";
import { setPublished } from "@/lib/db";
import { fail, ok, readJson, requireAuth } from "@/lib/api-route-utils";

interface PublishBody {
  published?: boolean;
}

interface RouteContext {
  params: Promise<{ profileId: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireAuth(request);
  if (response) {
    return response;
  }

  try {
    const body = await readJson<PublishBody>(request);
    const published = Boolean(body.published);
    const { profileId } = await context.params;
    const profile = await setPublished(profileId, user.id, published);
    return ok({ profile });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}

