import { NextResponse } from "next/server";
import { checkAdminRequest } from "@/lib/admin-auth";
import { readCatalog } from "@/lib/catalog-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = checkAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.message }, { status: auth.status });
  const catalog = await readCatalog();
  return NextResponse.json({
    ok: true,
    products: catalog.products,
    source: catalog.source,
    updatedAt: catalog.updatedAt,
    r2Configured: catalog.r2Configured
  });
}
