"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ExploreHeader, JourneySummary } from "@/components/ExploreHeader";
import { MerchantCard } from "@/components/MerchantCard";
import { filterMerchants } from "@/lib/merchants";
import { getDemoReachability } from "@/lib/demo-context";

export default function A5Page() {
  const router = useRouter(); const [query, setQuery] = useState(""); const [filter, setFilter] = useState<"all" | "partner">("all"); useEffect(() => { const params = new URLSearchParams(window.location.search); setQuery(params.get("q") ?? ""); setFilter(params.get("filter") === "partner" ? "partner" : "all"); }, []); const reachableIds = useMemo(() => new Set(getDemoReachability().filter((result) => result.reachable).map((result) => result.merchantId)), []); const items = useMemo(() => filterMerchants(query, filter).filter((merchant) => reachableIds.has(merchant.id)), [query, filter, reachableIds]); const sync = `?q=${encodeURIComponent(query)}&filter=${filter}`;
  return <main className="explore-page list-explore"><ExploreHeader /><JourneySummary /><div className="view-tabs"><button onClick={() => router.push(`/a4${sync}`)}>지도</button><button className="active">리스트</button></div><input className="search-box" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="매장명, 상품명으로 검색" aria-label="매장 검색" /><div className="filter-chips"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>전체</button><button className={filter === "partner" ? "active" : ""} onClick={() => setFilter("partner")}>제휴 매장</button><button>철도배송 가능</button><button>당일 배송</button><button>포장 가능</button></div><div className="merchant-list">{items.map((merchant) => <MerchantCard key={merchant.id} merchant={merchant} onClick={() => router.push(merchant.isPartner ? `/a6?id=${merchant.id}` : `/a7?id=${merchant.id}`)} />)}{items.length === 0 && <p className="empty-state">검색 조건에 맞는 매장이 없습니다.</p>}</div><p className="shipping-info">ⓘ 철도배송 안내　매장에서 구매한 상품을 열차 출발 전까지 접수하면 도착역 인근에서 수령할 수 있어요.</p></main>;
}
