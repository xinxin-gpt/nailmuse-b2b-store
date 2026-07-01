import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "B2B Nail Industry Blog | Trends, Sourcing & OEM Insights",
  description:
    "In-depth B2B insights on press-on nails, semi-cured gel strips, private label nail manufacturing, OEM sourcing and beauty trends from Dedxc experts.",
  keywords: [
    "nail industry blog",
    "B2B nail sourcing",
    "semi-cured gel strips guide",
    "private label nails insights",
    "press-on nails trends",
    "Dedxc blog",
    "dedxc.com"
  ],
  alternates: { canonical: `${siteConfig.domain}/blog` },
  openGraph: {
    title: "Dedxc B2B Blog — Nail Industry Insights",
    description:
      "Deep-dive guides on sourcing, OEM manufacturing, and the latest trends in the global B2B nail market.",
    type: "website",
    url: `${siteConfig.domain}/blog`
  }
};

const posts = [
  {
    slug: "semi-cured-gel-strips-b2b-guide",
    title:
      "2026 B2B Brand Upgrade Guide: Why Semi-Cured Gel Nail Strips Are the Core of Wholesale Growth",
    excerpt:
      "Semi-cured gel nail strips are rapidly replacing traditional nail polish and standard vinyl wraps. Discover the technology, profit logic, and B2B opportunities that make this category the #1 growth driver for nail brands in 2026.",
    date: "2026-07-01",
    readingTime: "5 min read",
    category: "Product Category Deep-Dive"
  }
];

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Dedxc B2B Blog",
  url: `${siteConfig.domain}/blog`,
  description:
    "B2B insights on press-on nails, semi-cured gel strips, OEM manufacturing and global beauty supply chain.",
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.domain
  },
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    datePublished: p.date,
    url: `${siteConfig.domain}/blog/${p.slug}`,
    description: p.excerpt
  }))
};

export default function BlogIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <section className="section section-hero">
        <div className="container">
          <span className="eyebrow">Blog · Industry Insights</span>
          <h1>B2B Nail Industry Knowledge Hub</h1>
          <p className="lede">
            Deep-dive guides on sourcing, OEM manufacturing, semi-cured gel technology, and the latest trends in the global B2B nail
            market — written for brand founders, salon operators, and beauty buyers.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {posts.map((post) => (
              <article key={post.slug} className="blog-card">
                <span className="blog-category">{post.category}</span>
                <h2>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p>{post.excerpt}</p>
                <div className="blog-meta">
                  <span>
                    <Calendar size={14} /> {post.date}
                  </span>
                  <span>
                    <Clock size={14} /> {post.readingTime}
                  </span>
                </div>
                <Link className="button button-small" href={`/blog/${post.slug}`}>
                  Read full article <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-cta">
        <div className="container narrow center">
          <h2>Need product-specific sourcing advice?</h2>
          <p>Talk to our B2B team and get tailored recommendations within 24 hours.</p>
          <div className="hero-actions center">
            <Link className="button" href="/contact">
              Contact Sales <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
