import { merchants, type Merchant } from "@/lib/merchants";
import { products, stores, type Product, type Store } from "@/lib/commerce";
import type { MerchantRecord, ProductRecord } from "./types";

const merchantFallback = (id: string) => merchants.find((merchant) => merchant.id === id || (id === "samjin-busan" && merchant.id === "samjin"));

export const toMerchantView = (record: MerchantRecord): Merchant => {
  const fallback = merchantFallback(record.id);
  const hours = [record.openingTime, record.closingTime].filter(Boolean).join(" ~ ") || fallback?.hours || "운영시간 확인 필요";
  return {
    id: record.id === "samjin-busan" ? "samjin" : record.id,
    name: record.name,
    description: fallback?.description ?? `${record.region} ${record.category} 매장`,
    category: record.category,
    distance: fallback?.distance ?? "거리 확인 필요",
    walkingTime: fallback?.walkingTime ?? "시간 확인 필요",
    hours,
    closing: record.closingTime ?? fallback?.closing ?? "-",
    representativeProduct: fallback?.representativeProduct ?? "대표 상품 준비 중",
    productPrice: fallback?.productPrice ?? "",
    isPartner: record.isPartner,
    railShippingEnabled: record.railShippingEnabled,
    packagingAvailable: record.packagingAvailable,
    appOrderAvailable: record.appOrderAvailable,
    availableNow: fallback?.availableNow ?? true,
    color: fallback?.color ?? "#657d9a",
  };
};

const productFallback = (id: string) => products.find((product) => product.id === id);
const storeFallback = (id: string) => stores.find((store) => store.id === id);

export const toProductView = (record: ProductRecord): Product => {
  const fallback = productFallback(record.id);
  return {
    id: record.id,
    storeId: record.merchantId,
    name: record.name,
    category: record.category,
    basePrice: record.basePrice,
    images: fallback?.images ?? ["📦"],
    rating: fallback?.rating ?? 0,
    reviewCount: fallback?.reviewCount ?? 0,
    popularityScore: fallback?.popularityScore ?? 0,
    estimatedShippingFee: fallback?.estimatedShippingFee ?? 0,
    estimatedArrivalAt: fallback?.estimatedArrivalAt ?? "배송 정보 확인 필요",
    stationPickupAvailable: record.stationPickupAvailable,
    quickDeliveryAvailable: record.quickDeliveryAvailable,
    productOptions: fallback?.productOptions ?? [{ id: "basic", name: "기본", price: 0 }],
    packagingOptions: fallback?.packagingOptions ?? [{ id: "none", name: "기본 포장", price: 0 }],
    shippingCutoffAt: record.shippingCutoffAt ?? fallback?.shippingCutoffAt ?? "2099-12-31T23:59:59+09:00",
    description: fallback?.description ?? `${record.name} 상품입니다.`,
  };
};

export const toStoreViews = (merchantRecords: MerchantRecord[]): Store[] => merchantRecords
  .filter((merchant) => merchant.appOrderAvailable)
  .map((merchant) => ({
    id: merchant.id,
    name: merchant.name,
    region: merchant.region,
    locationText: storeFallback(merchant.id)?.locationText ?? `${merchant.stationId ?? merchant.region} 인근`,
    partnershipType: storeFallback(merchant.id)?.partnershipType ?? (merchant.isPartner ? "철도배송 제휴" : "지역 상점"),
    railDeliveryAvailable: merchant.railShippingEnabled,
    appOrderAvailable: merchant.appOrderAvailable,
  }));
