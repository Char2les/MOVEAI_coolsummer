"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShippingQr } from "@/components/ShippingQr";
import { createShippingStartUrl, ShippingPackagePayload } from "@/lib/shipping-package";
export default function SellerQrPage() { const router = useRouter(); const [payload, setPayload] = useState<ShippingPackagePayload | null>(null); const [refreshKey, setRefreshKey] = useState(0); useEffect(() => { const stored = sessionStorage.getItem("shipping-package-payload"); if (stored) setPayload(JSON.parse(stored) as ShippingPackagePayload); else router.replace("/seller/package"); }, [router]); if (!payload) return null; return <main className="seller-shell seller-qr-page"><header className="seller-header"><button aria-label="상품 정보 입력으로 돌아가기" onClick={() => router.push("/seller/package")}>‹</button><h1>고객용 QR코드</h1><span /></header><section className="qr-content"><h2>고객님에게 QR코드를<br />제시해주세요.</h2><ShippingQr value={createShippingStartUrl(payload)} refreshKey={refreshKey} /><button className="regenerate" onClick={() => setRefreshKey((key) => key + 1)}>↻ <span>QR코드 재생성</span></button><p>상품을 포장하여 출력된 운송장을 붙여주세요.</p></section></main>; }
