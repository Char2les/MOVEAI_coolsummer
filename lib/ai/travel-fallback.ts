import type { TravelIntentResult } from "@/lib/domain/travel-intent";
import type { TravelAIContext, TravelAIRecommendation } from "./travel-types";

export function getRuleFallbackRecommendation(context: TravelAIContext, ruleIntent: TravelIntentResult): TravelAIRecommendation {
  const merchants = context.reachableMerchants.slice(0, 3);
  return {
    intent: context.travel.searchedProductQueries.some((query) => /선물|기념품/.test(query)) ? "SOUVENIR" : "GENERAL_SHOPPING",
    confidence: ruleIntent.score,
    recommendedMerchantIds: merchants.map((merchant) => merchant.merchantId),
    notificationTitle: "짐 가볍게, 여행의 맛은 챙겨가세요",
    notificationBody: "지금 구매한 지역 상품을 배송으로 보내고 편하게 귀가할 수 있어요.",
    reasons: ruleIntent.reasons,
  };
}
