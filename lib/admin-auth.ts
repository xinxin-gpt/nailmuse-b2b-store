import { timingSafeEqual } from "node:crypto";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function checkAdminRequest(request: Request) {
  const configuredToken = process.env.PRODUCT_IMPORT_ADMIN_TOKEN || "";
  if (!configuredToken) {
    return { ok: false as const, status: 503, message: "PRODUCT_IMPORT_ADMIN_TOKEN is not configured." };
  }
  const authorization = request.headers.get("authorization") || "";
  const suppliedToken = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!suppliedToken || !safeEqual(suppliedToken, configuredToken)) {
    return { ok: false as const, status: 401, message: "Invalid admin token." };
  }
  return { ok: true as const };
}
