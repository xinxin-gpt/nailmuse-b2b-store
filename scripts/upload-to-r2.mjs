import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const required = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME"];
for (const key of required) if (!process.env[key]) throw new Error(`Missing environment variable: ${key}`);

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY }
});

const root = path.resolve(process.env.R2_UPLOAD_DIR || "public/products");
const prefix = (process.env.R2_UPLOAD_PREFIX || "products").replace(/^\/+|\/+$/g, "");
const publicBase = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "").replace(/\/$/, "");
const contentTypes = {
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif", ".pdf": "application/pdf"
};

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory)) {
    const full = path.join(directory, entry);
    (await stat(full)).isDirectory() ? files.push(...await walk(full)) : files.push(full);
  }
  return files;
}

const manifest = ["local_file,r2_key,public_url"];
for (const file of await walk(root)) {
  const relative = path.relative(root, file).replaceAll("\\", "/");
  const key = `${prefix}/${relative}`;
  await client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: await readFile(file),
    ContentType: contentTypes[path.extname(file).toLowerCase()] || "application/octet-stream",
    CacheControl: "public, max-age=31536000, immutable"
  }));
  const publicUrl = publicBase ? `${publicBase}/${key}` : key;
  manifest.push(`"${relative.replaceAll('"', '""')}","${key}","${publicUrl}"`);
  console.log(`Uploaded ${key}`);
}

const manifestPath = path.resolve("r2-upload-manifest.csv");
await writeFile(manifestPath, `${manifest.join("\n")}\n`, "utf8");
console.log(`Manifest written to ${manifestPath}`);
