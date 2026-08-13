export type MerchantPackageType = { id: "STORE_BOX_S" | "STORE_BOX_M" | "STORE_BOX_L"; merchantId: string; label: "S" | "M" | "L"; displayName: string; lengthCm: number; widthCm: number; heightCm: number; maxWeightKg: number; };
export type ShippingPackagePayload = { orderId: string; merchantId: string; orderItems: { productId: string; productName: string; quantity: number }[]; packages: { merchantPackageTypeId: MerchantPackageType["id"]; quantity: number }[]; productCategory: string; iceBoxPackaging: boolean; };
export const demoMerchant = { id: "M001", name: "빵부장 부산역점" };
export const demoOrder = { orderId: "ORDER-001", merchantId: demoMerchant.id, orderItems: [{ productId: "P001", productName: "부산 명물 빵 세트", quantity: 2 }] };
export const merchantPackageTypes: MerchantPackageType[] = [
  { id: "STORE_BOX_S", merchantId: "M001", label: "S", displayName: "택배 박스 S", lengthCm: 20, widthCm: 15, heightCm: 10, maxWeightKg: 2 },
  { id: "STORE_BOX_M", merchantId: "M001", label: "M", displayName: "택배 박스 M", lengthCm: 30, widthCm: 22, heightCm: 18, maxWeightKg: 5 },
  { id: "STORE_BOX_L", merchantId: "M001", label: "L", displayName: "택배 박스 L", lengthCm: 40, widthCm: 30, heightCm: 25, maxWeightKg: 10 },
];
const toBase64Url = (value: string) => { const bytes = new TextEncoder().encode(value); let binary = ""; bytes.forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, ""); };
const fromBase64Url = (value: string) => { const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - value.length % 4) % 4); const binary = atob(padded); return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0))); };
export const encodeShippingPayload = (payload: ShippingPackagePayload) => toBase64Url(JSON.stringify(payload));
export function decodeShippingPayload(encoded: string): ShippingPackagePayload | null { try { const value = JSON.parse(fromBase64Url(encoded)) as ShippingPackagePayload; return value.orderId && value.merchantId && Array.isArray(value.orderItems) && Array.isArray(value.packages) ? value : null; } catch { return null; } }
export function createShippingStartUrl(payload: ShippingPackagePayload) { const configuredUrl = process.env.NEXT_PUBLIC_APP_URL; const origin = typeof window !== "undefined" ? window.location.origin : configuredUrl || "http://localhost:3000"; return `${origin}/shipping/start?payload=${encodeURIComponent(encodeShippingPayload(payload))}`; }
