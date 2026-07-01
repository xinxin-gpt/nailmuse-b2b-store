import { NextResponse } from "next/server";
import { listProducts } from "@/lib/catalog-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await listProducts({ includeUnpublished: false });
  return NextResponse.json(products, {
    headers: { "Cache-Control": "no-store" }
  });
}
