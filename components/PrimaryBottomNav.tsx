"use client";

import { useRouter } from "next/navigation";

export function PrimaryBottomNav({ active }: { active: "home" | "tickets" }) {
  const router = useRouter();
  return <nav className="bottom-nav korail-bottom-nav" aria-label="주요 메뉴">
    <button type="button" className={active === "home" ? "on" : ""} onClick={() => router.push("/")}><span>➤</span><small>홈</small></button>
    <button type="button"><span>⌂</span><small>이동 · 편의</small></button>
    <button type="button"><span>▣</span><small>여행</small></button>
    <button type="button" className={active === "tickets" ? "on" : ""} onClick={() => router.push("/tickets")}><span>▤</span><small>나의 티켓</small></button>
    <button type="button" onClick={() => router.push("/menu")}><span>☷</span><small>전체메뉴</small></button>
  </nav>;
}
