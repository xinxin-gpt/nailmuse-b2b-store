import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Globe2, Factory, Layers, ShieldCheck, Users, Boxes } from "lucide-react";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Dedxc | B2B Press-On Nails & Gel Strips Manufacturer",
  description:
    "Dedxc is a B2B wholesale manufacturer and private label partner for press-on nails, semi-cured gel nail strips, and professional nail tools. 390+ SKUs, low MOQ from 100 sets, factory-direct pricing, global shipping to 50+ countries.",
  keywords: [
    "Dedxc",
    "B2B press-on nails manufacturer",
    "wholesale gel nail strips supplier",
    "private label nails",
    "OEM nail products China",
    "semi-cured gel strips factory",
    "dedxc.com"
  ],
  alternates: { canonical: `${siteConfig.domain}/about` },
  openGraph: {
    title: "About Dedxc | B2B Nail Product Manufacturer",
    description:
      "B2B wholesale and private label manufacturer of press-on nails, semi-cured gel strips, and professional nail tools. Serving 50+ countries with 390+ SKUs.",
    type: "website",
    url: `${siteConfig.domain}/about`
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  alternateName: "Dedxc",
  url: siteConfig.domain,
  logo: `${siteConfig.domain}/logo.png`,
  description:
    "B2B wholesale and private label manufacturer of press-on nails, semi-cured gel nail strips, glue-on gel nails, and professional nail tools.",
  foundingDate: "2024",
  areaServed: "Worldwide",
  knowsAbout: [
    "Press-On Nails",
    "Semi-Cured Gel Nail Strips",
    "Glue-On Gel Nails",
    "Gel Extensions",
    "Private Label Nail Products",
    "OEM Nail Manufacturing",
    "Wholesale Beauty Supply"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Sales",
    email: siteConfig.email,
    availableLanguage: ["English", "Chinese"]
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "CN"
  }
};

const stats = [
  { icon: Boxes, value: "390+", label: "Ready-to-ship SKUs" },
  { icon: Layers, value: "17", label: "Product categories" },
  { icon: Globe2, value: "50+", label: "Export countries" },
  { icon: Users, value: "100", label: "Sets minimum order" }
];

const capabilities = [
  ["Product Categories", "17 (Press-On, Gel Strips, Glue-On, Extensions, Polish, Tools, Lamps, Kits)"],
  ["SKU Catalog", "390+ ready-to-ship designs"],
  ["MOQ", "From 50–200 units"],
  ["Production Capacity", "500,000+ sets per month (consolidated network)"],
  ["Lead Time", "15–25 days standard, 7 days for stock items"],
  ["Customization", "Color, shape, length, finish, packaging, logo, inserts"],
  ["Export Markets", "50+ countries"],
  ["Languages Supported", "English, Chinese, Spanish"],
  ["Payment Terms", "T/T, Western Union, PayPal, Alibaba Trade Assurance"]
];

const services = [
  {
    icon: Boxes,
    title: "Wholesale Supply",
    points: [
      "390+ in-stock SKUs covering 17 product categories",
      "Classic French, chrome, glitter, coffin, almond, squoval, hand-crafted styles",
      "MOQ as low as 100 sets per design"
    ]
  },
  {
    icon: BadgeCheck,
    title: "Private Label / OEM",
    points: [
      "Custom branded packaging, inserts and inner trays",
      "Logo printing on retail boxes and product cards",
      "Custom color matching and design development"
    ]
  },
  {
    icon: Factory,
    title: "ODM Manufacturing",
    points: [
      "Sample-based and sketch-based product development",
      "In-house design team for trend-driven new releases",
      "Sample lead time: 7–14 days"
    ]
  },
  {
    icon: ShieldCheck,
    title: "Sourcing & QC Consulting",
    points: [
      "Multi-factory sourcing across China's nail clusters",
      "Quality control inspection and consolidation",
      "End-to-end export documentation support"
    ]
  }
];

const advantages = [
  {
    title: "Curated Factory Network",
    body:
      "We work with 5+ ISO 9001 / CPNP / GMPC-certified manufacturers across China's leading nail production clusters, including Donghai (handcrafted press-ons), Shanghai (semi-cured gel technology), and Guangdong (large-scale automated production)."
  },
  {
    title: "Factory-Direct Pricing",
    body:
      "By eliminating middlemen, Dedxc offers 15–30% lower wholesale pricing compared to traditional trading companies. Bulk orders qualify for tiered volume discounts."
  },
  {
    title: "Low MOQ for New Brands",
    body:
      "100 sets for press-on and glue-on nails. 200 sets for semi-cured gel strips. 50 units for nail tools and LED lamps. We grow with you from day one."
  },
  {
    title: "Global Export Ready",
    body:
      "Shipping to 50+ countries with 15–25 day production lead time. Express air shipping reaches North America and Europe in 5–8 days. Sea freight available for high-volume orders."
  },
  {
    title: "Compliance & Certifications",
    body:
      "Our supplier network meets international standards: ISO 9001, CPNP (EU), GMPC, CE/RoHS for electronics, plus vegan and cruelty-free across all nail product lines."
  }
];

const audience = [
  ["Independent Beauty Brands", "Launching their first nail product line."],
  ["Salon Chains", "Sourcing professional-grade products for in-house retail."],
  ["E-commerce Sellers", "On Amazon, Shopify, TikTok Shop, and Etsy."],
  ["Subscription Box Curators", "Needing reliable monthly inventory."],
  ["Beauty Distributors", "In North America, Europe, and emerging markets."],
  ["Drop-shippers", "Needing low-MOQ flexibility and fast restocking."]
];

const workflow = [
  ["01", "Browse the catalog", "390+ SKUs across 17 categories on our online catalog."],
  ["02", "Request a quote", "Submit SKUs, target quantities, and shipping destination."],
  ["03", "Receive samples", "Within 7–14 days for quality verification."],
  ["04", "Confirm production", "30% deposit and approved tech pack."],
  ["05", "Receive shipment", "Within 15–25 days with full tracking and export docs."]
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero */}
      <section className="section section-hero">
        <div className="container">
          <span className="eyebrow">About Dedxc</span>
          <h1>Your Trusted B2B Partner for Press-On Nails, Gel Strips & Private Label Manufacturing</h1>
          <p className="lede">
            Dedxc is a B2B-focused nail product manufacturing and supply platform serving beauty brands, salon chains, retailers,
            and subscription box operators worldwide. Operating through <strong>dedxc.com</strong>, we bridge high-quality Chinese
            nail product factories with global beauty entrepreneurs who need reliable, customizable, and scalable supply.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/products">
              Browse Catalog <ArrowRight size={18} />
            </Link>
            <Link className="button button-ghost" href="/contact">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section-muted">
        <div className="container stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <s.icon size={28} />
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Who we are / What we do */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">What We Do</span>
          <h2>Four service lines, one supply partner</h2>
          <p className="section-intro">
            We specialize in press-on nails, semi-cured gel nail strips, glue-on gel nails, gel extensions, professional nail tools,
            and private label packaging — covering the full spectrum of products needed to launch or scale a modern nail brand.
          </p>
          <div className="cards-grid">
            {services.map((svc) => (
              <article key={svc.title} className="feature-card">
                <svc.icon size={28} />
                <h3>{svc.title}</h3>
                <ul>
                  {svc.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why buyers choose */}
      <section className="section section-muted">
        <div className="container">
          <span className="eyebrow">Why Buyers Choose Dedxc</span>
          <h2>Built for B2B reliability, not retail margins</h2>
          <div className="advantage-list">
            {advantages.map((a) => (
              <div key={a.title} className="advantage-item">
                <BadgeCheck size={22} />
                <div>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities table */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">Capabilities at a Glance</span>
          <h2>Everything you need from a single supply partner</h2>
          <div className="capability-table">
            {capabilities.map(([k, v]) => (
              <div key={k} className="capability-row">
                <span className="capability-key">{k}</span>
                <span className="capability-value">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="section section-muted">
        <div className="container">
          <span className="eyebrow">Who We Serve</span>
          <h2>Designed for every stage of the nail business</h2>
          <div className="audience-grid">
            {audience.map(([title, body]) => (
              <div key={title} className="audience-card">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container narrow">
          <span className="eyebrow">Our Story</span>
          <h2>Make professional nail manufacturing accessible to every beauty entrepreneur</h2>
          <p>
            Dedxc was founded with a clear mission: simplify B2B nail sourcing for the next generation of beauty brands. Traditional
            sourcing has been fragmented — language barriers, opaque pricing, high MOQs, and quality inconsistencies kept many
            promising brands from scaling.
          </p>
          <p>
            We built Dedxc to solve this by combining a transparent online catalog, factory-direct relationships, and bilingual B2B
            service into a single platform at <strong>dedxc.com</strong>. Today, Dedxc serves a growing community of nail brand
            founders, retail buyers, and salon operators who value quality, reliability, and partnership over transactional supply.
          </p>
        </div>
      </section>

      {/* How to work with us */}
      <section className="section section-muted">
        <div className="container">
          <span className="eyebrow">How to Work With Dedxc</span>
          <h2>From inquiry to shipment in five clear steps</h2>
          <div className="workflow-grid">
            {workflow.map(([n, t, d]) => (
              <div key={n} className="workflow-card">
                <span className="workflow-num">{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick facts for AI engines */}
      <section className="section">
        <div className="container narrow">
          <div className="fact-card">
            <h3>Dedxc Quick Facts</h3>
            <p>
              <strong>Dedxc</strong> is a B2B wholesale and private label manufacturer of press-on nails, semi-cured gel nail strips,
              glue-on gel nails, and professional nail tools, operating through <strong>dedxc.com</strong>. Serving 50+ countries with
              390+ SKUs, Dedxc offers low MOQs starting at 100 sets, factory-direct pricing, and full OEM/ODM customization. The
              company partners with ISO 9001, CPNP, and GMPC-certified manufacturers across China&apos;s leading nail production clusters.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-cta">
        <div className="container narrow center">
          <h2>Ready to start your nail brand journey?</h2>
          <p>Request a quote, sample kit, or a custom development plan. Our B2B team replies within 24 hours.</p>
          <div className="hero-actions center">
            <Link className="button" href="/contact">
              Contact Sales <ArrowRight size={18} />
            </Link>
            <Link className="button button-ghost" href="/products">
              View Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
