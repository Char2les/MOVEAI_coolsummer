import "server-only";

import OpenAI from "openai";
import type { TravelAIContext, TravelAIIntent, TravelAIRecommendation } from "./travel-types";

const intentValues: TravelAIIntent[] = ["SOUVENIR", "FOOD", "BAGGAGE_RELIEF", "GENERAL_SHOPPING", "LOW_PURCHASE_INTENT"];
const recommendationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["intent", "confidence", "recommendedMerchantIds", "notificationTitle", "notificationBody", "reasons"],
  properties: {
    intent: { type: "string", enum: intentValues },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    recommendedMerchantIds: { type: "array", items: { type: "string" }, maxItems: 3 },
    notificationTitle: { type: "string", maxLength: 80 },
    notificationBody: { type: "string", maxLength: 180 },
    reasons: { type: "array", items: { type: "string" }, maxItems: 4 },
  },
} as const;

function validateRecommendation(value: unknown, allowedIds: Set<string>): TravelAIRecommendation | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (!intentValues.includes(candidate.intent as TravelAIIntent) || typeof candidate.confidence !== "number" || candidate.confidence < 0 || candidate.confidence > 1 || typeof candidate.notificationTitle !== "string" || typeof candidate.notificationBody !== "string" || !Array.isArray(candidate.recommendedMerchantIds) || !Array.isArray(candidate.reasons)) return null;
  return {
    intent: candidate.intent as TravelAIIntent,
    confidence: candidate.confidence,
    recommendedMerchantIds: candidate.recommendedMerchantIds.filter((id): id is string => typeof id === "string" && allowedIds.has(id)).slice(0, 3),
    notificationTitle: candidate.notificationTitle,
    notificationBody: candidate.notificationBody,
    reasons: candidate.reasons.filter((reason): reason is string => typeof reason === "string").slice(0, 4),
  };
}

export async function getTravelAIRecommendation(context: TravelAIContext): Promise<TravelAIRecommendation | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !context.reachableMerchants.length) return null;
  const allowedIds = new Set(context.reachableMerchants.map((merchant) => merchant.merchantId));
  const client = new OpenAI({ apiKey });
  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      store: false,
      instructions: "You personalize a Korean railway-travel shopping nudge. The supplied merchants already passed every deterministic safety, opening-hours, delivery, and time check. Never add merchants, do not invent products or personal data, and recommend only merchant IDs present in reachableMerchants. Write concise Korean notification copy.",
      input: JSON.stringify(context),
      text: { format: { type: "json_schema", name: "travel_ai_recommendation", strict: true, schema: recommendationSchema } },
    }, { timeout: 20_000 });
    return validateRecommendation(JSON.parse(response.output_text), allowedIds);
  } catch { return null; }
}
