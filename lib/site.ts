export const siteConfig = {
  name: "Dedxc Pro",
  legalName: "Your Nail Products Co., Ltd.",
  tagline: "OEM & Wholesale Nail Products for Global Beauty Brands",
  description:
    "B2B manufacturer and wholesale supplier of press-on nails, gel nail products and custom nail collections.",
  email: "sales@yourdomain.com",
  phone: "+86 000 0000 0000",
  whatsapp: "+86 000 0000 0000",
  address: "Your Factory Address, China",
  domain: process.env.NEXT_PUBLIC_SITE_URL || "https://www.yourdomain.com",
  r2BaseUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "",
  navigation: [
    { label: "Products", href: "/products" },
    { label: "OEM / ODM", href: "/oem-odm" },
    { label: "Wholesale", href: "/wholesale" },
    { label: "Factory", href: "/factory" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" }
  ]
};

export function asset(path: string) {
  if (/^https:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return siteConfig.r2BaseUrl ? `${siteConfig.r2BaseUrl}${normalized}` : normalized;
}
