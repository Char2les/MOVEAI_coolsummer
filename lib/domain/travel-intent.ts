export type TravelIntentLevel = "LOW" | "MEDIUM" | "HIGH";
export type TravelContext = {
  outboundTicket?: { departureStation: string; arrivalStation: string; departureTime: string };
  returnTicket?: { departureStation: string; arrivalStation: string; departureTime: string };
  tripDurationDays: number;
  currentLocation: string;
  touristSpotVisited: boolean;
  merchantBrowsingCount: number;
  purchaseDetected: boolean;
  minutesUntilReturnTrain: number;
};
export type ProductRecommendationContext = {
  currentLocation: string;
  destinationStation?: string;
  merchantBrowsingCount: number;
  purchaseDetected: boolean;
  productCategories?: string[];
};
export type TravelIntentResult = { score: number; level: TravelIntentLevel; reasons: string[]; shouldNotify: boolean };

export const travelIntentWeights = {
  hasReturnTicket: 0.16,
  tripDurationOneToSevenDays: 0.12,
  atTripLocation: 0.14,
  touristSpotVisited: 0.16,
  merchantBrowsing: 0.14,
  purchaseDetected: 0.2,
  returnTrainSoon: 0.08,
} as const;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** Explainable fallback rule; an AI implementation must return this same shape. */
export function evaluateTravelIntent(context: TravelContext): TravelIntentResult {
  let score = 0;
  const reasons: string[] = [];
  const add = (condition: boolean, weight: number, reason: string) => { if (condition) { score += weight; reasons.push(reason); } };
  add(Boolean(context.returnTicket), travelIntentWeights.hasReturnTicket, "Return rail ticket is available");
  add(context.tripDurationDays >= 1 && context.tripDurationDays <= 7, travelIntentWeights.tripDurationOneToSevenDays, "Trip duration is within the travel window");
  add(Boolean(context.currentLocation), travelIntentWeights.atTripLocation, "User is at the trip location");
  add(context.touristSpotVisited, travelIntentWeights.touristSpotVisited, "Tourist spot visit detected");
  add(context.merchantBrowsingCount > 0, travelIntentWeights.merchantBrowsing, "Merchant or product browsing detected");
  add(context.purchaseDetected, travelIntentWeights.purchaseDetected, "Purchase activity detected");
  add(context.minutesUntilReturnTrain > 0 && context.minutesUntilReturnTrain <= 240, travelIntentWeights.returnTrainSoon, "Return train is approaching");
  score = clamp(score);
  const level: TravelIntentLevel = score >= 0.65 ? "HIGH" : score >= 0.35 ? "MEDIUM" : "LOW";
  return { score, level, reasons, shouldNotify: level === "HIGH" };
}
