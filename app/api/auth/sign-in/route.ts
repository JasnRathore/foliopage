import { NextRequest } from "next/server";
import { createSession, signIn } from "@/lib/db";
import { fail, ok, readJson } from "@/lib/api-route-utils";

interface SignInBody {
  email?: string;
  password?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJson<SignInBody>(request);
    const email = body.email?.trim() ?? "";
    const password = body.password?.trim() ?? "";

    if (!email || !password) {
      return fail("Email and password are required.", 422);
    }

    const user = await signIn(email, password);
    const session = await createSession(user.id);
    return ok({
      user: {
        id: user.id,
        email: user.email,
        planType: user.planType,
      },
      token: session.token,
    });
  } catch (error) {
    return fail((error as Error).message, 401);
  }
}

