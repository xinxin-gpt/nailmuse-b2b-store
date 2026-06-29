import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: { default: `${siteConfig.name} | B2B Press-On Nail Manufacturer`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: ["press on nail manufacturer", "custom press on nails", "nail supplier", "OEM nail products", "wholesale press on nails"],
  openGraph: { title: siteConfig.name, description: siteConfig.description, type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header/><main>{children}</main><Footer/></body></html>;
}
