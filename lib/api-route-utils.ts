import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, type DbUser } from "@/lib/db";

export function ok(data: unknown, status = 200): NextResponse {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(message: string, status = 400, details?: unknown): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      details,
    },
    { status },
  );
}

export async function readJson<T>(request: NextRequest): Promise<T> {
  return (await request.json()) as T;
}

export function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header) {
    return null;
  }
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }
  return token;
}

export async function requireAuth(request: NextRequest): Promise<{
  user: DbUser;
  response: null;
} | {
  user: null;
  response: NextResponse;
}> {
  const token = getBearerToken(request);
  if (!token) {
    return { user: null, response: fail("Missing bearer token.", 401) };
  }
  const user = await getUserFromToken(token);
  if (!user) {
    return { user: null, response: fail("Invalid or expired token.", 401) };
  }
  return { user, response: null };
}
