import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireData, useSupabaseData } from "./source";
import type { CreateOrderInput, OrderRecord } from "./types";

const rowToOrder = (row: any): OrderRecord => ({ id: row.id, source: row.source, merchantId: row.merchant_id, status: row.status, createdAt: row.created_at });
export interface OrderRepository { getOrders(): Promise<OrderRecord[]>; createOrder(input: CreateOrderInput): Promise<OrderRecord>; }
export class SupabaseOrderRepository implements OrderRepository {
  async getOrders() { const { data, error } = await getSupabaseServerClient().from("orders").select("*").order("created_at", { ascending: false }); return requireData(data, error).map(rowToOrder); }
  async createOrder(input: CreateOrderInput) {
    const client = getSupabaseServerClient();
    const { data, error } = await client.from("orders").insert({ ...(input.id ? { id: input.id } : {}), source: input.source, merchant_id: input.merchantId, status: input.status ?? "PENDING" }).select("*").single();
    const order = rowToOrder(requireData(data, error));
    const { error: itemError } = await client.from("order_items").insert(input.items.map((item) => ({ order_id: order.id, product_id: item.productId ?? null, product_name: item.productName, quantity: item.quantity, unit_price: item.unitPrice })));
    if (itemError) throw new Error(itemError.message);
    return { ...order, items: input.items };
  }
}
export class MockOrderRepository implements OrderRepository {
  private orders: OrderRecord[] = [{ id: "ORDER-001", source: "OFFLINE_QR", merchantId: "samjin-busan", status: "PAID", createdAt: "2026-08-13T14:20:00+09:00", items: [{ productId: "P001", productName: "부산어묵 종합선물세트", quantity: 2, unitPrice: 20000 }] }];
  async getOrders() { return this.orders; }
  async createOrder(input: CreateOrderInput) { const order: OrderRecord = { id: input.id ?? `mock-order-${Date.now()}`, source: input.source, merchantId: input.merchantId, status: input.status ?? "PENDING", createdAt: new Date().toISOString(), items: input.items }; this.orders.unshift(order); return order; }
}
const repository = () => useSupabaseData() ? new SupabaseOrderRepository() : new MockOrderRepository();
export const getOrders = () => repository().getOrders();
export const createOrder = (input: CreateOrderInput) => repository().createOrder(input);
