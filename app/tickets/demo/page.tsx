"use client";
import { useRouter } from "next/navigation";
import { TicketCard } from "@/components/TicketCard";
import { demoTicket, getReachableMerchantCount, getTimeUntilDeparture } from "@/lib/demo-context";

export default function TicketDetailPage() {
  const router = useRouter();
  const timeLeft = getTimeUntilDeparture(demoTicket);
  const merchantCount = getReachableMerchantCount();
  return <main className="ticket-detail-page">
    <header className="detail-header"><button onClick={() => router.back()} aria-label="뒤로 가기">‹</button><h1>승차권</h1><span>14일 전</span><button onClick={() => router.push("/")} aria-label="닫기">×</button></header>
    <p className="notice">캡처한 화면은 유효한 승차권이 아닙니다. 정당 승차권은 이 문구가 표시되지 않습니다.</p>
    <div className="ticket-page-content"><TicketCard ticket={demoTicket} />
      <section className="recommendation-card"><div className="rec-copy"><p className="eyebrow">내 여정에 맞는 추천 <span>⌖ 부산역 주변</span></p><h2>서울행 출발 전 <em>{timeLeft}</em></h2><p>지금 방문·구매·배송 접수까지<br />가능한 매장을 확인해보세요.</p><button onClick={() => router.push("/a4")}>배송 가능한 지역매장 보기　›</button><small>부산역 주변 이용 가능 매장 <strong>{merchantCount}곳</strong></small></div><div className="rec-art" aria-hidden="true"><i className="bag"/><i className="box"/><i className="tower"/></div></section>
    </div><footer className="detail-footer"><span>‹ 이전</span><strong>전체 1 / 1⌃</strong><span>다음 ›</span></footer>
  </main>;
}
