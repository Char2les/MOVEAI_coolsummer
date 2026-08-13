import type { ReachabilityResult } from "@/lib/domain/reachability";
import type { TravelIntentResult } from "@/lib/domain/travel-intent";

/** Rule-only gate. Call it before any context/profile lookup or OpenAI request. */
export const shouldRunTravelAI = (intent: TravelIntentResult, reachability: readonly ReachabilityResult[]) => intent.shouldNotify && reachability.some((merchant) => merchant.reachable);
