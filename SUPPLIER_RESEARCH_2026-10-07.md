# Supplier research — 2026-10-07

This document records public B2B/wholesale benchmarks found for IMPORTA. These are not treated as a live feed. Before publishing a price or stock level, confirm it with the supplier.

## Recommended launch suppliers

### SALUTE / CenaOptom

Website: https://www.cenaoptom.com.ua/

Why it is useful:
- public wholesale prices;
- minimum wholesale order: 3000 UAH;
- order quantities must be carton multiples;
- dispatch 1–3 business days;
- Nova Poshta delivery;
- suitable for a small test launch.

Public benchmarks seen on 2026-10-07:
- Ritter Sport assorted 100 g — 62 UAH/unit, carton 30.
- Haribo Harry Potter 160 g — 55 UAH/unit, carton 10.
- Haribo Roulette 25 g — 10 UAH/unit, carton 50.
- Capri-Sun 200 ml — 15.5 UAH/unit, carton-only.
- Nutella & Go 52 g — 66 UAH/unit, carton 12.
- Kinder Joy — 43 UAH/unit, carton 72.
- Raffaello 150 g — 152 UAH/unit, carton 6.

Contact:
- info@cenaoptom.com.ua
- +380 96 390 98 90

Action:
Ask for XLSX/CSV/XML/YML/API feed with SKU, EAN, cost, stock, carton quantity, expiry, product images and allergens.

### EVROCASH

Website: https://evrocashopt.com.ua/

Why it is useful:
- direct European imports;
- more than 2000 product positions advertised;
- categories include sweets, drinks, snacks, wafers, spreads and Asian goods;
- public item-level wholesale prices;
- documentation and delivery across Ukraine.

Current conditions found:
- minimum order: 10,000 UAH on the current site;
- delivery by Nova Poshta / Delivery;
- orders confirmed before 15:00 generally dispatch within 48 hours.

Public benchmarks:
- Samyang Buldak Black 140 g — 77 UAH/unit, currently out of stock.
- Samyang Buldak 2X Spicy 140 g — 75 UAH/unit, currently out of stock.
- Samyang Hot Chicken Cheese 140 g — 98 UAH/unit, currently out of stock.
- Ritter Sport Erdbeer Joghurt 100 g — 55 UAH/unit, carton 12, currently out of stock.
- Haribo Roulette 25 g — 12 UAH/unit, carton 50, currently out of stock.
- Haribo 160 g variants — around 48 UAH/unit on indexed product pages.

Contact:
- +380 68 011 95 52
- +380 98 714 96 59
- oksanam1311@gmail.com
- Lviv, Shuvar market

Important:
Their public Buldak pricing is attractive, but stock was unavailable when checked. Treat EVROCASH as a price benchmark and secondary source until regular Samyang availability is confirmed.

### PlayBerry

Website: https://playberry.com.ua/

Useful for:
- Haribo/Trolli/FINI and impulse sweets;
- visible carton/pack structure;
- automatic quantity discounts.

Conditions found:
- dynamic per-product quantity discount;
- extra wholesale discount: 3% from 50,000 UAH/order and 5% from 150,000 UAH/order.

Examples:
- Trolli 1 kg display pack — 325 UAH for pack in the checked listing;
- some SKUs give another 3% from 3 packs.

Contact:
- +380 68 123 22 77
- playberry.ua@gmail.com

### Store Food Distribution

Website: https://storefood.com.ua/

Profile:
- official importer/distributor of European food in Ukraine since 2009;
- direct manufacturer relationships;
- categories include sweets, snacks, cereals, coffee, sauces and more;
- has an explicit “Get price list” workflow.

Contact:
- +38 066 582 19 56
- Kyiv, V. Sosiury St. 6

Action:
Request a full B2B price list and machine-readable feed. Their website does not expose public wholesale prices.

### EGastronom

Website: https://egastronom.com.ua/

Useful as:
- secondary Buldak / imported food supplier;
- public carton wholesale pricing;
- benchmark when primary suppliers are out of stock.

Example checked:
- Buldak Rosé 140 g — 121 UAH/unit from 40 units.
- minimum site order: 750 UAH.

Contact:
- +380 67 165 23 65
- +380 73 240 73 65
- vpegastronom@gmail.com
- purchasing: egastronompurchase@gmail.com

This Buldak price is materially worse than the old/current indexed EVROCASH Buldak benchmark, so it should be fallback stock rather than the primary source.

## Direct Samyang route

Official source:
https://www.samyangfoods.com/eng/information/corporation/index.do

Samyang Foods Europe B.V. is the official European sales subsidiary of Samyang Foods and oversees distribution/sales of Samyang products across Europe.

- Handelsweg 53, 1181 ZA Amstelveen, Netherlands
- +31 88 030 9400

Goal:
Ask who the authorized distributor/importer for Ukraine is and request direct B2B terms or a referral.

## Retail benchmark sanity check

These are only reference retail prices, not our planned prices:
- Ritter Sport 100 g: around 104–129 UAH at large Ukrainian retailers for common variants.
- Haribo Harry Potter 160 g: around 149 UAH in marketplace retail.
- Capri-Sun 200 ml x10: around 254 UAH, or ~25.4 UAH/unit.
- Buldak Carbonara: around 105–110 UAH/unit at multi-unit marketplace offers; some retail sellers are much higher.

Illustrative gross margin if purchase cost stayed at the public wholesale benchmark:
- Ritter Sport: cost 62, sell 119 → ~47.9% gross margin.
- Haribo Harry Potter: cost 55, sell 149 → ~63.1% gross margin.
- Capri-Sun: cost 15.5, sell 25.4 → ~39.0% gross margin.
- Buldak: cost 75–77, sell 110 → ~30–32% gross margin.

Actual margin must include payment fees, packaging, delivery subsidies, spoilage/expiry, taxes and promotions.

## Feed requirement

For the production catalog, prefer this schema:

- supplier_id
- supplier_sku
- ean
- title
- brand
- category
- country
- weight_or_volume
- purchase_price_uah
- rrp_uah
- stock
- carton_qty
- minimum_order_qty
- best_before
- image_urls[]
- ingredients
- allergens
- importer_label
- updated_at

Do not scrape retail storefront prices into the production catalog. Public storefront data is suitable for research/benchmarking only.
