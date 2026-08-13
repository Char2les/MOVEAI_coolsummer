import { NextResponse } from "next/server";
import { getFallbackMerchants, getMerchantRecommendationProfiles, getTripContextEvents } from "@/lib/ai/travel-data";
import { buildTravelAIContext } from "@/lib/ai/travel-context";
import { getTravelAIRecommendation } from "@/lib/ai/travel-advisor";
import { buildDemoTravelContext, getDemoSessionId, getTravelDemoScenario } from "@/lib/ai/travel-demo-scenarios";
import { shouldRunTravelAI } from "@/lib/ai/travel-gate";
import { resolveTravelRecommendation } from "@/lib/ai/travel-result";
import { evaluateTravelIntent } from "@/lib/domain/travel-intent";
import { getDemoReachability } from "@/lib/demo-context";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const scenario = getTravelDemoScenario(typeof body.scenario === "string" ? body.scenario : null);
  const sessionId = typeof body.sessionId === "string" && body.sessionId ? body.sessionId : getDemoSessionId(scenario);
  const travelContext = buildDemoTravelContext(scenario);
  const ruleIntent = evaluateTravelIntent(travelContext);
  const reachability = getDemoReachability();
  if (!shouldRunTravelAI(ruleIntent, reachability)) {
    return NextResponse.json({ source: "RULE_FALLBACK", notificationEligible: false, aiInvoked: false, recommendation: null, ruleIntent });
  }
  const [events, profiles] = await Promise.all([getTripContextEvents(sessionId), getMerchantRecommendationProfiles()]);
  const context = buildTravelAIContext(travelContext, events, reachability, getFallbackMerchants(), profiles);
  const recommendation = await getTravelAIRecommendation(context);
  return NextResponse.json({ ...resolveTravelRecommendation(context, ruleIntent, recommendation), notificationEligible: true, aiInvoked: true, ruleIntent });
}
