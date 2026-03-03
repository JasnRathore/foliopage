import { NextRequest } from "next/server";
import { createSession, signUp, verifyAndConsumeEmailOtp } from "@/lib/db";
import { fail, ok, readJson } from "@/lib/api-route-utils";

interface SignUpBody {
  email?: string;
  password?: string;
  otp?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJson<SignUpBody>(request);
    const email = body.email?.trim() ?? "";
    const password = body.password?.trim() ?? "";
    const otp = body.otp?.trim() ?? "";

    if (!email || !password || !otp) {
      return fail("Email, password, and otp are required.", 422);
    }

    await verifyAndConsumeEmailOtp(email, "sign_up", otp);
    const user = await signUp(email, password);
    const session = await createSession(user.id);
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
