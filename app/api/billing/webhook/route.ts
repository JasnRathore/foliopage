import { NextRequest } from "next/server";
import { upgradePlan } from "@/lib/db";
import { fail, ok, readJson } from "@/lib/api-route-utils";

interface WebhookBody {
  event?: "payment_succeeded" | "payment_failed";
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJson<WebhookBody>(request);
    if (!body.event || !body.userId) {
      return fail("event and userId are required.", 422);
    }

    if (body.event === "payment_succeeded") {
      const user = await upgradePlan(body.userId, "pro");
      return ok({
        processed: true,
        user: {
          id: user.id,
          planType: user.planType,
        },
      });
    }

    return ok({ processed: true, message: "No plan changes applied." });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
}

