import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { products as fallbackProducts } from "@/data/products";
import { normalizeProduct, productValidationErrors } from "@/lib/product-utils";
import type { Product, ProductCatalog } from "@/types/product";

const bucket = process.env.R2_BUCKET_NAME || "";
const catalogKey = process.env.R2_PRODUCTS_KEY || "catalog/products.json";

function hasR2Config() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      bucket
  );
}

function createClient() {
  if (!hasR2Config()) return null;
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    }
  });
}

function normalizeCatalogRows(rows: unknown[]): Product[] {
  const normalized: Product[] = [];
  rows.forEach((row, index) => {
    if (!row || typeof row !== "object") return;
    const product = normalizeProduct(row as Partial<Product> & Record<string, unknown>, index);
    if (productValidationErrors(product).length === 0) normalized.push(product);
  });
  return normalized;
}

export type CatalogReadResult = {
  products: Product[];
  source: "r2" | "fallback";
  updatedAt?: string;
  r2Configured: boolean;
};

export async function readCatalog(): Promise<CatalogReadResult> {
  const client = createClient();
  if (!client) {
    return { products: fallbackProducts, source: "fallback", r2Configured: false };
  }

  try {
    const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: catalogKey }));
    const text = await response.Body?.transformToString();
    if (!text) throw new Error("The R2 catalog object is empty");
    const parsed = JSON.parse(text) as ProductCatalog | Product[];
    const rows = Array.isArray(parsed) ? parsed : parsed.products;
    const normalized = normalizeCatalogRows(Array.isArray(rows) ? rows : []);
    if (!normalized.length) throw new Error("The R2 catalog has no valid product rows");
    return {
      products: normalized,
      source: "r2",
      updatedAt: Array.isArray(parsed) ? undefined : parsed.updatedAt,
      r2Configured: true
    };
  } catch (error) {
    console.error("Unable to read product catalog from R2; using bundled fallback products.", error);
    return { products: fallbackProducts, source: "fallback", r2Configured: true };
  }
}

export async function listProducts(options?: { includeUnpublished?: boolean }) {
  const catalog = await readCatalog();
  if (options?.includeUnpublished) return catalog.products;
  return catalog.products.filter((product) => product.status === "published");
}

export async function getProductBySlug(slug: string, options?: { includeUnpublished?: boolean }) {
  const products = await listProducts(options);
  return products.find((product) => product.slug === slug);
}

export async function writeCatalog(products: Product[], options?: { createBackup?: boolean }) {
  const client = createClient();
  if (!client) {
    throw new Error("R2 is not configured. Add the R2 environment variables in Vercel first.");
  }

  if (options?.createBackup !== false) {
    try {
      const current = await client.send(new GetObjectCommand({ Bucket: bucket, Key: catalogKey }));
      const currentText = await current.Body?.transformToString();
      if (currentText) {
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        await client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: `catalog/backups/products-${stamp}.json`,
            Body: currentText,
            ContentType: "application/json; charset=utf-8"
          })
        );
      }
    } catch {
      // The first import has no existing catalog to back up.
    }
  }

  const catalog: ProductCatalog = {
    version: 1,
    updatedAt: new Date().toISOString(),
    products
  };

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: catalogKey,
      Body: JSON.stringify(catalog, null, 2),
      ContentType: "application/json; charset=utf-8",
      CacheControl: "no-store"
    })
  );

  return catalog;
}

export function catalogStorageInfo() {
  return { configured: hasR2Config(), bucket, catalogKey };
}
