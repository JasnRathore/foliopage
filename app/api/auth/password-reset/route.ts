import { NextRequest } from "next/server";
import { resetPassword } from "@/lib/pseudo-db";
import { fail, ok, readJson } from "@/lib/api-route-utils";

interface PasswordResetBody {
  email?: string;
  nextPassword?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJson<PasswordResetBody>(request);
    const email = body.email?.trim() ?? "";
    const nextPassword = body.nextPassword?.trim() ?? "";

    if (!email || !nextPassword) {
      return fail("Email and nextPassword are required.", 422);
    }

    const user = resetPassword(email, nextPassword);
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

