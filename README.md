# IMPORTA 🍜🍫🍬

Online store for imported snacks and food, rebuilt from the former LAPKA pet-store MVP.

## Concept

IMPORTA focuses on real imported products rather than a generic demo catalog:

- Korean ramen and spicy food: Buldak, Nongshim
- European chocolate and sweets
- gummies, cookies and wafers
- snacks and drinks
- filters by category, brand and country/market
- PWA storefront optimized for mobile

## Current status

The storefront is already reworked for imported food. The seed catalog contains real product names, but prices and availability are intentionally disabled until a real B2B supplier price list/feed is connected.

This prevents fake prices, fake stock and accidental zero-price checkout.

## Existing store infrastructure retained

- Next.js App Router
- responsive storefront
- catalog, search, filters and favorites
- product pages
- persistent cart
- checkout and local order history
- admin dashboard
- Nova Poshta proxy
- Supabase groundwork
- PWA
- Vercel deployment
- GitHub Actions validation

## Supplier onboarding

See [SUPPLIERS.md](./SUPPLIERS.md).

The preferred production flow is:

1. receive CSV/XLSX/XML/YML/API feed from an importer;
2. normalize SKU, EAN, title, brand, country, image, cost, stock and expiry;
3. calculate retail price using pricing rules;
4. sync into the catalog database;
5. publish only products with confirmed price and stock.

## Development

```bash
npm install
npm run dev
npm run build
```
