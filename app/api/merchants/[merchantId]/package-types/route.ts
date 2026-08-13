import { NextResponse } from "next/server";
import { getMerchantPackageTypes } from "@/lib/data/merchants";

const canonicalMerchantId = (id: string) => id === "M001" || id === "samjin" ? "samjin-busan" : id;

export async function GET(_: Request, { params }: { params: Promise<{ merchantId: string }> }) {
  try {
    const { merchantId } = await params;
    const packageTypes = await getMerchantPackageTypes(canonicalMerchantId(merchantId));
    return NextResponse.json({ packageTypes });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Package type lookup failed." }, { status: 503 });
  }
}
