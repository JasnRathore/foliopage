import { NextRequest } from "next/server";
import { getUserPlan } from "@/lib/db";
import { ok, requireAuth } from "@/lib/api-route-utils";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.response) {
    return auth.response;
  }
  const user = auth.user as any;

  try {
    const plan = await getUserPlan(user.id);
    return ok({
      ...plan,
      pricing: {
        proMonthly: 499,
        proAnnual: 4999,
      },
    });
  } catch (error) {
    return ok({ planType: "free", limits: { maxProjects: 3 }, pricing: { proMonthly: 499, proAnnual: 4999 } });
  }
}
