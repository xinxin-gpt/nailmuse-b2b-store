"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="announcement">Factory-direct pricing · OEM/ODM support · Global shipping</div>
      <div className="container nav-wrap">
        <Link href="/" className="brand" aria-label={siteConfig.name}>
          <span className="brand-mark">NM</span>
          <span><strong>{siteConfig.name}</strong><small>B2B NAIL SUPPLY</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <Link className="button button-small desktop-quote" href="/contact">Get a Quote</Link>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav">
          {siteConfig.navigation.map((item) => <Link onClick={() => setOpen(false)} key={item.href} href={item.href}>{item.label}</Link>)}
          <Link onClick={() => setOpen(false)} className="button" href="/contact">Get a Quote</Link>
        </nav>
      )}
    </header>
  );
}
