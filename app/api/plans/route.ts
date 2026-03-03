import { NextRequest } from "next/server";
import { getUserPlan } from "@/lib/pseudo-db";
import { ok, requireAuth } from "@/lib/api-route-utils";

export async function GET(request: NextRequest) {
  const { user, response } = requireAuth(request);
  if (response) {
    return response;
  }

  const plan = getUserPlan(user.id);
  return ok({
    ...plan,
    pricing: {
      proMonthly: 499,
      proAnnual: 4999,
    },
  });
}
