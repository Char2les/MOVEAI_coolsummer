"use client";
import { usePathname, useRouter } from "next/navigation";
export function SellerDemoEntry() { const pathname = usePathname(); const router = useRouter(); if (pathname !== "/") return null; return <button onClick={() => router.push("/seller/package")} style={{ position: "fixed", right: "18px", bottom: "101px", zIndex: 10, padding: "9px 13px", border: "1px solid #bcd4f4", borderRadius: "16px", background: "#f3f8ff", color: "#1765cf", fontSize: "12px", fontWeight: 700, boxShadow: "0 3px 10px rgba(17,64,122,.16)" }}>판매원 QR 화면</button>; }
