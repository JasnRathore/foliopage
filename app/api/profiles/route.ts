import { NextRequest } from "next/server";
import { createProfile, listProfilesForUser, type AccentColor } from "@/lib/pseudo-db";
import { fail, ok, readJson, requireAuth } from "@/lib/api-route-utils";

interface CreateProfileBody {
  slug?: string;
  name?: string;
  headline?: string;
  university?: string;
  gradYear?: string;
  internshipStatus?: string;
  accentColor?: AccentColor;
}

export async function GET(request: NextRequest) {
  const { user, response } = requireAuth(request);
  if (response) {
    return response;
  }

  const profiles = listProfilesForUser(user.id);
  return ok({ profiles });
}

export async function POST(request: NextRequest) {
  const { user, response } = requireAuth(request);
  if (response) {
    return response;
  }

  try {
    const body = await readJson<CreateProfileBody>(request);
    const required = [
      body.slug,
      body.name,
      body.headline,
      body.university,
      body.gradYear,
      body.internshipStatus,
      body.accentColor,
    ];

    if (required.some((entry) => !entry || String(entry).trim().length === 0)) {
      return fail("Missing required profile fields.", 422);
    }

    const profile = createProfile(user.id, {
      slug: body.slug!.trim(),
      name: body.name!.trim(),
      headline: body.headline!.trim(),
      university: body.university!.trim(),
      gradYear: body.gradYear!.trim(),
      internshipStatus: body.internshipStatus!.trim(),
      accentColor: body.accentColor!,
    });

    return ok({ profile }, 201);
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}
