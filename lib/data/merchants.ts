import { merchants } from "@/lib/merchants";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireData, useSupabaseData } from "./source";
import type { MerchantPackageTypeRecord, MerchantRecord } from "./types";

const rowToMerchant = (row: any): MerchantRecord => ({ id: row.id, name: row.name, region: row.region, stationId: row.station_id, category: row.category, latitude: row.latitude, longitude: row.longitude, openingTime: row.opening_time, closingTime: row.closing_time, isPartner: row.is_partner, railShippingEnabled: row.rail_shipping_enabled, packagingAvailable: row.packaging_available, appOrderAvailable: row.app_order_available, createdAt: row.created_at });
const rowToPackage = (row: any): MerchantPackageTypeRecord => ({ id: row.id, merchantId: row.merchant_id, name: row.name, lengthCm: Number(row.length_cm), widthCm: Number(row.width_cm), heightCm: Number(row.height_cm), maxWeightKg: Number(row.max_weight_kg) });

export interface MerchantRepository { getMerchants(): Promise<MerchantRecord[]>; getMerchantById(id: string): Promise<MerchantRecord | null>; getMerchantPackageTypes(merchantId: string): Promise<MerchantPackageTypeRecord[]>; }

export class SupabaseMerchantRepository implements MerchantRepository {
  async getMerchants() { const { data, error } = await getSupabaseServerClient().from("merchants").select("*").order("name"); return requireData(data, error).map(rowToMerchant); }
  async getMerchantById(id: string) { const { data, error } = await getSupabaseServerClient().from("merchants").select("*").eq("id", id).maybeSingle(); if (error) throw new Error(error.message); return data ? rowToMerchant(data) : null; }
  async getMerchantPackageTypes(merchantId: string) { const { data, error } = await getSupabaseServerClient().from("merchant_package_types").select("*").eq("merchant_id", merchantId).order("id"); return requireData(data, error).map(rowToPackage); }
}

export class MockMerchantRepository implements MerchantRepository {
  private records = merchants.map((merchant): MerchantRecord => ({ id: merchant.id === "samjin" ? "samjin-busan" : merchant.id, name: merchant.name, region: "부산", stationId: "BUSAN", category: merchant.category, latitude: null, longitude: null, openingTime: merchant.hours.split(" ~ ")[0] ?? null, closingTime: merchant.hours.split(" ~ ")[1] ?? null, isPartner: merchant.isPartner, railShippingEnabled: merchant.railShippingEnabled, packagingAvailable: merchant.packagingAvailable, appOrderAvailable: merchant.appOrderAvailable, createdAt: "2026-08-13T00:00:00+09:00" }));
  async getMerchants() { return this.records; }
  async getMerchantById(id: string) { return this.records.find((merchant) => merchant.id === id || (id === "samjin" && merchant.id === "samjin-busan")) ?? null; }
  async getMerchantPackageTypes(merchantId: string) { return merchantId === "samjin-busan" || merchantId === "samjin" ? [{ id: "STORE_BOX_S", merchantId: "samjin-busan", name: "택배 박스 S", lengthCm: 20, widthCm: 15, heightCm: 10, maxWeightKg: 2 }, { id: "STORE_BOX_M", merchantId: "samjin-busan", name: "택배 박스 M", lengthCm: 30, widthCm: 22, heightCm: 18, maxWeightKg: 5 }, { id: "STORE_BOX_L", merchantId: "samjin-busan", name: "택배 박스 L", lengthCm: 40, widthCm: 30, heightCm: 25, maxWeightKg: 10 }] : []; }
}

const repository = () => useSupabaseData() ? new SupabaseMerchantRepository() : new MockMerchantRepository();
export const getMerchants = () => repository().getMerchants();
export const getMerchantById = (id: string) => repository().getMerchantById(id);
export const getMerchantPackageTypes = (merchantId: string) => repository().getMerchantPackageTypes(merchantId);
