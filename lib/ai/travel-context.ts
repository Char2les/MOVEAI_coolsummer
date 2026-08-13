import type { Merchant } from "@/lib/merchants";
import type { ReachabilityResult } from "@/lib/domain/reachability";
import type { TravelContext } from "@/lib/domain/travel-intent";
import type { MerchantRecommendationProfile, ReachableMerchantAIContext, TravelAIContext, TripContextEvent } from "./travel-types";

const canonicalProfileMerchantId = (merchantId: string) => merchantId === "samjin" ? "samjin-busan" : merchantId;

export function buildTravelAIContext(
  travelContext: TravelContext,
  events: TripContextEvent[],
  reachability: ReachabilityResult[],
  merchants: readonly Merchant[],
  profiles: MerchantRecommendationProfile[],
): TravelAIContext {
  const profileByMerchantId = new Map(profiles.map((profile) => [profile.merchantId, profile]));
  const reachableMerchants: ReachableMerchantAIContext[] = reachability
    .filter((result) => result.reachable)
    .flatMap((result) => {
      const merchant = merchants.find((candidate) => candidate.id === result.merchantId);
      if (!merchant) return [];
      return [{
        merchantId: merchant.id,
        name: merchant.name,
        category: merchant.category,
        requiredMinutes: result.requiredMinutes,
        remainingMinutes: result.remainingMinutes,
        profile: profileByMerchantId.get(canonicalProfileMerchantId(merchant.id)) ?? null,
      }];
    });
  const visitedPoiCategories = events
    .filter((event) => event.eventType === "VISITED_POI")
    .flatMap((event) => typeof event.metadata.category === "string" ? [event.metadata.category] : []);
  const searchedProductQueries = events
    .filter((event) => event.eventType === "SEARCHED_PRODUCT")
    .flatMap((event) => typeof event.metadata.query === "string" ? [event.metadata.query] : []);
  return {
    travel: {
      tripDurationDays: travelContext.tripDurationDays,
      currentLocation: travelContext.currentLocation,
      merchantBrowsingCount: travelContext.merchantBrowsingCount,
      purchaseDetected: travelContext.purchaseDetected,
      minutesUntilReturnTrain: travelContext.minutesUntilReturnTrain,
      visitedPoiCategories,
      searchedProductQueries,
      baggageOrShippingSignal: events.some((event) => /BAGGAGE|SHIPPING|RETURN_TRIP_APPROACHING/.test(event.eventType)),
    },
    reachableMerchants,
  };
}
