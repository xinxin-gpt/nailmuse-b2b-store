export type ProductStatus = "published" | "draft" | "archived";

export type Product = {
  sku: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  images: string[];
  short: string;
  description?: string;
  moq: string;
  leadTime: string;
  priceRange?: string;
  materials: string[];
  shapes: string[];
  finishes: string[];
  colors: string[];
  sizes: string[];
  tags: string[];
  featured: boolean;
  status: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductCatalog = {
  version: 1;
  updatedAt: string;
  products: Product[];
};
