import type { Merchant } from "@/lib/merchants";
import { merchantImageSrc } from "@/lib/merchant-assets";

export function MerchantCard({ merchant, onClick }: { merchant: Merchant; onClick?: () => void }) {
  return <button type="button" className="merchant-card" onClick={onClick}><div className="merchant-photo"><img src={merchantImageSrc[merchant.id]} alt="" /><span>{merchant.category}</span></div><div className="merchant-card-copy"><div className="merchant-title"><strong>{merchant.name}</strong><span>›</span></div><p>⌖ {merchant.distance} · 도보 {merchant.walkingTime}</p><div className="merchant-tags">{merchant.isPartner && merchant.railShippingEnabled && <span className="tag blue">철도배송 가능</span>}{merchant.isPartner && <span className="tag green">앱 주문 가능</span>}</div><p className="merchant-meta">◷ 오늘 <em>{merchant.closing} 마감</em>　·　{merchant.representativeProduct}</p><div className="category-pill">{merchant.category}</div></div></button>;
}
