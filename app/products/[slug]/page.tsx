import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Clock3, Package, Ruler, ShieldCheck } from "lucide-react";
import { getProductBySlug } from "@/lib/catalog-store";
import { asset } from "@/lib/site";
import { InquiryForm } from "@/components/InquiryForm";

export const dynamic = "force-dynamic";
type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return product ? { title: product.seoTitle || product.name, description: product.seoDescription || product.short } : {};
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const options = [...product.materials, ...product.shapes, ...product.finishes, ...product.colors, ...product.sizes, "Logo and packaging", "Accessory kit configuration"];
  return <>
    <section className="product-detail section"><div className="container product-detail-grid"><div className="product-detail-image"><img src={asset(product.image)} alt={product.name}/><span>{product.category}</span></div><div className="product-detail-copy"><span className="eyebrow">B2B PRODUCT · {product.sku}</span><h1>{product.name}</h1><p className="lead">{product.short}</p><div className="spec-cards"><div><Package/><span>MOQ</span><strong>{product.moq}</strong></div><div><Clock3/><span>Lead time</span><strong>{product.leadTime}</strong></div></div>{product.priceRange ? <p className="price-range"><strong>Indicative wholesale price:</strong> {product.priceRange}</p> : null}<h3>Customization options</h3><ul className="check-list">{Array.from(new Set(options.filter(Boolean))).map((value)=><li key={value}><Check size={17}/>{value}</li>)}</ul><a className="button" href="#inquiry">Request pricing</a></div></div></section>
    {product.description ? <section className="section"><div className="container narrow product-description"><span className="eyebrow">PRODUCT OVERVIEW</span><h2>Made for wholesale and private label programs</h2><p>{product.description}</p></div></section> : null}
    {product.images.length > 1 ? <section className="section section-soft"><div className="container"><div className="product-gallery">{product.images.slice(1,7).map((image,index)=><img key={`${image}-${index}`} src={asset(image)} alt={`${product.name} view ${index+2}`}/>)}</div></div></section> : null}
    <section className="section section-soft"><div className="container"><div className="three-col-info"><div><Ruler/><h3>Specification Control</h3><p>Confirm size range, shape, length, curvature, finish and decoration before production.</p></div><div><ShieldCheck/><h3>Quality Inspection</h3><p>Visual appearance, quantity, packaging and agreed specifications checked before shipment.</p></div><div><Package/><h3>Private Label Packaging</h3><p>Choose box structures, inserts, accessory kits, instruction cards and labeling.</p></div></div></div></section>
    <section id="inquiry" className="section"><div className="container form-layout"><div><span className="eyebrow">REQUEST A QUOTE</span><h2>Ask about this product</h2><p>Include your target quantity, market, package type and required delivery date for a more accurate quotation.</p></div><InquiryForm compact product={`${product.name} (${product.sku})`}/></div></section>
  </>;
}
