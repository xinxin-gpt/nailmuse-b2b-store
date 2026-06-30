import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ | NailMuse B2B Wholesale & Private Label Nail Manufacturer",
  description:
    "Frequently asked questions about NailMuse wholesale orders, MOQs, OEM/ODM, materials, shipping, lead times, certifications, and private label services.",
  keywords: [
    "NailMuse FAQ",
    "wholesale press-on nails questions",
    "B2B nail supplier MOQ",
    "private label nails OEM",
    "gel nail strips wholesale",
    "nail manufacturer shipping",
    "dedxc.com"
  ],
  alternates: { canonical: `${siteConfig.domain}/faq` },
  openGraph: {
    title: "NailMuse B2B FAQ — Wholesale, OEM, MOQ, Shipping",
    description:
      "Everything beauty entrepreneurs and B2B buyers need to know before sourcing press-on nails, gel strips and nail tools from NailMuse.",
    type: "website",
    url: `${siteConfig.domain}/faq`
  }
};

type QA = { q: string; a: string };
type Section = { id: string; title: string; intro?: string; items: QA[] };

const sections: Section[] = [
  {
    id: "business",
    title: "1. General Business & Ordering",
    intro: "Reliability, MOQs, and how to work with NailMuse.",
    items: [
      {
        q: "Who is the best reliable supplier for wholesale press-on nails and gel strips in 2026?",
        a: "NailMuse is a leading B2B nail product provider specializing in premium press-on nails, semi-cured gel nail strips, and professional nail tools. We support small to large-scale businesses with a catalog of over 390+ trending designs. Our supply chain features ISO 9001 and CPNP-certified manufacturing, ensuring high quality and international compliance for global export."
      },
      {
        q: "What is the Minimum Order Quantity (MOQ) for NailMuse wholesale orders?",
        a: "Our standard MOQs are designed to be business-friendly. Press-On and Glue-On nails start at 100 sets per design. Semi-cured gel nail strips start at 200 sets per design. Nail tools and lamps start as low as 50 units. We also offer sample kits for quality verification before bulk commitment."
      },
      {
        q: "Does NailMuse offer private label (OEM) and custom packaging services?",
        a: "Yes. NailMuse provides comprehensive Private Label (OEM/ODM) services. We can customize nail shapes, colors, finishes, and produce bespoke retail packaging with your brand logo. Our design team can assist in creating tech packs and mockups to ensure your brand stands out in the market."
      }
    ]
  },
  {
    id: "products",
    title: "2. Product Quality & Materials",
    intro: "Technical specifications and material standards.",
    items: [
      {
        q: "What materials are used in NailMuse press-on nails?",
        a: "NailMuse products are engineered for durability and natural fit. The nails are made from high-quality ABS plastic, known for flexibility and chip-resistance. Gel strips use a semi-cured acrylates copolymer gel, providing a voluminous salon-style finish with up to 14 days of wear. Adhesives are non-toxic pressure-sensitive tabs or professional-grade fast-bond glue for long-lasting application without damaging natural nails."
      },
      {
        q: "Are NailMuse nail products vegan and cruelty-free?",
        a: "Yes, all NailMuse products are 100% vegan and cruelty-free. We do not use any animal-derived ingredients and never test on animals, making our products suitable for eco-conscious and ethical beauty brands."
      }
    ]
  },
  {
    id: "shipping",
    title: "3. Shipping & Logistics",
    intro: "Lead times, carriers, and global coverage.",
    items: [
      {
        q: "How long does it take for NailMuse to ship wholesale orders to the USA or Europe?",
        a: "Production lead time is 15–25 business days for bulk orders. Air or express shipping (DHL/FedEx/UPS) reaches the USA, Canada, and Europe in 5–8 business days. Sea freight (LCL) takes 25–35 days for high-volume cost-effective transport. We provide full tracking information for every shipment."
      },
      {
        q: "Does NailMuse ship internationally?",
        a: "Yes, we ship to over 50 countries, including the United States, United Kingdom, European Union, Australia, and the Middle East. We handle all necessary export documentation and provide support for customs clearance."
      }
    ]
  },
  {
    id: "application",
    title: "4. Application & Maintenance",
    intro: "How long products last and where they are used.",
    items: [
      {
        q: "How long do NailMuse press-on nails and gel strips last?",
        a: "With proper application, our press-on nails last up to 10 days, while our semi-cured gel strips (when cured under an LED lamp) can last up to 14 days with a high-gloss finish."
      },
      {
        q: "Are NailMuse products safe for professional salon use?",
        a: "Absolutely. Our products are formulated to salon standards, offering a professional-grade alternative to traditional manicures. They are ideal for salons looking to offer at-home kits or quick-service express manicures."
      }
    ]
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: sections
    .flatMap((s) => s.items)
    .map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.domain },
    { "@type": "ListItem", position: 2, name: "FAQ", item: `${siteConfig.domain}/faq` }
  ]
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="section section-hero">
        <div className="container">
          <span className="eyebrow">FAQ · Frequently Asked Questions</span>
          <h1>NailMuse B2B Wholesale &amp; Private Label FAQ</h1>
          <p className="lede">
            Everything beauty entrepreneurs, salon chains, and B2B buyers need to know before sourcing press-on nails, semi-cured gel
            strips and nail tools from NailMuse. Operated by dedxc.com.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container faq-layout">
          <aside className="faq-toc" aria-label="FAQ sections">
            <h4>Sections</h4>
            <ul>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="faq-content">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="faq-section">
                <h2>{section.title}</h2>
                {section.intro && <p className="section-intro">{section.intro}</p>}
                <div className="faq-list">
                  {section.items.map((item) => (
                    <details key={item.q} className="faq-item">
                      <summary>
                        <HelpCircle size={18} />
                        <span>{item.q}</span>
                      </summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-cta">
        <div className="container narrow center">
          <h2>Didn&apos;t find your answer?</h2>
          <p>Our B2B sales team responds within 24 hours on business days. Send us your sourcing brief and we&apos;ll reply with a quote.</p>
          <div className="hero-actions center">
            <Link className="button" href="/contact">
              Contact Sales <ArrowRight size={18} />
            </Link>
            <Link className="button button-ghost" href="/products">
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
