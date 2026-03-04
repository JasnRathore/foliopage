import { NextRequest } from "next/server";
import { getPlanLimits } from "@/lib/db";
import { ok, requireAuth } from "@/lib/api-route-utils";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.response) {
    return auth.response;
  }
  const user = auth.user;
  return ok({
    planType: user.planType,
    limits: getPlanLimits(user.planType),
    pricing: {
      proMonthly: 499,
      proAnnual: 4999,
    },
  });
}
