import { NextRequest } from "next/server";
import { getPlanLimits } from "@/lib/db";
import { ok, requireAuth } from "@/lib/api-route-utils";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.response) {
    return auth.response;
  }

  const user = auth.user;
  const limits = getPlanLimits(user.planType);
  return ok({
    id: user.id,
    email: user.email,
    planType: user.planType,
    limits,
  });
}
