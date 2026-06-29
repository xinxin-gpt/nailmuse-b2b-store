import { NextResponse } from "next/server";
import { checkAdminRequest } from "@/lib/admin-auth";
import { catalogStorageInfo, readCatalog, writeCatalog } from "@/lib/catalog-store";
import { mergeImportedProducts, parseProductImport } from "@/lib/product-import";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const auth = checkAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.message }, { status: auth.status });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const modeValue = String(formData.get("mode") || "upsert");
    const mode = modeValue === "replace" ? "replace" : "upsert";
    const dryRun = String(formData.get("dryRun") || "true") !== "false";

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Please choose a CSV or XLSX file." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, error: "File is larger than 4 MB." }, { status: 413 });
    }
    if (!/\.(csv|xlsx)$/i.test(file.name)) {
      return NextResponse.json({ ok: false, error: "Only .csv and .xlsx files are supported." }, { status: 400 });
    }

    const parsed = await parseProductImport(file.name, Buffer.from(await file.arrayBuffer()));
    const previewRows = parsed.rows.slice(0, 100).map((row) => ({
      rowNumber: row.rowNumber,
      product: row.product,
      errors: row.errors,
      warnings: row.warnings
    }));

    if (dryRun) {
      return NextResponse.json({
        ok: true,
        dryRun: true,
        mode,
        summary: {
          totalRows: parsed.totalRows,
          validRows: parsed.validRows,
          invalidRows: parsed.invalidRows,
          previewLimited: parsed.rows.length > previewRows.length
        },
        rows: previewRows,
        storage: catalogStorageInfo()
      });
    }

    if (!parsed.validRows) {
      return NextResponse.json({ ok: false, error: "No valid product rows were found.", rows: previewRows }, { status: 422 });
    }

    const currentCatalog = await readCatalog();
    const current = currentCatalog.source === "r2" ? currentCatalog.products : [];
    const merged = mergeImportedProducts(current, parsed.products, mode);
    const catalog = await writeCatalog(merged, { createBackup: true });

    return NextResponse.json({
      ok: true,
      dryRun: false,
      mode,
      summary: {
        totalRows: parsed.totalRows,
        importedRows: parsed.validRows,
        skippedRows: parsed.invalidRows,
        catalogProducts: catalog.products.length,
        updatedAt: catalog.updatedAt
      },
      rows: previewRows
    });
  } catch (error) {
    console.error("Product import failed", error);
    const message = error instanceof Error ? error.message : "Product import failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
