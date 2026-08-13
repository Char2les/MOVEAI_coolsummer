/**
 * Temporary operational metadata for the MVP.  This deliberately lives outside
 * the display merchant model so it can later be replaced by an operations API
 * without requiring a database/schema change.
 */
export type MerchantOperationalData = {
  registered: boolean;
  isOpen: boolean;
  railShippingEnabled: boolean;
  travelFromOriginMinutes: number;
  shoppingMinutes: number;
  packagingMinutes: number;
  returnToStationMinutes: number;
  /** Daily local time at which a shipment can no longer be accepted. */
  shippingCutoffTime: string;
};

export const merchantOperationalData: Record<string, MerchantOperationalData> = {
  samjin: { registered: true, isOpen: true, railShippingEnabled: true, travelFromOriginMinutes: 2, shoppingMinutes: 12, packagingMinutes: 8, returnToStationMinutes: 2, shippingCutoffTime: "18:30" },
  leeheung: { registered: true, isOpen: true, railShippingEnabled: true, travelFromOriginMinutes: 4, shoppingMinutes: 15, packagingMinutes: 8, returnToStationMinutes: 4, shippingCutoffTime: "19:00" },
  giftshop: { registered: true, isOpen: true, railShippingEnabled: true, travelFromOriginMinutes: 6, shoppingMinutes: 12, packagingMinutes: 7, returnToStationMinutes: 6, shippingCutoffTime: "20:00" },
  haeundae: { registered: true, isOpen: true, railShippingEnabled: true, travelFromOriginMinutes: 6, shoppingMinutes: 18, packagingMinutes: 10, returnToStationMinutes: 6, shippingCutoffTime: "19:30" },
  busanbrew: { registered: true, isOpen: true, railShippingEnabled: true, travelFromOriginMinutes: 8, shoppingMinutes: 14, packagingMinutes: 8, returnToStationMinutes: 8, shippingCutoffTime: "20:00" },
  market: { registered: true, isOpen: true, railShippingEnabled: true, travelFromOriginMinutes: 10, shoppingMinutes: 15, packagingMinutes: 8, returnToStationMinutes: 10, shippingCutoffTime: "19:00" },
  seaside: { registered: true, isOpen: true, railShippingEnabled: true, travelFromOriginMinutes: 12, shoppingMinutes: 12, packagingMinutes: 7, returnToStationMinutes: 12, shippingCutoffTime: "18:00" },
  stationery: { registered: true, isOpen: true, railShippingEnabled: true, travelFromOriginMinutes: 14, shoppingMinutes: 12, packagingMinutes: 7, returnToStationMinutes: 14, shippingCutoffTime: "19:00" },
};
