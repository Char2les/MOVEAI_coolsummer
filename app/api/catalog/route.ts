import { NextResponse } from "next/server";
import { getMerchants } from "@/lib/data/merchants";
import { getProducts } from "@/lib/data/products";
import { toMerchantView, toProductView, toStoreViews } from "@/lib/data/view-models";

export async function GET() {
  try {
    const [merchantRecords, productRecords] = await Promise.all([getMerchants(), getProducts()]);
    return NextResponse.json({
      merchants: merchantRecords.map(toMerchantView),
      products: productRecords.map(toProductView),
      stores: toStoreViews(merchantRecords),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Catalog lookup failed." }, { status: 503 });
  }
}
