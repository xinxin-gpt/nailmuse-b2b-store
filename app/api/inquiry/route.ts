import { NextResponse } from "next/server";

const required = ["name", "email", "company", "country", "message"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    for (const field of required) {
      if (!body[field] || String(body[field]).trim().length < 2) {
        return NextResponse.json({ ok: false, error: `Missing ${field}` }, { status: 400 });
      }
    }
    const email = String(body.email);
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.INQUIRY_TO_EMAIL;
    const from = process.env.INQUIRY_FROM_EMAIL;
    if (apiKey && to && from) {
      const text = Object.entries(body).map(([key, value]) => `${key}: ${value}`).join("\n");
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [to], reply_to: email, subject: `New B2B inquiry from ${body.company}`, text })
      });
      if (!response.ok) return NextResponse.json({ ok: false, error: "Email service error" }, { status: 502 });
    } else {
      console.log("Demo inquiry received:", body);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
