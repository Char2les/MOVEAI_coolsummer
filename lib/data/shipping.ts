import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireData, useSupabaseData } from "./source";
import type { CreateShipmentInput, CreateShippingOrderInput, ShipmentRecord, ShippingOrderRecord } from "./types";

const rowToShippingOrder = (row: any): ShippingOrderRecord => ({ id: row.id, orderId: row.order_id, recipientName: row.recipient_name, recipientPhone: row.recipient_phone, deliveryMode: row.delivery_mode, destinationStation: row.destination_station, destinationAddress: row.destination_address, selectedService: row.selected_service, shippingFee: Number(row.shipping_fee), status: row.status, createdAt: row.created_at });
const rowToShipment = (row: any): ShipmentRecord => ({ id: row.id, shippingOrderId: row.shipping_order_id, receiptNumber: row.receipt_number, trainNo: row.train_no, originStation: row.origin_station, destinationStation: row.destination_station, departureAt: row.departure_at, arrivalAt: row.arrival_at, trackingStatus: row.tracking_status, currentStation: row.current_station, createdAt: row.created_at });
export interface ShippingRepository { createShippingOrder(input: CreateShippingOrderInput): Promise<ShippingOrderRecord>; createShipment(input: CreateShipmentInput): Promise<ShipmentRecord>; getShipment(id: string): Promise<ShipmentRecord | null>; }
export class SupabaseShippingRepository implements ShippingRepository {
  async createShippingOrder(input: CreateShippingOrderInput) { const { data, error } = await getSupabaseServerClient().from("shipping_orders").insert({ ...(input.id ? { id: input.id } : {}), order_id: input.orderId, recipient_name: input.recipientName, recipient_phone: input.recipientPhone, delivery_mode: input.deliveryMode, destination_station: input.destinationStation, destination_address: input.destinationAddress, selected_service: input.selectedService, shipping_fee: input.shippingFee, status: input.status }).select("*").single(); return rowToShippingOrder(requireData(data, error)); }
  async createShipment(input: CreateShipmentInput) { const { data, error } = await getSupabaseServerClient().from("shipments").insert({ ...(input.id ? { id: input.id } : {}), shipping_order_id: input.shippingOrderId, receipt_number: input.receiptNumber, train_no: input.trainNo, origin_station: input.originStation, destination_station: input.destinationStation, departure_at: input.departureAt, arrival_at: input.arrivalAt, tracking_status: input.trackingStatus, current_station: input.currentStation }).select("*").single(); return rowToShipment(requireData(data, error)); }
  async getShipment(id: string) { const { data, error } = await getSupabaseServerClient().from("shipments").select("*").eq("id", id).maybeSingle(); if (error) throw new Error(error.message); return data ? rowToShipment(data) : null; }
}
export class MockShippingRepository implements ShippingRepository {
  private shipments: ShipmentRecord[] = [{ id: "SHP-20260814-005", shippingOrderId: "SHIPPING-ORDER-001", receiptNumber: "20260813-0004821", trainNo: "KTX 005", originStation: "부산역", destinationStation: "서울역", departureAt: "2026-08-14T09:00:00+09:00", arrivalAt: "2026-08-14T11:42:00+09:00", trackingStatus: "IN_TRANSIT", currentStation: "대전역", createdAt: "2026-08-13T14:20:00+09:00" }];
  async createShippingOrder(input: CreateShippingOrderInput) { return { ...input, id: input.id ?? `mock-shipping-order-${Date.now()}`, createdAt: new Date().toISOString() }; }
  async createShipment(input: CreateShipmentInput) { const shipment: ShipmentRecord = { ...input, id: input.id ?? `mock-shipment-${Date.now()}`, createdAt: new Date().toISOString() }; this.shipments.unshift(shipment); return shipment; }
  async getShipment(id: string) { return this.shipments.find((shipment) => shipment.id === id) ?? null; }
}
const repository = () => useSupabaseData() ? new SupabaseShippingRepository() : new MockShippingRepository();
export const createShippingOrder = (input: CreateShippingOrderInput) => repository().createShippingOrder(input);
export const createShipment = (input: CreateShipmentInput) => repository().createShipment(input);
export const getShipment = (id: string) => repository().getShipment(id);
