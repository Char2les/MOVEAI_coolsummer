import type { TravelIntentResult } from "@/lib/domain/travel-intent";
import { getRuleFallbackRecommendation } from "./travel-fallback.ts";
import type { RecommendationSource, TravelAIContext, TravelAIRecommendation } from "./travel-types";

export function resolveTravelRecommendation(context: TravelAIContext, ruleIntent: TravelIntentResult, recommendation: TravelAIRecommendation | null): { source: RecommendationSource; recommendation: TravelAIRecommendation } {
  return recommendation ? { source: "LIVE_AI", recommendation } : { source: "RULE_FALLBACK", recommendation: getRuleFallbackRecommendation(context, ruleIntent) };
}
