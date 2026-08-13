"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getRuleFallbackRecommendation } from "@/lib/ai/travel-fallback";
import type { RecommendationSource, TravelAIRecommendation } from "@/lib/ai/travel-types";
import { evaluateTravelIntent } from "@/lib/domain/travel-intent";
import { demoTicket, getAppNow, getDemoReachability } from "@/lib/demo-context";
import { buildTravelAIContext } from "@/lib/ai/travel-context";
import { merchants } from "@/lib/merchants";

export default function A3Page() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [result, setResult] = useState<{ source: RecommendationSource; recommendation: TravelAIRecommendation } | null>(null);
  const travelContext = useMemo(() => {
    const departure = new Date(`${demoTicket.date.replaceAll(".", "-")}T${demoTicket.departureTime}:00+09:00`);
    return { outboundTicket: demoTicket, returnTicket: demoTicket, tripDurationDays: 2, currentLocation: demoTicket.departureStation, touristSpotVisited: true, merchantBrowsingCount: 2, purchaseDetected: true, minutesUntilReturnTrain: Math.max(0, Math.round((departure.getTime() - getAppNow().getTime()) / 60_000)) };
  }, []);
  const intent = useMemo(() => evaluateTravelIntent(travelContext), [travelContext]);
  const fallback = useMemo(() => getRuleFallbackRecommendation(buildTravelAIContext(travelContext, [], getDemoReachability(), merchants, []), intent), [travelContext, intent]);
  const recommendation = result?.recommendation ?? fallback;

  useEffect(() => {
    if (!intent.shouldNotify) return;
    let active = true;
    fetch("/api/travel-recommendation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: "demo-traveler-001" }) })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { source: RecommendationSource; recommendation: TravelAIRecommendation }) => { if (active) setResult(data); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [intent.shouldNotify]);

  return <main className="lock-screen"><div className="lock-status"><span>LG U+</span><span>◔ LTE　40</span></div><p className="lock-date">8월 13일 (목)</p><div className="lock-time">03:27</div><div className="lock-bottom"><span>◉</span><b>새 알림 4개</b><span>◉</span></div>{intent.shouldNotify && visible && <section className="push-card"><div className="push-head"><span className="korail-icon">K</span><strong>코레일</strong><span>지금</span></div><h1>{recommendation.notificationTitle}</h1><p>{recommendation.notificationBody}</p><small>{recommendation.recommendedMerchantIds.length ? "부산역 주변 배송 가능 매장을 확인해 보세요." : "여행 정보를 확인해 보세요."}</small><div className="push-actions"><button onClick={() => router.push("/a4")}>배송 가능한 지역 매장 보기　›</button><button onClick={() => setVisible(false)}>닫기</button></div></section>}</main>;
}
