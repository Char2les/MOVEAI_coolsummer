"use client";
import { useEffect, useRef } from "react";
import QRCode from "qrcode";
export function ShippingQr({ value, refreshKey }: { value: string; refreshKey: number }) { const canvasRef = useRef<HTMLCanvasElement>(null); useEffect(() => { if (canvasRef.current) QRCode.toCanvas(canvasRef.current, value, { width: 252, margin: 1, errorCorrectionLevel: "M" }); }, [value, refreshKey]); return <div className="seller-qr-frame"><canvas ref={canvasRef} aria-label="고객 배송 주문 접수 QR코드" /></div>; }
