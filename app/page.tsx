import Link from "next/link";
import { ArrowRight, BadgeCheck, Boxes, Factory, Globe2, Palette, PackageCheck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { CTA } from "@/components/CTA";
import { listProducts } from "@/lib/catalog-store";
import { asset } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await listProducts();
  const featuredProducts = products.filter((product) => product.featured).slice(0, 8);
  const homepageProducts = featuredProducts.length ? featuredProducts : products.slice(0, 8);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">B2B NAIL PRODUCT MANUFACTURER</span>
            <h1>Custom Press-On Nails Built for Your Brand.</h1>
            <p>From trend research and sample development to custom packaging and bulk production, we help beauty brands launch retail-ready nail collections.</p>
            <div className="hero-actions"><Link className="button" href="/contact">Get Factory Quote <ArrowRight size={18}/></Link><Link className="button button-secondary" href="/products">Explore Products</Link></div>
            <div className="trust-row"><span><BadgeCheck size={18}/>Low MOQ options</span><span><BadgeCheck size={18}/>Custom packaging</span><span><BadgeCheck size={18}/>Global shipping</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-card main">
              <img src="https://sc02.alicdn.com/kf/A1c804b6037ce428aa346bce49e621c39h.png" alt="Chrome silver press-on nails wholesale"/>
              <span className="hero-card-label">定制镀铬贴合钉</span>
            </div>
            <div className="hero-card small one">
              <img src="https://sc02.alicdn.com/kf/A2cbf1189d5d2420a8b00878c909e2373t.png" alt="3D floral handmade press-on nails"/>
              <span className="hero-card-label">3D花卉贴甲</span>
            </div>
            <div className="hero-card small two">
              <img src="https://sc02.alicdn.com/kf/Ad25089bc37a941d7a325b2ea0025cb664.png" alt="French tip press-on nails"/>
              <span className="hero-card-label">法式贴合钉</span>
            </div>
            <div className="hero-stat"><strong>OEM / ODM</strong><span>设计→采样→生产</span></div>
          </div>
        </div>
      </section>

      <section className="stats-section"><div className="container stats-grid"><div><strong>8+</strong><span>Product categories</span></div><div><strong>50+</strong><span>Surface effects</span></div><div><strong>100</strong><span>Sets starting MOQ</span></div><div><strong>25</strong><span>Days typical production</span></div></div></section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="PRODUCT COLLECTIONS" title="Designed for wholesale, private label and retail programs" text="Start with ready designs or create a fully custom collection for your target customer." />
          <div className="product-grid">{homepageProducts.map((product) => <ProductCard key={product.slug} product={product}/>)}</div>
          <div className="center-action"><Link className="button button-secondary" href="/products">View All Products <ArrowRight size={17}/></Link></div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeading center eyebrow="WHY BRANDS WORK WITH US" title="A practical supply chain for growing nail businesses" text="Flexible services for importers, wholesalers, salons, online brands and beauty retailers." />
          <div className="feature-grid">
            <div className="feature-card"><Palette/><h3>Custom Design</h3><p>Shapes, lengths, colors, artwork, decorations, finish and packaging built around your brief.</p></div>
            <div className="feature-card"><Boxes/><h3>Flexible MOQ</h3><p>Start with manageable quantities and scale production as your collection proves demand.</p></div>
            <div className="feature-card"><PackageCheck/><h3>Retail-Ready Packaging</h3><p>Custom boxes, trays, instruction cards, glue, tabs, files and barcode support.</p></div>
            <div className="feature-card"><Factory/><h3>Factory Coordination</h3><p>Sampling, production control, inspection and shipment managed by one business team.</p></div>
          </div>
        </div>
      </section>

      <section className="section process-section">
        <div className="container split-grid">
          <div>
            <SectionHeading eyebrow="OEM / ODM PROCESS" title="From inspiration to mass production" text="A clear workflow helps protect quality, timing and cost from the first sample onward." />
            <Link className="text-link large" href="/oem-odm">See full custom process <ArrowRight size={18}/></Link>
          </div>
          <div className="steps">
            {[['01','Send your brief','Reference images, quantities, packaging and target price.'],['02','Design & quotation','We confirm specifications and recommend production options.'],['03','Sample approval','Review colors, fit, finish, decoration and package structure.'],['04','Bulk production','Manufacturing, inspection, packing and shipment.']].map(([n,t,d])=><div className="step" key={n}><strong>{n}</strong><div><h3>{t}</h3><p>{d}</p></div></div>)}
          </div>
        </div>
      </section>

      <section className="section dark-section"><div className="container industry-grid"><div><span className="eyebrow light">WHO WE SERVE</span><h2>Built for different B2B sales channels</h2></div><div className="industry-cards"><div><Sparkles/><h3>Beauty Brands</h3><p>Private label and exclusive seasonal collections.</p></div><div><Globe2/><h3>Importers & Distributors</h3><p>Multi-style orders, documentation and shipping coordination.</p></div><div><Boxes/><h3>Retailers & E-commerce</h3><p>Retail-ready sets optimized for shelf and online presentation.</p></div></div></div></section>
      <CTA/>
    </>
  );
}
