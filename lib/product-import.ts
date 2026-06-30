import readXlsxFile from "read-excel-file/node";
import { normalizeProduct, productValidationErrors, slugify } from "@/lib/product-utils";
import type { Product } from "@/types/product";

export type ImportRowResult = {
  rowNumber: number;
  product?: Product;
  errors: string[];
  warnings: string[];
};

export type ParsedImport = {
  fileName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  rows: ImportRowResult[];
  products: Product[];
};

type RawRow = Record<string, unknown>;

const aliases: Record<string, string[]> = {
  sku: ["sku", "productsku", "货号", "产品货号", "产品sku"],
  slug: ["slug", "urlslug", "链接别名", "产品链接"],
  name: ["name", "productname", "title", "产品名称", "商品名称", "标题"],
  category: ["category", "productcategory", "分类", "产品分类"],
  image: ["image", "mainimage", "featuredimage", "主图", "产品主图", "图片"],
  images: ["images", "gallery", "galleryimages", "图片集", "产品图片", "附图"],
  short: ["short", "shortdescription", "summary", "短描述", "简短描述", "卖点"],
  description: ["description", "longdescription", "details", "产品描述", "详情", "详细描述"],
  moq: ["moq", "minimumorderquantity", "起订量", "最小起订量"],
  leadTime: ["leadtime", "productiontime", "交期", "生产周期"],
  priceRange: ["pricerange", "wholesaleprice", "价格区间", "批发价"],
  materials: ["materials", "material", "材质", "材料"],
  shapes: ["shapes", "shape", "甲型", "形状"],
  finishes: ["finishes", "finish", "工艺", "表面效果"],
  colors: ["colors", "colour", "color", "颜色"],
  sizes: ["sizes", "size", "尺寸", "规格"],
  tags: ["tags", "keywords", "标签", "关键词"],
  featured: ["featured", "isfeatured", "推荐", "首页推荐"],
  status: ["status", "publishstatus", "状态", "发布状态"],
  seoTitle: ["seotitle", "metatitle", "seo标题"],
  seoDescription: ["seodescription", "metadescription", "seo描述"]
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

function rawRowToProduct(row: RawRow, index: number) {
  const name = String(readValue(row, "name") || "").trim();
  const slugValue = String(readValue(row, "slug") || "").trim();
  const data: Record<string, unknown> = {
    sku: readValue(row, "sku"),
    slug: slugValue || slugify(String(name)),
    name,
    category: readValue(row, "category"),
    image: readValue(row, "image"),
    images: readValue(row, "images"),
    short: readValue(row, "short"),
    description: readValue(row, "description"),
    moq: readValue(row, "moq") || "Contact us",
    leadTime: readValue(row, "leadTime") || "Confirm after sample approval",
    priceRange: readValue(row, "priceRange"),
    materials: readValue(row, "materials"),
    shapes: readValue(row, "shapes"),
    finishes: readValue(row, "finishes"),
    colors: readValue(row, "colors"),
    sizes: readValue(row, "sizes"),
    tags: readValue(row, "tags"),
    featured: readValue(row, "featured"),
    status: readValue(row, "status") || "published",
    seoTitle: readValue(row, "seoTitle"),
    seoDescription: readValue(row, "seoDescription")
  };
  return normalizeProduct(data as Partial<Product> & Record<string, unknown>, index);
}

export async function parseProductImport(fileName: string, buffer: Buffer): Promise<ParsedImport> {
  const rawRows = await readRows(fileName, buffer);
  const rows: ImportRowResult[] = rawRows.map((row, index) => {
    const product = rawRowToProduct(row, index);
    const errors = productValidationErrors(product);
    const warnings: string[] = [];
    if (!product.short) warnings.push("Short description is empty");
    if (!product.materials.length) warnings.push("Materials are empty");
    if (!product.seoDescription) warnings.push("SEO description is empty");
    return { rowNumber: index + 2, product, errors, warnings };
  });

  const skuMap = new Map<string, number[]>();
  const slugMap = new Map<string, number[]>();
  rows.forEach((row, index) => {
    if (!row.product) return;
    const sku = row.product.sku.toLowerCase();
    const slug = row.product.slug.toLowerCase();
    skuMap.set(sku, [...(skuMap.get(sku) || []), index]);
    slugMap.set(slug, [...(slugMap.get(slug) || []), index]);
  });
  skuMap.forEach((indexes) => {
    if (indexes.length > 1) indexes.forEach((index) => rows[index].errors.push("Duplicate SKU in import file"));
  });
  slugMap.forEach((indexes) => {
    if (indexes.length > 1) indexes.forEach((index) => rows[index].errors.push("Duplicate slug in import file"));
  });

  const valid = rows.filter((row) => row.product && row.errors.length === 0).map((row) => row.product!);
  return {
    fileName,
    totalRows: rows.length,
    validRows: valid.length,
    invalidRows: rows.length - valid.length,
    rows,
    products: valid
  };
}

export function mergeImportedProducts(current: Product[], imported: Product[], mode: "upsert" | "replace") {
  const now = new Date().toISOString();
  const prepared = imported.map((product) => ({ ...product, updatedAt: now }));
  if (mode === "replace") return prepared;

  const output = [...current];
  prepared.forEach((product) => {
    const index = output.findIndex(
      (existing) => existing.sku.toLowerCase() === product.sku.toLowerCase() || existing.slug === product.slug
    );
    if (index >= 0) {
      output[index] = { ...product, createdAt: output[index].createdAt || product.createdAt };
    } else {
      output.push(product);
    }
  });
  return output;
}
