import { randomUUID } from "node:crypto";
import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";

const GITHUB_CONTENT_AUTH_TOKEN = process.env.GITHUB_CONTENT_AUTH_TOKEN || "";
const GITHUB_CONTENT_OWNER = process.env.GITHUB_CONTENT_OWNER || "";
const GITHUB_CONTENT_REPO = process.env.GITHUB_CONTENT_REPO || "";
const GITHUB_CONTENT_BRANCH = process.env.GITHUB_CONTENT_BRANCH || "main";
const GITHUB_USER_FOLDER = process.env.USER_FOLDER || "";

const IMAGE_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_BACKGROUND_BYTES = 8 * 1024 * 1024;
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

const contentOctokit = new Octokit({
  auth: GITHUB_CONTENT_AUTH_TOKEN,
});

function normalizeUserFolder(value: string): string {
  return value.trim().replace(/^\/+|\/+$/g, "");
}

export const GitInfo = {
  content_owner: GITHUB_CONTENT_OWNER,
  content_repo: GITHUB_CONTENT_REPO,
  content_branch: GITHUB_CONTENT_BRANCH,
  user_folder: normalizeUserFolder(GITHUB_USER_FOLDER),
};

interface GitHubFileUploadData {
  owner: string;
  repo: string;
  filePath: string;
  message: string;
  content: Buffer;
  branch?: string;
}

interface GitHubImageUploadData {
  owner: string;
  repo: string;
  filePath: string;
  message: string;
  file: File;
  branch?: string;
}

function ensureGitCredentials(): void {
  if (!GitInfo.content_owner || !GitInfo.content_repo || !GITHUB_CONTENT_AUTH_TOKEN) {
    throw new Error(
      "Missing GitHub content credentials. Set GITHUB_CONTENT_OWNER, GITHUB_CONTENT_REPO, and GITHUB_CONTENT_AUTH_TOKEN.",
    );
  }
}

function isDirectUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function sanitizeSegment(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
}

function parseImageDataUrl(dataUrl: string): { mime: string; buffer: Buffer } {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    throw new Error("Invalid profile image payload.");
  }
  const [, mime, base64] = match;
  const extension = IMAGE_MIME_TO_EXT[mime];
  if (!extension) {
    throw new Error("Unsupported profile image format.");
  }
  return { mime, buffer: Buffer.from(base64, "base64") };
}

function parsePdfDataUrl(dataUrl: string): Buffer {
  const match = dataUrl.match(/^data:application\/pdf;base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    throw new Error("Invalid resume payload.");
  }
  return Buffer.from(match[1], "base64");
}

async function getExistingSha(
  owner: string,
  repo: string,
  filePath: string,
  branch: string,
): Promise<string | undefined> {
  try {
    const { data } = await contentOctokit.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: branch,
    });
    if (Array.isArray(data)) {
      throw new Error(`Path '${filePath}' resolves to a directory.`);
    }
    return typeof data.sha === "string" ? data.sha : undefined;
  } catch (error) {
    if (error instanceof RequestError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function uploadGitHubFile({
  owner,
  repo,
  filePath,
  message,
  content,
  branch = "main",
}: GitHubFileUploadData): Promise<{ success: true; path: string }> {
  ensureGitCredentials();
  const sha = await getExistingSha(owner, repo, filePath, branch);
  const response = await contentOctokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message,
    content: content.toString("base64"),
    sha,
    branch,
  });

  const nextPath = response.data.content?.path;
  if (!nextPath) {
    throw new Error("GitHub upload failed: missing uploaded path.");
  }
  return { success: true, path: nextPath };
}

export async function uploadGitHubImage({
  owner,
  repo,
  filePath,
  message,
  file,
  branch = "main",
}: GitHubImageUploadData): Promise<{ success: true; path: string }> {
  const arrayBuffer = await file.arrayBuffer();
  return uploadGitHubFile({
    owner,
    repo,
    filePath,
    message,
    content: Buffer.from(arrayBuffer),
    branch,
  });
}

export async function uploadGitHubPDF({
  owner,
  repo,
  filePath,
  message,
  file,
  branch = "main",
}: GitHubImageUploadData): Promise<{ success: true; path: string }> {
  const arrayBuffer = await file.arrayBuffer();
  return uploadGitHubFile({
    owner,
    repo,
    filePath,
    message,
    content: Buffer.from(arrayBuffer),
    branch,
  });
}

export async function resolveProfileImageUrl(
  profileImageUrl: string,
  options: { profileId?: string; username?: string } = {},
): Promise<string> {
  const value = profileImageUrl.trim();
  if (!value) return "";
  if (isDirectUrl(value)) return value;
  if (!value.startsWith("data:image/")) return value;

  ensureGitCredentials();
  const { mime, buffer } = parseImageDataUrl(value);
  if (buffer.length === 0) {
    throw new Error("Profile image payload is empty.");
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error("Profile image must be under 5MB.");
  }

  const extension = IMAGE_MIME_TO_EXT[mime];
  const base = sanitizeSegment(options.profileId) || sanitizeSegment(options.username) || "profile";
  const usernameFolder = `${sanitizeSegment(options.username) || base}/`;
  const fileName = `${base}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
  const filePath = `${usernameFolder}${fileName}`;

  const uploaded = await uploadGitHubFile({
    owner: GitInfo.content_owner,
    repo: GitInfo.content_repo,
    filePath,
    message: `Upload profile image ${fileName}`,
    content: buffer,
    branch: GitInfo.content_branch,
  });

  const proj = {
    imageSrc: uploaded.path.startsWith(usernameFolder)
      ? uploaded.path.slice(usernameFolder.length)
      : uploaded.path,
  };

  return `https://cdn.jsdelivr.net/gh/${GitInfo.content_owner}/${GitInfo.content_repo}@${GitInfo.content_branch}/${usernameFolder}${proj.imageSrc}`;
}

export async function resolveBackgroundImageUrl(
  backgroundImageUrl: string,
  options: { profileId?: string } = {},
): Promise<string> {
  const value = backgroundImageUrl.trim();
  if (!value) return "";
  if (isDirectUrl(value)) return value;
  if (!value.startsWith("data:image/")) return value;

  ensureGitCredentials();
  const { mime, buffer } = parseImageDataUrl(value);
  if (buffer.length === 0) {
    throw new Error("Background image payload is empty.");
  }
  if (buffer.length > MAX_BACKGROUND_BYTES) {
    throw new Error("Max background image size is 8MB.");
  }

  const extension = IMAGE_MIME_TO_EXT[mime];
  const base = sanitizeSegment(options.profileId) || "bg";
  const fileName = `${base}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
  const rootFolder = GitInfo.user_folder ? `${GitInfo.user_folder}/` : "";
  const backgroundsFolder = `${rootFolder}backgrounds/`;
  const filePath = `${backgroundsFolder}${fileName}`;

  const uploaded = await uploadGitHubFile({
    owner: GitInfo.content_owner,
    repo: GitInfo.content_repo,
    filePath,
    message: `Upload background image ${fileName}`,
    content: buffer,
    branch: GitInfo.content_branch,
  });

  const proj = {
    imageSrc: uploaded.path.startsWith(backgroundsFolder)
      ? uploaded.path.slice(backgroundsFolder.length)
      : fileName,
  };

  return `https://cdn.jsdelivr.net/gh/${GitInfo.content_owner}/${GitInfo.content_repo}@${GitInfo.content_branch}/${rootFolder}backgrounds/${proj.imageSrc}`;
}

export async function resolveResumeFileUrl(
  resumeFileUrl: string,
  options: { profileId?: string; username?: string } = {},
): Promise<string> {
  const value = resumeFileUrl.trim();
  if (!value) return "";
  if (isDirectUrl(value)) return value;
  if (!value.startsWith("data:application/pdf;base64,")) return value;

  ensureGitCredentials();
  const buffer = parsePdfDataUrl(value);
  if (buffer.length === 0) {
    throw new Error("Resume payload is empty.");
  }
  if (buffer.length > MAX_RESUME_BYTES) {
    throw new Error("Resume must be under 5MB.");
  }

  const base = sanitizeSegment(options.profileId) || sanitizeSegment(options.username) || "resume";
  const usernameFolder = `${sanitizeSegment(options.username) || base}/`;
  const fileName = `${base}-resume-${Date.now()}-${randomUUID().slice(0, 8)}.pdf`;
  const filePath = `${usernameFolder}${fileName}`;

  const uploaded = await uploadGitHubFile({
    owner: GitInfo.content_owner,
    repo: GitInfo.content_repo,
    filePath,
    message: `Upload resume ${fileName}`,
    content: buffer,
    branch: GitInfo.content_branch,
  });

  const proj = {
    fileSrc: uploaded.path.startsWith(usernameFolder)
      ? uploaded.path.slice(usernameFolder.length)
      : uploaded.path,
  };

  return `https://cdn.jsdelivr.net/gh/${GitInfo.content_owner}/${GitInfo.content_repo}@${GitInfo.content_branch}/${usernameFolder}${proj.fileSrc}`;
}
