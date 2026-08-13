"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getRuleFallbackRecommendation } from "@/lib/ai/travel-fallback";
import { buildDemoTravelContext, getDemoSessionId, getTravelDemoScenario } from "@/lib/ai/travel-demo-scenarios";
import type { RecommendationSource, TravelAIRecommendation } from "@/lib/ai/travel-types";
import { buildTravelAIContext } from "@/lib/ai/travel-context";
import { evaluateTravelIntent } from "@/lib/domain/travel-intent";
import { getDemoReachability } from "@/lib/demo-context";
import { merchants } from "@/lib/merchants";

export default function A3Page() {
  return <Suspense fallback={<main className="lock-screen" />}><A3Content /></Suspense>;
}

function A3Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scenario = getTravelDemoScenario(searchParams.get("scenario"));
  const debug = searchParams.get("debug") === "1";
  const [visible, setVisible] = useState(true);
  const [result, setResult] = useState<{ source: RecommendationSource; recommendation: TravelAIRecommendation } | null>(null);
  const travelContext = useMemo(() => buildDemoTravelContext(scenario), [scenario]);
  const intent = useMemo(() => evaluateTravelIntent(travelContext), [travelContext]);
  const fallback = useMemo(() => {
    if (!intent.shouldNotify) return null;
    return getRuleFallbackRecommendation(buildTravelAIContext(travelContext, [], getDemoReachability(), merchants, []), intent);
  }, [travelContext, intent]);
  const recommendation = result?.recommendation ?? fallback;

  useEffect(() => {
    setVisible(true);
    setResult(null);
  }, [scenario]);
  useEffect(() => {
    if (!intent.shouldNotify) return;
    let active = true;
    fetch("/api/travel-recommendation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scenario, sessionId: getDemoSessionId(scenario) }) })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { source: RecommendationSource; recommendation: TravelAIRecommendation | null }) => { if (active && data.recommendation) setResult({ source: data.source, recommendation: data.recommendation }); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [intent.shouldNotify, scenario]);

  return <main className={`lock-screen${!intent.shouldNotify ? " ineligible-lock-screen" : ""}`} onClick={!intent.shouldNotify ? () => router.push("/") : undefined}><div className="lock-status"><span>LG U+</span><span>◔ LTE　40</span></div><p className="lock-date">8월 13일 (목)</p><div className="lock-time">03:27</div><div className="lock-bottom"><span>◉</span><b>새 알림 4개</b><span>◉</span></div>{debug && !intent.shouldNotify && <p role="status">알림 조건 미충족 · AI 호출 안 함</p>}{intent.shouldNotify && visible && recommendation && <section className="push-card"><div className="push-head"><span className="korail-icon">K</span><strong>코레일</strong><span>지금</span></div><h1>{recommendation.notificationTitle}</h1><p>{recommendation.notificationBody}</p><small>{recommendation.recommendedMerchantIds.length ? "부산역 주변 배송 가능 매장을 확인해 보세요." : "여행 정보를 확인해 보세요."}</small><div className="push-actions"><button onClick={() => router.push("/a4")}>배송 가능한 지역 매장 보기　›</button><button onClick={() => setVisible(false)}>닫기</button></div></section>}</main>;
}
