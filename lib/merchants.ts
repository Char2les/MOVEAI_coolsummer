export type Merchant = {
  id: string;
  name: string;
  description: string;
  category: string;
  distance: string;
  walkingTime: string;
  hours: string;
  closing: string;
  representativeProduct: string;
  productPrice: string;
  isPartner: boolean;
  railShippingEnabled: boolean;
  packagingAvailable: boolean;
  appOrderAvailable: boolean;
  availableNow: boolean;
  color: string;
};

export const merchants: Merchant[] = [
  { id: "samjin", name: "삼진어묵 부산역점", description: "부산 대표 어묵 전문점", category: "어묵", distance: "120m", walkingTime: "2분", hours: "06:30 ~ 20:00", closing: "18:30", representativeProduct: "부산 대표 어묵 선물세트", productPrice: "20,000원", isPartner: true, railShippingEnabled: true, packagingAvailable: true, appOrderAvailable: true, availableNow: true, color: "#9a6246" },
  { id: "leeheung", name: "이흥용과자점", description: "부산에서 만나는 클래식 베이커리", category: "빵/디저트", distance: "250m", walkingTime: "4분", hours: "08:00 ~ 21:00", closing: "19:00", representativeProduct: "부산 명물 구모마 파이", productPrice: "12,000원", isPartner: true, railShippingEnabled: true, packagingAvailable: true, appOrderAvailable: true, availableNow: true, color: "#775d3e" },
  { id: "giftshop", name: "부산기념품 편집샵", description: "부산 지역 기념품과 로컬 굿즈", category: "기념품", distance: "380m", walkingTime: "6분", hours: "10:00 ~ 20:00", closing: "20:00", representativeProduct: "부산 감성 굿즈 배송 가능", productPrice: "8,000원", isPartner: false, railShippingEnabled: true, packagingAvailable: true, appOrderAvailable: false, availableNow: true, color: "#b18b68" },
  { id: "haeundae", name: "해운대 달맞이꿀", description: "부산의 맛을 담은 선물 전문점", category: "식품", distance: "1.4km", walkingTime: "차량 6분", hours: "09:00 ~ 20:00", closing: "19:30", representativeProduct: "벌꿀/수제청 선물세트", productPrice: "25,000원", isPartner: true, railShippingEnabled: true, packagingAvailable: true, appOrderAvailable: true, availableNow: true, color: "#9a7657" },
  { id: "busanbrew", name: "부산브루어리", description: "지역의 풍미를 큐레이션합니다", category: "식품", distance: "600m", walkingTime: "8분", hours: "11:00 ~ 21:00", closing: "20:00", representativeProduct: "로컬 커피 선물팩", productPrice: "15,000원", isPartner: true, railShippingEnabled: true, packagingAvailable: true, appOrderAvailable: true, availableNow: true, color: "#5c6e5a" },
  { id: "market", name: "부산역 로컬마켓", description: "여행의 기분을 담아가는 마켓", category: "기념품", distance: "750m", walkingTime: "10분", hours: "10:00 ~ 20:00", closing: "19:00", representativeProduct: "로컬 선물세트", productPrice: "25,000원", isPartner: false, railShippingEnabled: true, packagingAvailable: true, appOrderAvailable: false, availableNow: true, color: "#657d9a" },
  { id: "seaside", name: "바다소리 상점", description: "부산 바다를 닮은 작은 상점", category: "굿즈", distance: "900m", walkingTime: "12분", hours: "10:00 ~ 19:00", closing: "18:00", representativeProduct: "부산 캐릭터 키링", productPrice: "12,000원", isPartner: false, railShippingEnabled: true, packagingAvailable: true, appOrderAvailable: false, availableNow: true, color: "#4e7992" },
  { id: "stationery", name: "초량 문구상회", description: "여행자의 일상을 위한 문구", category: "굿즈", distance: "1.1km", walkingTime: "14분", hours: "11:00 ~ 20:00", closing: "19:00", representativeProduct: "부산 감성 엽서 세트", productPrice: "8,000원", isPartner: false, railShippingEnabled: true, packagingAvailable: true, appOrderAvailable: false, availableNow: true, color: "#8a6d96" },
];

export const getMerchant = (id: string) => merchants.find((merchant) => merchant.id === id) ?? merchants[0];
export const filterMerchants = (query: string, filter: "all" | "partner" = "all", source: readonly Merchant[] = merchants) => source.filter((merchant) => {
  const matchesQuery = !query || [merchant.name, merchant.category, merchant.representativeProduct].some((value) => value.includes(query));
  return matchesQuery && (filter === "all" || merchant.isPartner);
});
