import type { TravelContext } from "@/lib/domain/travel-intent";
import { demoTicket, getAppNow } from "@/lib/demo-context";

export type TravelDemoScenario = "eligible" | "ineligible";

export const getTravelDemoScenario = (value: string | null | undefined): TravelDemoScenario => value === "ineligible" ? "ineligible" : "eligible";
export const getDemoSessionId = (scenario: TravelDemoScenario) => scenario === "ineligible" ? "demo-nontraveler-001" : "demo-traveler-001";

export function buildDemoTravelContext(scenario: TravelDemoScenario): TravelContext {
  if (scenario === "ineligible") {
    return { tripDurationDays: 0, currentLocation: "", touristSpotVisited: false, merchantBrowsingCount: 0, purchaseDetected: false, minutesUntilReturnTrain: 0 };
  }
  const departure = new Date(`${demoTicket.date.replaceAll(".", "-")}T${demoTicket.departureTime}:00+09:00`);
  return { outboundTicket: demoTicket, returnTicket: demoTicket, tripDurationDays: 2, currentLocation: demoTicket.departureStation, touristSpotVisited: true, merchantBrowsingCount: 2, purchaseDetected: true, minutesUntilReturnTrain: Math.max(0, Math.round((departure.getTime() - getAppNow().getTime()) / 60_000)) };
}
