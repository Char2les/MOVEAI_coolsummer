import assert from "node:assert/strict";
import { getReachableMerchants } from "../lib/domain/reachability.ts";
import { evaluateTravelIntent } from "../lib/domain/travel-intent.ts";
import { buildTravelAIContext } from "../lib/ai/travel-context.ts";
import { getRuleFallbackRecommendation } from "../lib/ai/travel-fallback.ts";
import { shouldRunTravelAI } from "../lib/ai/travel-gate.ts";
import { resolveTravelRecommendation } from "../lib/ai/travel-result.ts";

const merchant = (id: string, availableNow = true) => ({ id, availableNow }) as never;
const base = {
  currentTime: new Date("2026-08-27T11:00:00+09:00"),
  ticketDepartureTime: new Date("2026-08-27T12:30:00+09:00"),
  currentLocation: "Busan Station",
  originStation: "Busan Station",
  safetyBufferMinutes: 15,
};
const operational = (overrides = {}) => ({ registered: true, isOpen: true, railShippingEnabled: true, travelFromOriginMinutes: 5, shoppingMinutes: 20, packagingMinutes: 10, returnToStationMinutes: 5, shippingCutoffTime: "18:00", ...overrides });

const results = getReachableMerchants({ ...base, merchants: [merchant("open"), merchant("near-departure"), merchant("closed"), merchant("far"), merchant("cutoff")], operationalData: {
  open: operational(),
  "near-departure": operational({ shoppingMinutes: 60 }),
  closed: operational({ isOpen: false }),
  far: operational({ travelFromOriginMinutes: 40, shoppingMinutes: 30, packagingMinutes: 20, returnToStationMinutes: 40 }),
  cutoff: operational({ shippingCutoffTime: "10:30" }),
} });
assert.equal(results.find((result) => result.merchantId === "open")?.reachable, true, "open merchant with enough time is reachable");
assert.equal(results.find((result) => result.merchantId === "near-departure")?.reason, "TOO_FAR", "merchant requiring more time than remains is excluded");
assert.equal(results.find((result) => result.merchantId === "closed")?.reason, "CLOSED", "closed merchant is excluded");
assert.equal(results.find((result) => result.merchantId === "far")?.reason, "TOO_FAR", "distant merchant is excluded");
assert.equal(results.find((result) => result.merchantId === "cutoff")?.reason, "SHIPPING_CUTOFF", "merchant past shipping cutoff is excluded");

const withBuffer = getReachableMerchants({ ...base, ticketDepartureTime: new Date("2026-08-27T11:39:00+09:00"), merchants: [merchant("buffer")], operationalData: { buffer: operational({ travelFromOriginMinutes: 5, shoppingMinutes: 10, packagingMinutes: 5, returnToStationMinutes: 5 }) } });
const withoutBuffer = getReachableMerchants({ ...base, ticketDepartureTime: new Date("2026-08-27T11:39:00+09:00"), safetyBufferMinutes: 0, merchants: [merchant("buffer")], operationalData: { buffer: operational({ travelFromOriginMinutes: 5, shoppingMinutes: 10, packagingMinutes: 5, returnToStationMinutes: 5 }) } });
assert.equal(withBuffer[0].reachable, false, "safety buffer excludes a borderline merchant");
assert.equal(withoutBuffer[0].reachable, true, "removing the buffer restores reachability");

const high = evaluateTravelIntent({ tripDurationDays: 2, currentLocation: "Busan", touristSpotVisited: true, merchantBrowsingCount: 2, purchaseDetected: true, minutesUntilReturnTrain: 120, returnTicket: { departureStation: "Busan", arrivalStation: "Seoul", departureTime: "14:58" } });
const low = evaluateTravelIntent({ tripDurationDays: 0, currentLocation: "", touristSpotVisited: false, merchantBrowsingCount: 0, purchaseDetected: false, minutesUntilReturnTrain: 0 });
assert.equal(high.level, "HIGH", "tourism, purchase, and nearby return train produce high intent");
assert.equal(high.shouldNotify, true);
assert.equal(low.level, "LOW", "ordinary movement produces low intent");
assert.equal(low.shouldNotify, false);

const eligibleIntent = evaluateTravelIntent({ tripDurationDays: 2, currentLocation: "Busan", touristSpotVisited: true, merchantBrowsingCount: 2, purchaseDetected: true, minutesUntilReturnTrain: 120, returnTicket: { departureStation: "Busan", arrivalStation: "Seoul", departureTime: "14:58" } });
const ineligibleIntent = evaluateTravelIntent({ tripDurationDays: 0, currentLocation: "", touristSpotVisited: false, merchantBrowsingCount: 0, purchaseDetected: false, minutesUntilReturnTrain: 0 });
const reachableForAi = [{ merchantId: "reachable", reachable: true, requiredMinutes: 20, remainingMinutes: 120 }];
assert.equal(eligibleIntent.shouldNotify, true, "eligible demo passes the existing notification rule");
assert.equal(shouldRunTravelAI(eligibleIntent, reachableForAi), true, "eligible demo permits AI and notification generation");
assert.equal(ineligibleIntent.shouldNotify, false, "negative demo fails the existing notification rule");
assert.equal(shouldRunTravelAI(ineligibleIntent, reachableForAi), false, "negative demo blocks AI invocation and reachable-merchant ranking");

const aiContext = buildTravelAIContext({ tripDurationDays: 2, currentLocation: "Busan", touristSpotVisited: true, merchantBrowsingCount: 2, purchaseDetected: true, minutesUntilReturnTrain: 120 }, [{ id: "event", sessionId: "demo", eventType: "SEARCHED_PRODUCT", occurredAt: "2026-08-27T11:00:00+09:00", region: "Busan", entityId: null, metadata: { query: "gift" } }], [{ merchantId: "reachable", reachable: true, requiredMinutes: 20, remainingMinutes: 120 }, { merchantId: "blocked", reachable: false, requiredMinutes: 200, remainingMinutes: 120 }], [merchant("reachable"), merchant("blocked")] as never, []);
const fallback = getRuleFallbackRecommendation(aiContext, high);
assert.deepEqual(fallback.recommendedMerchantIds, ["reachable"], "AI fallback only contains rule-approved reachable merchants");
const aiFailure = resolveTravelRecommendation(aiContext, eligibleIntent, null);
assert.equal(aiFailure.source, "RULE_FALLBACK", "an AI failure keeps deterministic notification fallback");
assert.deepEqual(aiFailure.recommendation.recommendedMerchantIds, ["reachable"], "AI failure fallback retains only reachable merchants");

console.log("Core business logic tests passed.");
