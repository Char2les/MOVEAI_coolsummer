"use client";

import { useRouter } from "next/navigation";
import { TicketCard } from "@/components/TicketCard";
import { demoTicket, secondaryTicket } from "@/lib/demo-context";
import { PrimaryBottomNav } from "@/components/PrimaryBottomNav";

export function MyTicketsScreen() { const router = useRouter(); return <main className="app-shell ticket-list-page"><header className="list-header"><div><button type="button" className="active">이용 가능</button><button type="button">구입 이력</button></div><button type="button" aria-label="장바구니" className="cart">⌑</button></header><nav className="filter-row" aria-label="티켓 종류"><span className="chosen">전체 2</span><span>승차권 2</span><span>이용권</span><span>정기권</span><span>N카드</span></nav><button type="button" className="ticket-click-area" onClick={() => router.push("/tickets/demo")} aria-label="2026년 8월 27일 부산에서 서울로 가는 승차권 상세 보기"><TicketCard ticket={demoTicket} compact /></button><button type="button" className="ticket-click-area secondary-ticket" onClick={() => router.push("/tickets/secondary")} aria-label="2026년 9월 3일 서울에서 부산으로 가는 승차권 상세 보기"><TicketCard ticket={secondaryTicket} compact /></button><PrimaryBottomNav active="tickets" /></main>; }
