import { NextRequest } from "next/server";
import { resetPassword, verifyAndConsumeEmailOtp } from "@/lib/db";
import { fail, ok, readJson } from "@/lib/api-route-utils";

interface PasswordResetBody {
  email?: string;
  nextPassword?: string;
  otp?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJson<PasswordResetBody>(request);
    const email = body.email?.trim() ?? "";
    const nextPassword = body.nextPassword?.trim() ?? "";
    const otp = body.otp?.trim() ?? "";

    if (!email || !nextPassword || !otp) {
      return fail("Email, nextPassword, and otp are required.", 422);
    }

    await verifyAndConsumeEmailOtp(email, "password_reset", otp);
    const user = await resetPassword(email, nextPassword);
    return ok({
      user: {
        id: user.id,
        email: user.email,
      },
      message: "Password updated.",
    });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}
