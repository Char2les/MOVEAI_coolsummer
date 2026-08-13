import type { Merchant } from "@/lib/merchants";
import { merchantOperationalData, type MerchantOperationalData } from "./merchant-operational-data.ts";

export type ReachabilityReason = "OPEN_AND_REACHABLE" | "CLOSED" | "TOO_FAR" | "SHIPPING_CUTOFF" | "NOT_REGISTERED";
export type ReachabilityResult = {
  merchantId: string;
  reachable: boolean;
  requiredMinutes: number;
  remainingMinutes: number;
  reason?: ReachabilityReason;
};
export type ReachableMerchantsInput = {
  currentTime: Date;
  ticketDepartureTime: Date;
  currentLocation: string;
  originStation: string;
  merchants: readonly Merchant[];
  safetyBufferMinutes: number;
  operationalData?: Record<string, MerchantOperationalData>;
};

const minutesSinceMidnight = (value: Date) => value.getHours() * 60 + value.getMinutes();
const timeToMinutes = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

export function getReachableMerchants(input: ReachableMerchantsInput): ReachabilityResult[] {
  const remainingMinutes = Math.max(0, Math.floor((input.ticketDepartureTime.getTime() - input.currentTime.getTime()) / 60_000));
  const nowMinutes = minutesSinceMidnight(input.currentTime);
  const data = input.operationalData ?? merchantOperationalData;

  return input.merchants.map((merchant) => {
    const operational = data[merchant.id];
    if (!operational?.registered) return { merchantId: merchant.id, reachable: false, requiredMinutes: 0, remainingMinutes, reason: "NOT_REGISTERED" };
    const requiredMinutes = operational.travelFromOriginMinutes + operational.shoppingMinutes + operational.packagingMinutes + operational.returnToStationMinutes + input.safetyBufferMinutes;
    if (!operational.isOpen || !merchant.availableNow) return { merchantId: merchant.id, reachable: false, requiredMinutes, remainingMinutes, reason: "CLOSED" };
    if (!operational.railShippingEnabled || nowMinutes > timeToMinutes(operational.shippingCutoffTime)) return { merchantId: merchant.id, reachable: false, requiredMinutes, remainingMinutes, reason: "SHIPPING_CUTOFF" };
    if (requiredMinutes > remainingMinutes) return { merchantId: merchant.id, reachable: false, requiredMinutes, remainingMinutes, reason: "TOO_FAR" };
    return { merchantId: merchant.id, reachable: true, requiredMinutes, remainingMinutes, reason: "OPEN_AND_REACHABLE" };
  });
}

export const getReachableMerchantIds = (input: ReachableMerchantsInput) => new Set(getReachableMerchants(input).filter((result) => result.reachable).map((result) => result.merchantId));
