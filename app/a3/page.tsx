"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function A3Page() {
  const router = useRouter();
  const [highIntent, setHighIntent] = useState(true);
  const [visible, setVisible] = useState(true);
  return <main className="lock-screen"><div className="lock-status"><span>LG U+</span><span>▮▮▮ LTE　40</span></div><p className="lock-date">8월 13일 (목)</p><div className="lock-time">03:27</div><div className="lock-bottom"><span>▐</span><b>● 4개의 알림</b><span>◉</span></div><div className="intent-toggle"><button className={highIntent ? "selected" : ""} onClick={() => { setHighIntent(true); setVisible(true); }}>High Intent</button><button className={!highIntent ? "selected" : ""} onClick={() => { setHighIntent(false); setVisible(false); }}>Low Intent</button></div>{highIntent && visible && <section className="push-card"><div className="push-head"><span className="korail-icon">K</span><strong>코레일</strong><span>지금　⌄</span></div><h1>짐은 두고 가볍게 돌아가세요</h1><p>지금 구매한 상품을 서울까지 배송할 수 있어요.</p><small>부산역 주변 배송 가능한 지역매장을 확인해보세요.</small><div className="push-actions"><button onClick={() => router.push("/a4")}>배송 가능한 지역매장 보기　›</button><button onClick={() => setVisible(false)}>닫기</button></div></section>}</main>;
}
