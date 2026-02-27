import { NextRequest } from "next/server";
import type { ProfileTemplateId } from "@/lib/profile-templates";
import {
  deleteProfile,
  getProfileForUser,
  updateProfile,
  type AccentColor,
  type DbProfileSocials,
  type ResumeBlockType,
} from "@/lib/pseudo-db";
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
  const { user, response } = requireAuth(request);
  if (response) {
    return response;
  }

  try {
    const { profileId } = await context.params;
    const profile = getProfileForUser(profileId, user.id);
    return ok({ profile });
  } catch (error) {
    return fail((error as Error).message, 404);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { user, response } = requireAuth(request);
  if (response) {
    return response;
  }

  try {
    const { profileId } = await context.params;
    const body = await readJson<UpdateProfileBody>(request);
    const profile = updateProfile(profileId, user.id, body);
    return ok({ profile });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { user, response } = requireAuth(request);
  if (response) {
    return response;
  }

  try {
    const { profileId } = await context.params;
    const result = deleteProfile(profileId, user.id);
    return ok(result);
  } catch (error) {
    return fail((error as Error).message, 404);
  }
}
