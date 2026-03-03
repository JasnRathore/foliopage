import { NextRequest } from "next/server";
import { getUserPlan } from "@/lib/db";
import { ok, requireAuth } from "@/lib/api-route-utils";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.response) {
    return auth.response;
  }

  const user = auth.user as any;
  const plan = await getUserPlan(user.id);
  return ok({
    id: user.id,
    email: user.email,
    planType: plan.planType,
    limits: plan.limits,
  });
}
