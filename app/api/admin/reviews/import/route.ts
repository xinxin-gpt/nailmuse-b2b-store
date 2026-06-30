import { NextResponse } from "next/server";
import { checkAdminRequest } from "@/lib/admin-auth";
import { readReviews, writeReviews } from "@/lib/review-store";
import { mergeImportedReviews, parseReviewImport } from "@/lib/review-import";

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
      return NextResponse.json({ ok: false, error: "Please choose a CSV, XLSX or TXT file." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, error: "File is larger than 4 MB." }, { status: 413 });
    }
    if (!/\.(csv|xlsx|txt)$/i.test(file.name)) {
      return NextResponse.json({ ok: false, error: "Only .csv, .xlsx and .txt files are supported." }, { status: 400 });
    }

    const parsed = await parseReviewImport(file.name, Buffer.from(await file.arrayBuffer()));
    const previewRows = parsed.rows.slice(0, 100).map((row) => ({
      rowNumber: row.rowNumber,
      review: row.review,
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
        rows: previewRows
      });
    }

    if (!parsed.validRows) {
      return NextResponse.json({ ok: false, error: "No valid review rows were found.", rows: previewRows }, { status: 422 });
    }

    const currentCatalog = await readReviews();
    const current = currentCatalog.reviews;
    const merged = mergeImportedReviews(current, parsed.reviews, mode);
    const catalog = await writeReviews(merged);

    return NextResponse.json({
      ok: true,
      dryRun: false,
      mode,
      summary: {
        totalRows: parsed.totalRows,
        importedRows: parsed.validRows,
        skippedRows: parsed.invalidRows,
        catalogReviews: catalog.reviews.length,
        updatedAt: catalog.updatedAt
      },
      rows: previewRows
    });
  } catch (error) {
    console.error("Review import failed", error);
    const message = error instanceof Error ? error.message : "Review import failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
