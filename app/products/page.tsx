"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { CTA } from "@/components/CTA";

/* ─── Types ─────────────────────────────────────── */
interface Product {
  sku?: string;
  slug: string;
  name: string;
  category?: string;
  image?: string;
  short?: string;
  moq?: string;
  lead_time?: string;
  price_range?: string;
  colors?: string;
  finishes?: string;
  shapes?: string;
  tags?: string;
  featured?: boolean | string;
  status?: string;
}

/* ─── Category taxonomy ──────────────────────────── */
const GROUPS = [
  {
    id: "all",
    label: "全部产品",
    labelEn: "All",
    emoji: "✦",
    cats: [] as string[],
  },
  {
    id: "press-on",
    label: "穿戴甲",
    labelEn: "Press-On Nails",
    emoji: "💅",
    desc: "免胶/粘贴款即贴美甲，多形状多色号",
    cats: ["Press-On Nails", "Glue-On Gel Nails", "Luxe Glue-On Gel Nails"],
  },
  {
    id: "gel-strips",
    label: "凝胶贴片",
    labelEn: "Gel Nail Strips",
    emoji: "✨",
    desc: "半固化凝胶贴，LED 照射 60 秒，持久 14 天",
    cats: ["Gel Nail Strips", "Gel Nail Strip Kits"],
  },
  {
    id: "gel-polish",
    label: "甲油胶 & 套装",
    labelEn: "Gel Polish",
    emoji: "🧴",
    desc: "甲油胶单色、光疗套装及配件",
    cats: ["Gel Polish", "Gel Polish Kits", "Nail Care & Top Coat"],
  },
  {
    id: "extensions",
    label: "延长甲",
    labelEn: "Gel Extensions",
    emoji: "🌸",
    desc: "软凝胶延长甲片及配套工具",
    cats: ["Gel Extensions", "Gel Extension Tips", "Gel Extension Kits"],
  },
  {
    id: "tools",
    label: "工具 & 配件",
    labelEn: "Tools & Accessories",
    emoji: "🔧",
    desc: "美甲灯、打磨机、胶水及专业配件",
    cats: [
      "Nail Tools",
      "Chrome Powder & Tools",
      "Nail Glue & Adhesives",
      "Nail Accessories",
      "Accessories",
      "Nail Kits",
    ],
  },
];

function getCatGroup(category = ""): string {
  for (const g of GROUPS) {
    if (g.cats.includes(category)) return g.id;
  }
  return "all";
}

/* ─── Product Card ───────────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  const img = product.image?.startsWith("http")
    ? product.image
    : product.image
    ? `https://pub-68afa0bd85f9439898da18ca3e5974fa.r2.dev/${product.image}`
    : "";

  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-image-wrap">
        {img ? (
          <img src={img} alt={product.name} className="product-image" loading="lazy" />
        ) : (
          <div className="product-image-placeholder">
            <span>{product.name.charAt(0)}</span>
          </div>
        )}
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}
        {(product.featured === true || product.featured === "true") && (
          <span className="product-badge">Featured</span>
        )}
      </Link>
      <div className="product-card-body">
        <h3>{product.name}</h3>
        {product.short && <p className="product-short">{product.short.slice(0, 80)}{product.short.length > 80 ? "…" : ""}</p>}
        <div className="product-meta">
          {product.moq && <span>MOQ: {product.moq}</span>}
          {product.lead_time && <span>{product.lead_time}</span>}
          {product.price_range && <span>{product.price_range}</span>}
        </div>
        <Link className="text-link" href={`/products/${product.slug}`}>
          查看详情 <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}

/* ─── Main Page ──────────────────────────────────── */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState("all");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "featured" | "name">("featured");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.products ?? [];
        setProducts(list);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: products.length };
    for (const g of GROUPS.slice(1)) {
      map[g.id] = products.filter((p) => g.cats.includes(p.category ?? "")).length;
    }
    return map;
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    // Group filter
    if (activeGroup !== "all") {
      const group = GROUPS.find((g) => g.id === activeGroup);
      if (group) list = list.filter((p) => group.cats.includes(p.category ?? ""));
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.tags?.toLowerCase().includes(q) ||
          p.colors?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "featured") {
      list.sort((a, b) => {
        const af = a.featured === true || a.featured === "true" ? 1 : 0;
        const bf = b.featured === true || b.featured === "true" ? 1 : 0;
        return bf - af;
      });
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, activeGroup, search, sortBy]);

  const activeGroupMeta = GROUPS.find((g) => g.id === activeGroup);

  return (
    <>
      {/* Hero */}
      <section className="page-hero cat-hero">
        <div className="container">
          <span className="eyebrow">PRODUCT CATALOG</span>
          <h1>批发&定制美甲产品</h1>
          <p>390+ 款 B2B 生产级产品 · 覆盖穿戴甲、凝胶贴片、甲油胶、延长甲、工具配件 · 低最小订量起订</p>

          {/* Search bar */}
          <div className="cat-search-wrap">
            <Search size={18} className="cat-search-icon" />
            <input
              className="cat-search"
              type="text"
              placeholder="搜索产品名、颜色、SKU……"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="cat-search-clear" onClick={() => setSearch("")}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <nav className="cat-tabs-wrap" aria-label="Product categories">
        <div className="container">
          <ul className="cat-tabs">
            {GROUPS.map((g) => (
              <li key={g.id}>
                <button
                  className={`cat-tab${activeGroup === g.id ? " active" : ""}`}
                  onClick={() => setActiveGroup(g.id)}
                >
                  <span className="cat-tab-emoji">{g.emoji}</span>
                  <span className="cat-tab-label">{g.label}</span>
                  <span className="cat-tab-count">{counts[g.id] ?? 0}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Category description band */}
      {activeGroup !== "all" && activeGroupMeta?.desc && (
        <div className="cat-desc-band">
          <div className="container">
            <strong>{activeGroupMeta.labelEn}</strong> — {activeGroupMeta.desc}
          </div>
        </div>
      )}

      {/* Toolbar: result count + sort */}
      <section className="section cat-section">
        <div className="container">
          <div className="cat-toolbar">
            <p className="cat-result-count">
              {loading ? "加载中…" : (
                <>
                  找到 <strong>{filtered.length}</strong> 款产品
                  {search && <> · 关键词：<em>"{search}"</em></>}
                </>
              )}
            </p>
            <div className="cat-sort">
              <SlidersHorizontal size={15} />
              <label htmlFor="sort-select">排序：</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="featured">推荐优先</option>
                <option value="name">名称 A→Z</option>
                <option value="default">默认顺序</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="cat-loading">
              <div className="cat-spinner" />
              <p>正在加载产品目录…</p>
            </div>
          ) : filtered.length ? (
            <div className="product-grid">
              {filtered.map((p) => (
                <ProductCard key={p.sku ?? p.slug} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-catalog">
              <h2>未找到匹配产品</h2>
              <p>
                {search
                  ? `没有找到包含 "${search}" 的产品，请尝试其他关键词。`
                  : "该分类暂无产品，请联系我们获取最新目录。"}
              </p>
              {search && (
                <button className="button" onClick={() => setSearch("")}>
                  清除搜索
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <CTA />
    </>
  );
}
