import { NextRequest } from "next/server";
import { deleteResume, upsertResume } from "@/lib/db";
import { fail, ok, readJson, requireAuth } from "@/lib/api-route-utils";

const MAX_FILE_SIZE_KB = 5120;

interface ResumeBody {
  fileName?: string;
  fileSizeKb?: number;
  fileUrl?: string;
}

interface RouteContext {
  params: Promise<{ profileId: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = await requireAuth(request);
  if (auth.response) {
    return auth.response;
  }
  const user = auth.user as any;

  try {
    const body = await readJson<ResumeBody>(request);
    const fileName = body.fileName?.trim() ?? "";
    const fileSizeKb = Number(body.fileSizeKb ?? 0);

    if (!fileName || Number.isNaN(fileSizeKb)) {
      return fail("fileName and fileSizeKb are required.", 422);
    }

    if (fileSizeKb > MAX_FILE_SIZE_KB) {
      return fail("Max resume size is 5MB.", 422);
    }

    const { profileId } = await context.params;
    const profile = await upsertResume(profileId, user.id, {
      fileName,
      fileSizeKb,
      fileUrl: body.fileUrl,
    });
    return ok({ profile });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await requireAuth(request);
  if (auth.response) {
    return auth.response;
  }
  const user = auth.user as any;

  try {
    const { profileId } = await context.params;
    const profile = await deleteResume(profileId, user.id);
    return ok({ profile });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}

