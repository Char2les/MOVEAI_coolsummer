"use client";

import { usePathname, useRouter } from "next/navigation";

export function HomeEntry() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/" || pathname === "/seller/package") return null;

  return <button type="button" className="global-home-entry" aria-label="홈으로 돌아가기" onClick={() => router.push("/")}>⌂ <span>홈</span></button>;
}
