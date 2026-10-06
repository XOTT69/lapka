# IMPORTA pricing rules

These rules are for planning and catalog validation. They do not replace market checks.

## 1. Never publish a zero or unconfirmed price

A product is sellable only when:

- purchase price is confirmed;
- stock is positive;
- expiry / remaining shelf life is acceptable;
- source is traceable;
- required importer/label data is available.

## 2. Landed cost

For each SKU calculate:

```
landed_cost =
  purchase_price
  + inbound_delivery_per_unit
  + packaging_per_unit
  + expected_payment_fee
  + expected_loss_allowance
```

For direct EU imports also add customs/brokerage and any other import-related costs.

## 3. Target gross margin

Initial targets before promotions:

- impulse / low-ticket sweets: 45–55%
- chocolate / wafers / spreads: 35–45%
- drinks: 35–45%
- viral / scarce products (e.g. Buldak): 30–40%
- large multipacks / price-sensitive goods: 25–35%

Gross margin is calculated from the retail price:

```
gross_margin = (retail_price - landed_cost) / retail_price
```

Do not confuse margin with markup.

## 4. Guardrails

- minimum absolute contribution target: 15 UAH per low-ticket unit where realistic;
- never price below landed cost;
- compare against major Ukrainian retail and marketplaces before publishing;
- do not chase a competitor price if it destroys contribution margin;
- reserve room for 5–10% promotions on selected SKUs.

## 5. Price rounding

Prefer simple retail endings:

- under 100 UAH: round to 5 or 9;
- 100–299 UAH: round to 9;
- 300+ UAH: use clean 9/49/99 endings only when it does not distort margin.

## 6. First-launch objective

The first 30–50 live SKUs should optimize for:

1. product variety;
2. recognizable brands;
3. repeat purchase potential;
4. shelf life;
5. stable replenishment;
6. margin after real logistics and fees.

The goal is not to fill the catalog with hundreds of products before supply is reliable.
