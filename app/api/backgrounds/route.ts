import { NextRequest } from "next/server";
import {
  GitInfo,
  resolveBackgroundImageUrl as resolveBackgroundImageUrlFromGitHub,
  resolveProfileImageUrl,
} from "@/lib/github";
import { fail, ok, readJson, requireAuth } from "@/lib/api-route-utils";

interface UploadBackgroundBody {
  dataUrl?: string;
  profileId?: string;
  previousUrl?: string;
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireAuth(request);
  if (response || !user) {
    return response ?? fail("Unauthorized.", 401);
  }

  try {
    const body = await readJson<UploadBackgroundBody>(request);
    const dataUrl = body.dataUrl?.trim() ?? "";
    if (!dataUrl) {
      return fail("Missing image data.", 422);
    }

    const resolveBackgroundImageUrl =
      typeof resolveBackgroundImageUrlFromGitHub === "function"
        ? resolveBackgroundImageUrlFromGitHub
        : async (imageValue: string, opts: { profileId?: string }) => {
            const rootFolder = GitInfo.user_folder ? `${GitInfo.user_folder}/` : "";
            return resolveProfileImageUrl(imageValue, {
              profileId: opts.profileId,
              username: `${rootFolder}backgrounds`,
            });
          };

    const url = await resolveBackgroundImageUrl(dataUrl, {
      profileId: body.profileId ?? user.id,
    });
    return ok({ url }, 201);
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}
