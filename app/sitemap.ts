import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/catalog-store";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/products", "/oem-odm", "/wholesale", "/factory", "/catalog", "/about", "/faq", "/blog", "/contact", "/privacy", "/terms"];
  const blogPosts = ["/blog/semi-cured-gel-strips-b2b-guide"];
  const products = await listProducts();
  return [
    ...pages.map((url) => ({ url: `${siteConfig.domain}${url}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: url === "" ? 1 : 0.8 })),
    ...blogPosts.map((url) => ({ url: `${siteConfig.domain}${url}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...products.map((product) => ({ url: `${siteConfig.domain}/products/${product.slug}`, lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(), changeFrequency: "monthly" as const, priority: 0.7 }))
  ];
}
