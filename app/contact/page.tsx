import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Contact & Request a Quote", description: "Send a B2B nail product inquiry for pricing, samples, customization and wholesale orders." };
export default function ContactPage(){return <><section className="page-hero"><div className="container"><span className="eyebrow">CONTACT SALES</span><h1>Tell Us What You Want to Source</h1><p>Share your product reference, quantity, packaging requirements and target delivery date.</p></div></section><section className="section"><div className="container contact-grid"><aside className="contact-aside"><h2>Business contact</h2><p>We normally review inquiries according to project detail and commercial fit.</p><div><Mail/><span><small>Email</small>{siteConfig.email}</span></div><div><MessageCircle/><span><small>WhatsApp</small>{siteConfig.whatsapp}</span></div><div><MapPin/><span><small>Factory / Office</small>{siteConfig.address}</span></div><div className="contact-tip"><strong>For a faster quote, include:</strong><ul><li>Product images or links</li><li>Quantity per design</li><li>Custom packaging needs</li><li>Target market and delivery date</li></ul></div></aside><InquiryForm/></div></section></>}
