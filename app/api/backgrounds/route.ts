import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { fail, ok, readJson, requireAuth } from "@/lib/api-route-utils";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

interface UploadBackgroundBody {
  dataUrl?: string;
  profileId?: string;
  previousUrl?: string;
}

function parseImageDataUrl(dataUrl: string): { mime: string; buffer: Buffer } {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    throw new Error("Invalid image payload.");
  }
  const [, mime, base64] = match;
  const ext = MIME_TO_EXT[mime];
  if (!ext) {
    throw new Error("Unsupported image format.");
  }
  return { mime, buffer: Buffer.from(base64, "base64") };
}

function sanitizeSegment(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
}

function resolveLocalBackgroundPath(backgroundsDir: string, url: string | undefined): string | null {
  if (!url || !url.startsWith("/backgrounds/")) return null;
  const fileName = url.slice("/backgrounds/".length);
  if (!fileName || fileName.includes("/") || fileName.includes("\\")) return null;
  return path.join(backgroundsDir, fileName);
}

export async function POST(request: NextRequest) {
  const { user, response } = requireAuth(request);
  if (response) {
    return response;
  }

  try {
    const body = await readJson<UploadBackgroundBody>(request);
    const dataUrl = body.dataUrl?.trim() ?? "";
    if (!dataUrl) {
      return fail("Missing image data.", 422);
    }

    const { mime, buffer } = parseImageDataUrl(dataUrl);
    if (buffer.length === 0) {
      return fail("Empty image payload.", 422);
    }
    if (buffer.length > MAX_IMAGE_BYTES) {
      return fail("Max background image size is 8MB.", 422);
    }

    const extension = MIME_TO_EXT[mime];
    const base = sanitizeSegment(body.profileId) || sanitizeSegment(user.id) || "bg";
    const fileName = `${base}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;

    const backgroundsDir = path.join(process.cwd(), "public", "backgrounds");
    await fs.mkdir(backgroundsDir, { recursive: true });
    await fs.writeFile(path.join(backgroundsDir, fileName), buffer);

    const previousPath = resolveLocalBackgroundPath(backgroundsDir, body.previousUrl);
    if (previousPath) {
      await fs.unlink(previousPath).catch(() => undefined);
    }

    return ok({ url: `/backgrounds/${fileName}` }, 201);
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}
