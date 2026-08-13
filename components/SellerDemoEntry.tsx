"use client";
import { useRouter } from "next/navigation";
export function SellerDemoEntry() { const router = useRouter(); return <button className="seller-demo-entry" onClick={() => router.push("/seller/package")}>판매원 QR 화면</button>; }
