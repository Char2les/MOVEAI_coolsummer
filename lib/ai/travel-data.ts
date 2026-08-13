import "server-only";

import { merchants } from "@/lib/merchants";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { MerchantRecommendationProfile, TripContextEvent } from "./travel-types";

const demoEvents: TripContextEvent[] = [
  { id: "demo-poi-1", sessionId: "demo-traveler-001", eventType: "VISITED_POI", occurredAt: "2026-08-27T09:30:00+09:00", region: "부산", entityId: null, metadata: { poiName: "해운대", category: "tourism" } },
  { id: "demo-poi-2", sessionId: "demo-traveler-001", eventType: "VISITED_POI", occurredAt: "2026-08-27T10:20:00+09:00", region: "부산", entityId: null, metadata: { poiName: "감천문화마을", category: "tourism" } },
  { id: "demo-search", sessionId: "demo-traveler-001", eventType: "SEARCHED_PRODUCT", occurredAt: "2026-08-27T10:45:00+09:00", region: "부산", entityId: null, metadata: { query: "부산 부모님 선물" } },
  { id: "demo-view", sessionId: "demo-traveler-001", eventType: "VIEWED_MERCHANT", occurredAt: "2026-08-27T11:00:00+09:00", region: "부산", entityId: "samjin-busan", metadata: {} },
  { id: "demo-return", sessionId: "demo-traveler-001", eventType: "RETURN_TRIP_APPROACHING", occurredAt: "2026-08-27T11:38:00+09:00", region: "부산", entityId: null, metadata: { minutesUntilDeparture: 120 } },
];
const ineligibleDemoEvents: TripContextEvent[] = [
  { id: "demo-nontraveler-open", sessionId: "demo-nontraveler-001", eventType: "SESSION_OPENED", occurredAt: "2026-08-27T11:38:00+09:00", region: null, entityId: null, metadata: { demo: true } },
];
const demoProfiles: MerchantRecommendationProfile[] = [{
  merchantId: "samjin-busan", summary: "부산역 인근에서 부산 지역 먹거리와 선물 상품을 구매할 수 있는 제휴 매장", tags: ["부산", "먹거리", "선물", "부모님선물", "지역상점"], signatureItems: ["부산 어묵 종합 선물세트", "삼진 어묵 선물세트", "프리미엄 어묵 세트"], recommendationContexts: ["귀가 전 선물", "부산 기념품", "가족 선물"],
}];

const fallbackEventsFor = (sessionId: string) => sessionId === "demo-traveler-001" ? demoEvents : sessionId === "demo-nontraveler-001" ? ineligibleDemoEvents : [];

export async function getTripContextEvents(sessionId: string): Promise<TripContextEvent[]> {
  if (!isSupabaseConfigured()) return fallbackEventsFor(sessionId);
  try {
    const { data, error } = await getSupabaseServerClient().from("trip_context_events").select("*").eq("session_id", sessionId).order("occurred_at");
    if (error) throw error;
    return (data ?? []).map((row) => ({ id: row.id, sessionId: row.session_id, eventType: row.event_type, occurredAt: row.occurred_at, region: row.region, entityId: row.entity_id, metadata: row.metadata ?? {} }));
  } catch { return fallbackEventsFor(sessionId); }
}

export async function getMerchantRecommendationProfiles(): Promise<MerchantRecommendationProfile[]> {
  if (!isSupabaseConfigured()) return demoProfiles;
  try {
    const { data, error } = await getSupabaseServerClient().from("merchant_recommendation_profiles").select("*");
    if (error) throw error;
    const profiles = (data ?? []).map((row) => ({ merchantId: row.merchant_id, summary: row.summary, tags: row.tags ?? [], signatureItems: row.signature_items ?? [], recommendationContexts: row.recommendation_contexts ?? [] }));
    return profiles.length ? profiles : demoProfiles;
  } catch { return demoProfiles; }
}

export const getFallbackMerchants = () => merchants;
