export type MerchantRecord = {
  id: string; name: string; region: string; stationId: string | null; category: string;
  latitude: number | null; longitude: number | null; openingTime: string | null; closingTime: string | null;
  isPartner: boolean; railShippingEnabled: boolean; packagingAvailable: boolean; appOrderAvailable: boolean; createdAt: string;
};
export type MerchantPackageTypeRecord = { id: string; merchantId: string; name: string; lengthCm: number; widthCm: number; heightCm: number; maxWeightKg: number };
export type ProductRecord = { id: string; merchantId: string; name: string; category: string; basePrice: number; railShippingEnabled: boolean; stationPickupAvailable: boolean; quickDeliveryAvailable: boolean; shippingCutoffAt: string | null };
export type RailwayPackageTypeRecord = { id: string; name: string; lengthCm: number; widthCm: number; heightCm: number; maxWeightKg: number };
export type OrderItemInput = { productId?: string; productName: string; quantity: number; unitPrice: number };
export type OrderRecord = { id: string; source: string; merchantId: string; status: string; createdAt: string; items?: OrderItemInput[] };
export type CreateOrderInput = { id?: string; source: string; merchantId: string; status?: string; items: OrderItemInput[] };
export type ShippingOrderRecord = { id: string; orderId: string; recipientName: string; recipientPhone: string; deliveryMode: string; destinationStation: string | null; destinationAddress: string | null; selectedService: string | null; shippingFee: number; status: string; createdAt: string };
export type CreateShippingOrderInput = Omit<ShippingOrderRecord, "id" | "createdAt"> & { id?: string };
export type ShipmentRecord = { id: string; shippingOrderId: string; receiptNumber: string; trainNo: string | null; originStation: string; destinationStation: string; departureAt: string | null; arrivalAt: string | null; trackingStatus: string; currentStation: string | null; createdAt: string };
export type CreateShipmentInput = Omit<ShipmentRecord, "id" | "createdAt"> & { id?: string };
