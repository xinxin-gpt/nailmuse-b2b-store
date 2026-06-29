import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand"><span className="brand-mark">NM</span><span><strong>{siteConfig.name}</strong><small>B2B NAIL SUPPLY</small></span></div>
          <p>{siteConfig.description}</p>
        </div>
        <div>
          <h4>Business</h4>
          <Link href="/products">Product Catalog</Link>
          <Link href="/oem-odm">OEM / ODM</Link>
          <Link href="/wholesale">Wholesale Program</Link>
          <Link href="/factory">Factory Capabilities</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p><Mail size={16}/>{siteConfig.email}</p>
          <p><MessageCircle size={16}/>{siteConfig.whatsapp}</p>
          <p><MapPin size={16}/>{siteConfig.address}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</span>
        <span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link></span>
      </div>
    </footer>
  );
}
