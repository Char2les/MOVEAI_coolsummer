"use client";
import { useRouter } from "next/navigation";
import { demoTicket, getReachableMerchantCount, getTimeUntilDeparture } from "@/lib/demo-context";

export function ExploreHeader({ title = "내 여정에 맞는 추천" }: { title?: string }) {
  const router = useRouter();
  return <header className="explore-header"><button onClick={() => router.back()} aria-label="뒤로 가기">‹</button><h1>{title}</h1><div><button aria-label="알림">♧</button><button aria-label="메뉴">☰</button></div></header>;
}

export function JourneySummary({ timeLeft = getTimeUntilDeparture(demoTicket), reachableCount = getReachableMerchantCount() }: { timeLeft?: string; reachableCount?: number }) {
  return <section className="journey-summary"><div><strong>◷　출발까지 {timeLeft}</strong><p>지금 방문·구매·배송까지 가능한 매장 <b>{reachableCount}곳</b></p></div><div className="journey-art">🛍️</div></section>;
}
