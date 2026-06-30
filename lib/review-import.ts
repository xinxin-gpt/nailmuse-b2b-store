import readXlsxFile from "read-excel-file/node";
import type { Review } from "@/types/review";

export type ReviewImportRowResult = {
  rowNumber: number;
  review?: Review;
  errors: string[];
  warnings: string[];
};

export type ParsedReviewImport = {
  fileName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  rows: ReviewImportRowResult[];
  reviews: Review[];
};

type RawRow = Record<string, unknown>;

const aliases: Record<string, string[]> = {
  author: ["author", "user", "name", "reviewer", "作者", "用户名", "评论人"],
  rating: ["rating", "score", "stars", "评分", "星级"],
  comment: ["comment", "content", "review", "text", "body", "评论内容", "评价", "内容"],
  date: ["date", "time", "createdat", "日期", "评价日期", "评论时间"],
  sku: ["sku", "productsku", "货号", "产品货号", "产品sku"]
};

function normalizeHeader(value: unknown) {
  return String(value ?? "")
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_\-./\\()[\]{}:：]+/g, "");
}

function readValue(row: RawRow, field: keyof typeof aliases) {
  const normalized = new Map(Object.entries(row).map(([key, value]) => [normalizeHeader(key), value]));
  for (const alias of aliases[field]) {
    const value = normalized.get(normalizeHeader(alias));
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return "";
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== "")) rows.push(row);
  return rows;
}

function parseTsv(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line) => line.split("\t").map((cell) => cell.trim().replace(/^"|"$/g, "")));
}

function tableToObjects(table: unknown[][]): RawRow[] {
  if (!table.length) return [];
  const headers = table[0].map((header) => String(header ?? "").trim());
  return table.slice(1).map((values) => {
    const row: RawRow = {};
    headers.forEach((header, index) => {
      if (header) row[header] = values[index] ?? "";
    });
    return row;
  });
}

async function readRows(fileName: string, buffer: Buffer): Promise<RawRow[]> {
  const extension = fileName.toLowerCase().split(".").pop();
  if (extension === "csv") {
    return tableToObjects(parseCsv(buffer.toString("utf8")));
  }
  if (extension === "txt") {
    return tableToObjects(parseTsv(buffer.toString("utf8")));
  }
  if (extension === "xlsx") {
    const sheets = await readXlsxFile(buffer);
    const table = sheets[0]?.data || [];
    return tableToObjects(table as unknown[][]);
  }
  throw new Error("Only .csv, .xlsx and .txt files are supported.");
}

function rawRowToReview(row: RawRow): Review {
  return {
    author: String(readValue(row, "author") || "Anonymous").trim(),
    rating: Number(readValue(row, "rating")) || 5,
    comment: String(readValue(row, "comment") || "").trim(),
    date: String(readValue(row, "date") || new Date().toISOString().split("T")[0]).trim(),
    sku: String(readValue(row, "sku") || "").trim()
  };
}

export async function parseReviewImport(fileName: string, buffer: Buffer): Promise<ParsedReviewImport> {
  const rawRows = await readRows(fileName, buffer);
  const rows: ReviewImportRowResult[] = rawRows.map((row, index) => {
    const review = rawRowToReview(row);
    const errors: string[] = [];
    if (!review.sku) errors.push("SKU is required");
    if (!review.comment) errors.push("Comment is empty");
    
    return { rowNumber: index + 2, review, errors, warnings: [] };
  });

  const valid = rows.filter((row) => row.review && row.errors.length === 0).map((row) => row.review!);
  return {
    fileName,
    totalRows: rows.length,
    validRows: valid.length,
    invalidRows: rows.length - valid.length,
    rows,
    reviews: valid
  };
}

export function mergeImportedReviews(current: Review[], imported: Review[], mode: "upsert" | "replace") {
  if (mode === "replace") return imported;
  return [...current, ...imported];
}
