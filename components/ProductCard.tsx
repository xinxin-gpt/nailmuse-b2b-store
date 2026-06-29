import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import { asset } from "@/lib/site";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-image-wrap">
        <img src={asset(product.image)} alt={product.name} className="product-image" />
        <span className="product-category">{product.category}</span>
      </Link>
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p>{product.short}</p>
        <div className="product-meta"><span>MOQ: {product.moq}</span><span>{product.leadTime}</span></div>
        <Link className="text-link" href={`/products/${product.slug}`}>View details <ArrowUpRight size={16}/></Link>
      </div>
    </article>
  );
}
