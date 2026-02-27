import { NextRequest } from "next/server";
import { createCheckoutSession, type CheckoutPlan } from "@/lib/pseudo-db";
import { fail, ok, readJson, requireAuth } from "@/lib/api-route-utils";

interface CheckoutBody {
  plan?: CheckoutPlan;
}

export async function POST(request: NextRequest) {
  const { user, response } = requireAuth(request);
  if (response) {
    return response;
  }

  try {
    const body = await readJson<CheckoutBody>(request);
    if (!body.plan || (body.plan !== "pro_monthly" && body.plan !== "pro_annual")) {
      return fail("plan must be pro_monthly or pro_annual.", 422);
    }

    const checkout = createCheckoutSession(user.id, body.plan);
    return ok(checkout, 201);
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}

