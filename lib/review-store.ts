import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { Review, ReviewCatalog } from "@/types/review";

const bucket = process.env.R2_BUCKET_NAME || "";
const reviewKey = "catalog/reviews.json";

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

export type ReviewReadResult = {
  reviews: Review[];
  source: "r2" | "empty";
  updatedAt?: string;
  r2Configured: boolean;
};

export async function readReviews(): Promise<ReviewReadResult> {
  const client = createClient();
  if (!client) {
    return { reviews: [], source: "empty", r2Configured: false };
  }

  try {
    const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: reviewKey }));
    const text = await response.Body?.transformToString();
    if (!text) throw new Error("The R2 review object is empty");
    const parsed = JSON.parse(text) as ReviewCatalog | Review[];
    const rows = Array.isArray(parsed) ? parsed : parsed.reviews;
    return {
      reviews: Array.isArray(rows) ? rows : [],
      source: "r2",
      updatedAt: Array.isArray(parsed) ? undefined : parsed.updatedAt,
      r2Configured: true
    };
  } catch (error) {
    console.error("Unable to read reviews from R2.", error);
    return { reviews: [], source: "empty", r2Configured: true };
  }
}

export async function writeReviews(reviews: Review[]) {
  const client = createClient();
  if (!client) {
    throw new Error("R2 is not configured.");
  }

  const catalog: ReviewCatalog = {
    version: 1,
    updatedAt: new Date().toISOString(),
    reviews
  };

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: reviewKey,
      Body: JSON.stringify(catalog, null, 2),
      ContentType: "application/json; charset=utf-8",
      CacheControl: "no-store"
    })
  );

  return catalog;
}
