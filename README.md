# NailMuse Pro — B2B Nail Products Website with Bulk Import

A Vercel-ready B2B website for press-on nails, nail products, OEM/ODM and wholesale inquiries.

## Included

- Responsive B2B homepage and navigation
- Dynamic product catalog and product detail pages
- Protected product import admin at `/admin/import`
- CSV and XLSX import with preview, validation and error reporting
- Upsert or complete replacement import modes
- Cloudflare R2 JSON catalog persistence and automatic backups
- Bulk image upload script with generated URL manifest
- OEM/ODM, wholesale, factory, catalog and contact pages
- Inquiry form and API route
- SEO metadata, dynamic sitemap and robots rules

## Start locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

- Website: `/`
- Product import admin: `/admin/import`

Without R2 credentials the public site uses the 8 bundled demo products. Publishing from the admin requires R2 configuration.

## Product import workflow

1. Upload product images to R2 or prepare public HTTPS image URLs.
2. Download `/downloads/product-import-template.csv`.
3. Fill the product rows. Use `|` between multiple materials, shapes, colors or gallery images.
4. Open `/admin/import`, enter `PRODUCT_IMPORT_ADMIN_TOKEN`, select the file and run preview.
5. Fix invalid rows or publish the valid rows.

See `docs/DEPLOYMENT.zh-CN.md` and `docs/BULK-IMPORT.zh-CN.md`.
