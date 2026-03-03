import { NextRequest } from "next/server";
import type { ProfileTemplateId } from "@/lib/profile-templates";
import {
  deleteProfile,
  getProfileForUser,
  updateProfile,
  type AccentColor,
  type DbProfileSocials,
  type ResumeBlockType,
} from "@/lib/db";
import { resolveProfileImageUrl } from "@/lib/github";
import { fail, ok, readJson, requireAuth } from "@/lib/api-route-utils";

interface UpdateProfileBody {
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
  contactEmail?: string;
  emailVisible?: boolean;
  socials?: Partial<{
    linkedin: Partial<DbProfileSocials["linkedin"]>;
    github: Partial<DbProfileSocials["github"]>;
    twitter: Partial<DbProfileSocials["twitter"]>;
    instagram: Partial<DbProfileSocials["instagram"]>;
  }>;
}

interface RouteContext {
  params: Promise<{ profileId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireAuth(request);
  if (response || !user) {
    return response ?? fail("Unauthorized.", 401);
  }

  try {
    const { profileId } = await context.params;
    const profile = await getProfileForUser(profileId, user.id);
    return ok({ profile });
  } catch (error) {
    return fail((error as Error).message, 404);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireAuth(request);
  if (response || !user) {
    return response ?? fail("Unauthorized.", 401);
  }

  try {
    const { profileId } = await context.params;
    const body = await readJson<UpdateProfileBody>(request);
    const payload: UpdateProfileBody = { ...body };
    if (body.profileImageUrl !== undefined) {
      let username = body.slug?.trim();
      if (!username) {
        const currentProfile = await getProfileForUser(profileId, user.id);
        username = currentProfile.slug;
      }
      payload.profileImageUrl = await resolveProfileImageUrl(body.profileImageUrl, {
        profileId,
        username,
      });
    }
    const profile = await updateProfile(profileId, user.id, payload);
    return ok({ profile });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireAuth(request);
  if (response || !user) {
    return response ?? fail("Unauthorized.", 401);
  }

  try {
    const { profileId } = await context.params;
    const result = await deleteProfile(profileId, user.id);
    return ok(result);
  } catch (error) {
    return fail((error as Error).message, 404);
  }
}
