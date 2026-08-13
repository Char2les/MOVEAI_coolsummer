"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ExploreHeader, JourneySummary } from "@/components/ExploreHeader";
import { filterMerchants } from "@/lib/merchants";
import { getDemoReachability } from "@/lib/demo-context";

export default function A4Page() {
  const router = useRouter();
  const [query, setQuery] = useState(""); const [filter, setFilter] = useState<"all" | "partner">("all"); const [selected, setSelected] = useState("samjin");
  useEffect(() => { const params = new URLSearchParams(window.location.search); setQuery(params.get("q") ?? ""); setFilter(params.get("filter") === "partner" ? "partner" : "all"); }, []);
  const reachableIds = useMemo(() => new Set(getDemoReachability().filter((result) => result.reachable).map((result) => result.merchantId)), []);
  const items = useMemo(() => filterMerchants(query, filter).filter((merchant) => reachableIds.has(merchant.id)), [query, filter, reachableIds]); const selectedMerchant = items.find((item) => item.id === selected) ?? items[0];
  const sync = (nextQuery = query, nextFilter = filter) => `?q=${encodeURIComponent(nextQuery)}&filter=${nextFilter}`;
  return <main className="explore-page"><ExploreHeader /><JourneySummary /><div className="view-tabs"><button className="active">지도</button><button onClick={() => router.push(`/a5${sync()}`)}>리스트</button></div><input className="search-box" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="매장명, 상품명으로 검색" aria-label="매장 검색" /><div className="filter-chips"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>전체</button><button className={filter === "partner" ? "active" : ""} onClick={() => setFilter("partner")}>제휴 매장</button><button>선물</button><button>먹거리</button><button>철도 배송 가능</button></div><div className="mock-map"><div className="map-road one"/><div className="map-road two"/><div className="map-station">부산역</div>{items.map((merchant, index) => <button key={merchant.id} className={`map-marker m${index + 1}`} onClick={() => setSelected(merchant.id)} aria-label={`${merchant.name} 선택`}>{merchant.isPartner ? "◆" : "●"}</button>)}</div>{selectedMerchant ? <section className="map-detail"><div className="map-detail-photo" style={{ background: selectedMerchant.color }} /><div><h2>{selectedMerchant.name}　›</h2><p>⌖ 부산역에서 {selectedMerchant.distance} · 도보 {selectedMerchant.walkingTime}</p><p>{selectedMerchant.representativeProduct}</p><div><span className="tag blue">철도 배송 가능</span>{selectedMerchant.isPartner && <span className="tag green">앱 주문 가능</span>}</div><button onClick={() => router.push(selectedMerchant.isPartner ? `/a6?id=${selectedMerchant.id}` : `/a7?id=${selectedMerchant.id}`)}>매장 상세　›</button></div></section> : <p className="empty-state">현재 방문·배송 가능한 매장이 없습니다.</p>}<p className="result-count">부산역 주변 이용 가능 매장 {items.length}곳　›</p></main>;
}
