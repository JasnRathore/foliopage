import { NextRequest } from "next/server";
import { isEmailRegistered, upsertEmailOtp } from "@/lib/db";
import { mailOptions, transporter } from "@/lib/node-mailer";
import { fail, ok, readJson } from "@/lib/api-route-utils";

const OTP_EXPIRY_SECONDS = 10 * 60;
type OtpPurpose = "sign_up" | "password_reset";
const SIGN_UP_PURPOSE: OtpPurpose = "sign_up";
const PASSWORD_RESET_PURPOSE: OtpPurpose = "password_reset";

interface RequestOtpBody {
  email?: string;
  purpose?: OtpPurpose;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateOtp(): string {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJson<RequestOtpBody>(request);
    const email = body.email?.trim().toLowerCase() ?? "";
    const purpose = body.purpose ?? SIGN_UP_PURPOSE;

    if (!email || !isValidEmail(email)) {
      return fail("A valid email is required.", 422);
    }
    if (purpose !== SIGN_UP_PURPOSE && purpose !== PASSWORD_RESET_PURPOSE) {
      return fail("Invalid OTP purpose.", 422);
    }

    const exists = await isEmailRegistered(email);
    if (purpose === SIGN_UP_PURPOSE && exists) {
      return fail("Email already exists. Please sign in.", 409);
    }
    if (purpose === PASSWORD_RESET_PURPOSE && !exists) {
      return fail("No account found for this email.", 404);
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000).toISOString();
    await upsertEmailOtp(email, purpose, otp, expiresAt);

    await transporter.sendMail({
      ...mailOptions,
      to: email,
      subject:
        purpose === PASSWORD_RESET_PURPOSE
          ? "Your foliopage password reset code"
          : "Your foliopage verification code",
      text:
        purpose === PASSWORD_RESET_PURPOSE
          ? `Your password reset code is ${otp}. It expires in 10 minutes.`
          : `Your verification code is ${otp}. It expires in 10 minutes.`,
      html:
        purpose === PASSWORD_RESET_PURPOSE
          ? `<p>Your password reset code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`
          : `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
    });

    return ok({ sent: true, expiresInSeconds: OTP_EXPIRY_SECONDS });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}
