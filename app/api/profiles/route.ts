import { NextRequest } from "next/server";
import type { ProfileTemplateId } from "@/lib/profile-templates";
import {
  createProfile,
  listProfilesForUser,
  type AccentColor,
  type ResumeBlockType,
} from "@/lib/db";
import { resolveProfileImageUrl } from "@/lib/github";
import { fail, ok, readJson, requireAuth } from "@/lib/api-route-utils";

interface CreateProfileBody {
  slug?: string;
  name?: string;
  headline?: string;
  university?: string;
  gradYear?: string;
  internshipStatus?: string;
  accentColor?: AccentColor;
  templateId?: ProfileTemplateId;
  resumeBlockType?: ResumeBlockType;
  profileImageUrl?: string;
  profileImageVisible?: boolean;
  bgImageUrl?: string;
  bgImageOverlay?: number;
}

export async function GET(request: NextRequest) {
  const { user, response } = await requireAuth(request);
  if (response || !user) {
    return response ?? fail("Unauthorized.", 401);
  }

  const profiles = await listProfilesForUser(user.id);
  return ok({ profiles });
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireAuth(request);
  if (response || !user) {
    return response ?? fail("Unauthorized.", 401);
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

    const profileImageUrl =
      body.profileImageUrl !== undefined
        ? await resolveProfileImageUrl(body.profileImageUrl, {
            username: body.slug?.trim(),
          })
        : undefined;

    const profile = await createProfile(user.id, {
      slug: body.slug!.trim(),
      name: body.name!.trim(),
      headline: body.headline!.trim(),
      university: body.university!.trim(),
      gradYear: body.gradYear!.trim(),
      internshipStatus: body.internshipStatus!.trim(),
      accentColor: body.accentColor!,
      templateId: body.templateId,
      resumeBlockType: body.resumeBlockType,
      profileImageUrl,
      profileImageVisible: body.profileImageVisible,
      bgImageUrl: body.bgImageUrl,
      bgImageOverlay: body.bgImageOverlay,
    });

    return ok({ profile }, 201);
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}
