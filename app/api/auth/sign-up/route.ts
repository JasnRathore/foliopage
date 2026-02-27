import { NextRequest } from "next/server";
import { createSession, signUp } from "@/lib/pseudo-db";
import { fail, ok, readJson } from "@/lib/api-route-utils";

interface SignUpBody {
  email?: string;
  password?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJson<SignUpBody>(request);
    const email = body.email?.trim() ?? "";
    const password = body.password?.trim() ?? "";

    if (!email || !password) {
      return fail("Email and password are required.", 422);
    }

    const user = signUp(email, password);
    const session = createSession(user.id);
    return ok(
      {
        user: {
          id: user.id,
          email: user.email,
          planType: user.planType,
        },
        token: session.token,
      },
      201,
    );
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}

