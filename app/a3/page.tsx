"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { evaluateTravelIntent } from "@/lib/domain/travel-intent";
import { demoTicket, getAppNow } from "@/lib/demo-context";

export default function A3Page() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const departure = new Date(`${demoTicket.date.replaceAll(".", "-")}T${demoTicket.departureTime}:00+09:00`);
  const intent = evaluateTravelIntent({ outboundTicket: demoTicket, returnTicket: demoTicket, tripDurationDays: 2, currentLocation: demoTicket.departureStation, touristSpotVisited: true, merchantBrowsingCount: 2, purchaseDetected: true, minutesUntilReturnTrain: Math.max(0, Math.round((departure.getTime() - getAppNow().getTime()) / 60_000)) });
  return <main className="lock-screen"><div className="lock-status"><span>LG U+</span><span>▮▮▮ LTE　40</span></div><p className="lock-date">8월 13일 (목)</p><div className="lock-time">03:27</div><div className="lock-bottom"><span>▐</span><b>● 4개의 알림</b><span>◉</span></div>{intent.shouldNotify && visible && <section className="push-card"><div className="push-head"><span className="korail-icon">K</span><strong>코레일</strong><span>지금　⌄</span></div><h1>짐은 두고 가볍게 돌아가세요</h1><p>지금 구매한 상품을 서울까지 배송할 수 있어요.</p><small>부산역 주변 배송 가능한 지역매장을 확인해보세요.</small><div className="push-actions"><button onClick={() => router.push("/a4")}>배송 가능한 지역매장 보기　›</button><button onClick={() => setVisible(false)}>닫기</button></div></section>}</main>;
}
