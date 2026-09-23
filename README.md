# LAPKA 🐾

Production-oriented MVP of a Ukrainian online pet store built with Next.js App Router.

## Implemented
- responsive storefront
- catalog with search/filter URLs and favorites
- static SEO-friendly product pages
- persistent cart, pet profile, favorites and local order history
- checkout with cash-on-delivery flow
- order API route
- admin dashboard
- PWA manifest + icon
- Nova Poshta API proxy (requires key)
- supplier integration status API
- GitHub Actions build validation
- Vercel-ready deployment

## Run locally
```bash
npm install
npm run dev
```

## Environment variables
Copy `.env.example` to `.env.local`.

Real Nova Poshta, supplier-feed and payment credentials must be added as encrypted Vercel Environment Variables, never committed to GitHub.

## Next production integrations
1. Obtain XML/YML feed URLs from ZooBaza, Todli and COLLAR.
2. Add supplier secrets to Vercel.
3. Add a persistent database for customers/orders/catalog sync.
4. Add merchant credentials for online payment.
5. Protect /admin with authentication.
