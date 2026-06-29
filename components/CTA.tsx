import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <div><span className="eyebrow light">START YOUR COLLECTION</span><h2>Turn your nail ideas into a retail-ready product line.</h2><p>Share your reference images, quantity and target market. Our team will reply with recommendations and a quotation.</p></div>
        <div className="cta-actions"><Link className="button button-light" href="/contact">Request a Quote <ArrowRight size={18}/></Link><Link className="button button-outline-light" href="/catalog">Download Catalog</Link></div>
      </div>
    </section>
  );
}
