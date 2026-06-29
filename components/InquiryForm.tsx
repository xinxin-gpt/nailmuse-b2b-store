"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Props = { compact?: boolean; product?: string };

export function InquiryForm({ compact = false, product = "" }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className={`inquiry-form ${compact ? "compact" : ""}`} onSubmit={submit}>
      <input type="hidden" name="product" value={product} />
      <div className="form-grid">
        <label>Full name<input name="name" required placeholder="Your name" /></label>
        <label>Business email<input name="email" type="email" required placeholder="you@company.com" /></label>
        <label>Company<input name="company" required placeholder="Company / brand name" /></label>
        <label>Country / Region<input name="country" required placeholder="United States" /></label>
        <label>WhatsApp / Phone<input name="phone" placeholder="+1 ..." /></label>
        <label>Estimated order quantity<select name="quantity" defaultValue=""><option value="" disabled>Select quantity</option><option>100–499 sets</option><option>500–1,999 sets</option><option>2,000–9,999 sets</option><option>10,000+ sets</option></select></label>
      </div>
      <label>What do you need?<textarea name="message" required rows={compact ? 4 : 6} placeholder="Tell us your target style, quantity, packaging, target price and delivery date." /></label>
      <label className="consent"><input type="checkbox" required /> I agree to be contacted about this business inquiry.</label>
      <button className="button" disabled={status === "sending"}>{status === "sending" ? "Sending..." : <>Send Inquiry <Send size={17}/></>}</button>
      {status === "success" && <p className="form-success">Thank you. Your inquiry has been received.</p>}
      {status === "error" && <p className="form-error">Unable to send. Please email us directly.</p>}
    </form>
  );
}
