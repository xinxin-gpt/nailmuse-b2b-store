import type { Metadata } from "next";
import { ProductImportPanel } from "@/components/ProductImportPanel";

export const metadata: Metadata = {
  title: "Product Import Admin",
  robots: { index: false, follow: false }
};

export default function ProductImportPage() {
  return <main className="admin-page"><section className="admin-hero"><div className="container"><span className="eyebrow">CATALOG ADMIN</span><h1>产品批量导入后台</h1><p>通过 CSV 或 Excel 管理美甲、穿戴甲、包装和配件产品。产品数据持久化到 Cloudflare R2，更新后前台立即读取。</p></div></section><section className="section"><div className="container"><ProductImportPanel /></div></section></main>;
}
