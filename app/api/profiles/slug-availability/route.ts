import { NextRequest } from "next/server";
import { isProfileSlugAvailable } from "@/lib/db";
import { fail, ok, requireAuth } from "@/lib/api-route-utils";
import { slugifyName } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.response || !auth.user) {
    return auth.response ?? fail("Unauthorized.", 401);
  }

  try {
    const rawSlug = request.nextUrl.searchParams.get("slug") ?? "";
    const excludeProfileId = request.nextUrl.searchParams.get("excludeProfileId") ?? undefined;
    const slug = slugifyName(rawSlug);

    if (!slug) {
      return fail("Slug is required.", 422);
    }

    const available = await isProfileSlugAvailable(slug, excludeProfileId);
    return ok({ slug, available });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}
