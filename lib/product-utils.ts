import type { Product, ProductStatus } from "@/types/product";

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[’'"“”]/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function splitList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }
  if (value === null || value === undefined) return [];
  return String(value)
    .split(/[|;；、\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["1", "true", "yes", "y", "是", "featured"].includes(normalized)) return true;
  if (["0", "false", "no", "n", "否"].includes(normalized)) return false;
  return fallback;
}

export function normalizeStatus(value: unknown): ProductStatus {
  const normalized = String(value ?? "published").trim().toLowerCase();
  if (["draft", "草稿"].includes(normalized)) return "draft";
  if (["archived", "archive", "disabled", "下架", "归档"].includes(normalized)) return "archived";
  return "published";
}

export function isUsableImage(value: string) {
  return value.startsWith("/") || /^https:\/\//i.test(value);
}

export function normalizeProduct(input: Partial<Product> & Record<string, unknown>, index = 0): Product {
  const name = String(input.name ?? "").trim();
  const category = String(input.category ?? "").trim();
  const images = splitList(input.images);
  const mainImage = String(input.image ?? images[0] ?? "").trim();
  const slug = slugify(String(input.slug ?? name)) || `product-${index + 1}`;
  const sku = String(input.sku ?? "").trim() || `NAIL-${slug.toUpperCase().replace(/-/g, "-")}`;
  const now = new Date().toISOString();

  return {
    sku,
    slug,
    name,
    category,
    image: mainImage,
    images: Array.from(new Set([mainImage, ...images].filter(Boolean))),
    short: String(input.short ?? "").trim(),
    description: String(input.description ?? "").trim() || undefined,
    moq: String(input.moq ?? "Contact us").trim(),
    leadTime: String(input.leadTime ?? "Confirm after sample approval").trim(),
    priceRange: String(input.priceRange ?? "").trim() || undefined,
    materials: splitList(input.materials),
    shapes: splitList(input.shapes),
    finishes: splitList(input.finishes),
    colors: splitList(input.colors),
    sizes: splitList(input.sizes),
    tags: splitList(input.tags),
    featured: toBoolean(input.featured),
    status: normalizeStatus(input.status),
    seoTitle: String(input.seoTitle ?? "").trim() || undefined,
    seoDescription: String(input.seoDescription ?? "").trim() || undefined,
    createdAt: String(input.createdAt ?? "").trim() || now,
    updatedAt: String(input.updatedAt ?? "").trim() || now
  };
}

export function productValidationErrors(product: Product): string[] {
  const errors: string[] = [];
  if (!product.name) errors.push("Product name is required");
  if (!product.category) errors.push("Category is required");
  if (!product.slug) errors.push("Slug is required");
  if (!product.sku) errors.push("SKU is required");
  if (!product.image) errors.push("Main image is required");
  if (product.image && !isUsableImage(product.image)) errors.push("Image must be an https URL or a /relative path");
  return errors;
}
