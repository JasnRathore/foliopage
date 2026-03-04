import { NextRequest } from "next/server";
import { getCachedPublicProfileBySlug } from "@/lib/public-profile-cache";
import { fail, ok } from "@/lib/api-route-utils";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const recruiterView = new URL(request.url).searchParams.get("view") === "recruiter";
    const profile = await getCachedPublicProfileBySlug(slug, recruiterView);
    if (!profile) {
      return fail("Published profile not found.", 404);
    }
    return ok({
      mode: recruiterView ? "recruiter" : "default",
      profile,
    });
  } catch (error) {
    return fail((error as Error).message, 404);
  }
}
