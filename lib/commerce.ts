export type Store = { id: string; name: string; region: string; locationText: string; partnershipType: string; railDeliveryAvailable: boolean; appOrderAvailable: boolean };
export type ProductOption = { id: string; name: string; price: number };
export type ProductPackagingOption = { id: string; name: string; price: number };
export type Product = { id: string; storeId: string; name: string; category: string; basePrice: number; images: string[]; rating: number; reviewCount: number; popularityScore: number; estimatedShippingFee: number; estimatedArrivalAt: string; stationPickupAvailable: boolean; quickDeliveryAvailable: boolean; productOptions: ProductOption[]; packagingOptions: ProductPackagingOption[]; shippingCutoffAt: string; description: string };
export type CartItem = { key: string; productId: string; storeId: string; productName: string; image: string; selectedOption?: string; packagingOption?: string; quantity: number; unitPrice: number };
export type RecentTrip = { region: string; visitedAt: string };
export type Region = { name: string; emoji: string; description: string };
export type ThemeExhibition = { id: string; title: string; subtitle: string; query: string; emoji: string };

export const stores: Store[] = [
  { id: "samjin-busan", name: "삼진어묵 부산역점", region: "부산", locationText: "부산역 3번 출구 도보 2분", partnershipType: "철도배송 제휴", railDeliveryAvailable: true, appOrderAvailable: true },
  { id: "sungsimdang-daejeon", name: "성심당 대전역점", region: "대전", locationText: "대전역 맞이방 2층", partnershipType: "철도배송 제휴", railDeliveryAvailable: true, appOrderAvailable: true },
  { id: "gangneung-coffee", name: "강릉 커피거리", region: "강릉", locationText: "강릉역 광장", partnershipType: "지역상생", railDeliveryAvailable: true, appOrderAvailable: true },
];

const common = { productOptions: [{ id: "basic", name: "기본 세트", price: 0 }, { id: "premium", name: "프리미엄 세트", price: 6000 }], packagingOptions: [{ id: "gift", name: "선물용 개별포장", price: 2000 }], shippingCutoffAt: "2026-08-13T19:00:00+09:00" };
export const products: Product[] = [
  { id: "samjin-sunmul", storeId: "samjin-busan", name: "삼진어묵 선물세트", category: "먹거리", basePrice: 18000, images: ["🍥", "🍢", "🎁"], rating: 4.9, reviewCount: 210, popularityScore: 98, estimatedShippingFee: 0, estimatedArrivalAt: "오늘 18:30", stationPickupAvailable: true, quickDeliveryAvailable: false, description: "부산 여행의 맛을 그대로 담은 삼진어묵 대표 선물세트입니다.", ...common },
  { id: "samjin-premium", storeId: "samjin-busan", name: "프리미엄 어묵세트", category: "선물", basePrice: 28000, images: ["🎁", "🍥", "🥢"], rating: 4.8, reviewCount: 164, popularityScore: 91, estimatedShippingFee: 3000, estimatedArrivalAt: "내일 오전", stationPickupAvailable: true, quickDeliveryAvailable: true, description: "다양한 어묵을 넉넉하게 즐기는 프리미엄 구성입니다.", ...common },
  { id: "samjin-jonghap", storeId: "samjin-busan", name: "종합 선물세트", category: "선물", basePrice: 35000, images: ["🍡", "🎀", "🍥"], rating: 4.7, reviewCount: 83, popularityScore: 82, estimatedShippingFee: 2500, estimatedArrivalAt: "내일", stationPickupAvailable: false, quickDeliveryAvailable: true, description: "소중한 분께 전하는 부산 어묵 종합 선물세트입니다.", ...common },
  { id: "sungsimdang-twigim", storeId: "sungsimdang-daejeon", name: "튀김소보로 선물세트", category: "디저트", basePrice: 18000, images: ["🥯", "🍞", "🎁"], rating: 4.9, reviewCount: 320, popularityScore: 99, estimatedShippingFee: 3000, estimatedArrivalAt: "오늘 18:30", stationPickupAvailable: true, quickDeliveryAvailable: false, description: "대전의 명물 튀김소보로를 선물용으로 준비했습니다.", ...common },
  { id: "sungsimdang-cookie", storeId: "sungsimdang-daejeon", name: "대전 오리지널 쿠키 세트", category: "디저트", basePrice: 15300, images: ["🍪", "🧁", "🎀"], rating: 4.6, reviewCount: 119, popularityScore: 87, estimatedShippingFee: 0, estimatedArrivalAt: "내일", stationPickupAvailable: false, quickDeliveryAvailable: false, description: "바삭하고 고소한 대전 오리지널 쿠키 모음입니다.", ...common },
  { id: "sungsimdang-pie", storeId: "sungsimdang-daejeon", name: "보문산 파이 세트", category: "먹거리", basePrice: 21000, images: ["🥧", "🍰", "🎁"], rating: 4.8, reviewCount: 98, popularityScore: 89, estimatedShippingFee: 3500, estimatedArrivalAt: "내일 오전", stationPickupAvailable: false, quickDeliveryAvailable: true, description: "대전 보문산의 이름을 담은 고소한 파이 세트입니다.", ...common },
  { id: "gangneung-drip", storeId: "gangneung-coffee", name: "강릉 드립백 커피", category: "먹거리", basePrice: 13000, images: ["☕", "🫘", "🎁"], rating: 4.7, reviewCount: 76, popularityScore: 77, estimatedShippingFee: 3000, estimatedArrivalAt: "내일", stationPickupAvailable: true, quickDeliveryAvailable: false, description: "강릉 바다의 여유를 담은 드립백 커피입니다.", ...common },
];
export const recentTrip: RecentTrip = { region: "부산", visitedAt: "2026-08-01" };
export const regions: Region[] = [{ name: "부산", emoji: "🌊", description: "바다의 맛" }, { name: "대전", emoji: "🚄", description: "빵의 도시" }, { name: "강릉", emoji: "☕", description: "커피 여행" }, { name: "전주", emoji: "🍲", description: "맛의 고장" }, { name: "경주", emoji: "🏛️", description: "천년의 선물" }];
export const themes: ThemeExhibition[] = [{ id: "parents", title: "부모님 선물 추천", subtitle: "정성을 담은 지역의 맛", query: "선물", emoji: "🎁" }, { id: "travel", title: "여행의 맛, 다시 만나기", subtitle: "기억을 집으로 가져가세요", query: "부산", emoji: "🧳" }, { id: "summer", title: "여름 피크닉 상품", subtitle: "기차 여행과 잘 어울리는 선택", query: "디저트", emoji: "🧺" }];
export const categories = ["전체", "먹거리", "디저트", "선물", "공예·기념품"];
export const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
export const getStore = (id: string) => stores.find((store) => store.id === id);
export const getProduct = (id: string) => products.find((product) => product.id === id);
export const searchProducts = (query: string) => { const q = query.trim().toLowerCase(); if (!q) return []; return products.filter((p) => [p.name, p.category, getStore(p.storeId)?.region, getStore(p.storeId)?.name].some((value) => value?.toLowerCase().includes(q))); };
export const createOnlineShippingEntryUrl = (items: CartItem[]) => { const payload = { version: 1, source: "ONLINE_CART", orderId: `online-${Date.now()}`, merchantId: items[0]?.storeId ?? "ONLINE_CART", orderItems: items.map((i) => ({ productId: i.productId, productName: i.productName, quantity: i.quantity, unitPrice: i.unitPrice, selectedOption: i.selectedOption, packagingOption: i.packagingOption })) }; return `/shipping/start?payload=${encodeURIComponent(JSON.stringify(payload))}`; };
export const getShippingCutoffStatus = (cutoff: string, demoNow = new Date("2026-08-13T18:22:00+09:00")) => { const minutes = Math.max(0, Math.ceil((new Date(cutoff).getTime() - demoNow.getTime()) / 60000)); return { status: minutes === 0 ? "CLOSED" : minutes <= 30 ? "CLOSING_SOON" : "AVAILABLE", minutes }; };
