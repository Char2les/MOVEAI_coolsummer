import { NextResponse } from "next/server";
import { getFallbackMerchants, getMerchantRecommendationProfiles, getTripContextEvents } from "@/lib/ai/travel-data";
import { buildTravelAIContext } from "@/lib/ai/travel-context";
import { getRuleFallbackRecommendation } from "@/lib/ai/travel-fallback";
import { getTravelAIRecommendation } from "@/lib/ai/travel-advisor";
import { evaluateTravelIntent, type TravelContext } from "@/lib/domain/travel-intent";
import { demoTicket, getAppNow, getDemoReachability } from "@/lib/demo-context";

const demoSessionId = "demo-traveler-001";
const buildDemoTravelContext = (): TravelContext => {
  const departure = new Date(`${demoTicket.date.replaceAll(".", "-")}T${demoTicket.departureTime}:00+09:00`);
  return { outboundTicket: demoTicket, returnTicket: demoTicket, tripDurationDays: 2, currentLocation: demoTicket.departureStation, touristSpotVisited: true, merchantBrowsingCount: 2, purchaseDetected: true, minutesUntilReturnTrain: Math.max(0, Math.round((departure.getTime() - getAppNow().getTime()) / 60_000)) };
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const sessionId = typeof body.sessionId === "string" && body.sessionId ? body.sessionId : demoSessionId;
  const travelContext = buildDemoTravelContext();
  const ruleIntent = evaluateTravelIntent(travelContext);
  const reachability = getDemoReachability();
  const [events, profiles] = await Promise.all([getTripContextEvents(sessionId), getMerchantRecommendationProfiles()]);
  const context = buildTravelAIContext(travelContext, events, reachability, getFallbackMerchants(), profiles);
  const fallback = getRuleFallbackRecommendation(context, ruleIntent);
  if (!ruleIntent.shouldNotify || !context.reachableMerchants.length) return NextResponse.json({ source: "RULE_FALLBACK", recommendation: fallback, ruleIntent });
  const recommendation = await getTravelAIRecommendation(context);
  return NextResponse.json({ source: recommendation ? "LIVE_AI" : "RULE_FALLBACK", recommendation: recommendation ?? fallback, ruleIntent });
}
