import { NextResponse } from "next/server";
import { listProducts } from "@/lib/catalog-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const products = await listProducts();
  return NextResponse.json({ products, count: products.length }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
