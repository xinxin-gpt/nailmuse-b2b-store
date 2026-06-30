import type { Metadata } from "next";
import { ProductImportPanel } from "@/components/ProductImportPanel";

export const metadata: Metadata = {
  title: "Product Import Admin",
  robots: { index: false, follow: false }
};

export default function ProductImportPage() {
  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div className="container">
          <span className="eyebrow">CATALOG & REVIEWS ADMIN</span>
          <h1>批量导入后台</h1>
          <p>
            通过 CSV、Excel 或 TXT (TSV) 管理美甲产品及产品评论。
            数据持久化到 Cloudflare R2，更新后前台立即读取。
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ProductImportPanel />
        </div>
      </section>
    </main>
  );
}
