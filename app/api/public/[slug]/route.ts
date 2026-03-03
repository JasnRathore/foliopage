import { NextRequest } from "next/server";
import { getPublicProfileBySlug } from "@/lib/db";
import { fail, ok } from "@/lib/api-route-utils";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const recruiterView = new URL(request.url).searchParams.get("view") === "recruiter";
    const profile = await getPublicProfileBySlug(slug, recruiterView);
    return ok({
      mode: recruiterView ? "recruiter" : "default",
      profile,
    });
  } catch (error) {
    return fail((error as Error).message, 404);
  }
}
