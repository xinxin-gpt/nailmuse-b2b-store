export type Review = {
  author: string;
  rating: number;
  comment: string;
  date: string;
  sku: string;
};

export type ReviewCatalog = {
  version: number;
  updatedAt: string;
  reviews: Review[];
};
