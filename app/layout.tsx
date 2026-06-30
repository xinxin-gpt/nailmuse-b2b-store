import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: { default: `${siteConfig.name} | B2B Press-On Nail Manufacturer`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: ["press on nail manufacturer", "custom press on nails", "nail supplier", "OEM nail products", "wholesale press on nails", "semi-cured gel nail strips", "private label nails", "NailMuse", "dedxc.com"],
  openGraph: { title: siteConfig.name, description: siteConfig.description, type: "website", url: siteConfig.domain }
};

const rootOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  alternateName: "NailMuse",
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
    "Private Label Nail Products",
    "OEM Nail Manufacturing"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Sales",
    email: siteConfig.email,
    availableLanguage: ["English", "Chinese"]
  }
};

const rootWebsiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.domain,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.domain}/products?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootOrganizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootWebsiteSchema) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
