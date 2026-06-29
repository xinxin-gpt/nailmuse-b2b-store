import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { CTA } from "@/components/CTA";
import { listProducts } from "@/lib/catalog-store";

export const metadata: Metadata = { title: "Nail Product Catalog", description: "Browse press-on nails, gel products, packaging and custom nail collections for wholesale and private label." };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await listProducts();
  return <><section className="page-hero"><div className="container"><span className="eyebrow">PRODUCT CATALOG</span><h1>Wholesale & Custom Nail Products</h1><p>Explore production-ready styles and use them as a starting point for your own branded collection.</p></div></section><section className="section"><div className="container"><SectionHeading eyebrow="ALL PRODUCTS" title={`${products.length} B2B product directions`} text="MOQ, lead time, colors and packaging can be adjusted according to your project."/>{products.length ? <div className="product-grid">{products.map((product)=><ProductCard key={product.sku || product.slug} product={product}/>)}</div> : <div className="empty-catalog"><h2>Catalog is being updated</h2><p>Please contact our team for the latest product list and wholesale quotation.</p></div>}</div></section><CTA/></>;
}
