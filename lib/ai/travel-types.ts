import type { TravelContext, TravelIntentResult } from "@/lib/domain/travel-intent";

export type TravelAIIntent = "SOUVENIR" | "FOOD" | "BAGGAGE_RELIEF" | "GENERAL_SHOPPING" | "LOW_PURCHASE_INTENT";
export type TravelAIRecommendation = {
  intent: TravelAIIntent;
  confidence: number;
  recommendedMerchantIds: string[];
  notificationTitle: string;
  notificationBody: string;
  reasons: string[];
};
export type RecommendationSource = "LIVE_AI" | "RULE_FALLBACK";
export type TravelRecommendationResult = {
  source: RecommendationSource;
  recommendation: TravelAIRecommendation;
  ruleIntent: TravelIntentResult;
};
export type TripContextEvent = {
  id: string;
  sessionId: string;
  eventType: string;
  occurredAt: string;
  region: string | null;
  entityId: string | null;
  metadata: Record<string, unknown>;
};
export type MerchantRecommendationProfile = {
  merchantId: string;
  summary: string;
  tags: string[];
  signatureItems: string[];
  recommendationContexts: string[];
};
export type ReachableMerchantAIContext = {
  merchantId: string;
  name: string;
  category: string;
  requiredMinutes: number;
  remainingMinutes: number;
  profile: MerchantRecommendationProfile | null;
};
export type TravelAIContext = {
  travel: Pick<TravelContext, "tripDurationDays" | "currentLocation" | "merchantBrowsingCount" | "purchaseDetected" | "minutesUntilReturnTrain"> & {
    visitedPoiCategories: string[];
    searchedProductQueries: string[];
    baggageOrShippingSignal: boolean;
  };
  reachableMerchants: ReachableMerchantAIContext[];
};
