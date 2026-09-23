export type PricingRule = { category: string; markupPercent: number; minProfitUAH: number };

export const pricingRules: PricingRule[] = [
  { category: 'Корм', markupPercent: 15, minProfitUAH: 120 },
  { category: 'Ласощі', markupPercent: 22, minProfitUAH: 70 },
  { category: 'Іграшки', markupPercent: 28, minProfitUAH: 80 },
  { category: 'Амуніція', markupPercent: 30, minProfitUAH: 120 },
  { category: 'Догляд', markupPercent: 25, minProfitUAH: 80 },
  { category: 'Лежаки', markupPercent: 32, minProfitUAH: 180 },
  { category: 'Миски', markupPercent: 28, minProfitUAH: 80 },
];

const roundRetail = (value: number) => {
  if (value < 500) return Math.ceil(value / 10) * 10 - 1;
  if (value < 2000) return Math.ceil(value / 50) * 50 - 1;
  return Math.ceil(value / 100) * 100 - 1;
};

export function calculateRetailPrice(cost: number, category: string, recommendedRetail?: number) {
  const rule = pricingRules.find(r => r.category === category) ?? { category, markupPercent: 25, minProfitUAH: 100 };
  const byMarkup = cost * (1 + rule.markupPercent / 100);
  const byMinProfit = cost + rule.minProfitUAH;
  const base = Math.max(byMarkup, byMinProfit);
  const calculated = roundRetail(base);
  if (recommendedRetail && recommendedRetail > calculated) return Math.round(recommendedRetail);
  return calculated;
}

export function profitStats(cost: number, retail: number) {
  const profit = retail - cost;
  return {
    profit,
    markupPercent: cost > 0 ? (profit / cost) * 100 : 0,
    marginPercent: retail > 0 ? (profit / retail) * 100 : 0,
  };
}
