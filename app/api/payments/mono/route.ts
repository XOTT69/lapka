export async function POST(req: Request) {
  const token = process.env.MONO_ACQUIRING_TOKEN;
  if (!token) {
    return Response.json(
      { configured: false, message: 'Додайте MONO_ACQUIRING_TOKEN у Vercel Environment Variables.' },
      { status: 503 }
    );
  }

  const body = await req.json();
  const amount = Math.round(Number(body.amount) * 100);

  if (!Number.isFinite(amount) || amount < 100) {
    return Response.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  const monoRes = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-Token': token,
    },
    body: JSON.stringify({
      amount,
      ccy: 980,
      merchantPaymInfo: {
        reference: body.orderId || ('LP-' + Date.now()),
        destination: 'Оплата замовлення LAPKA',
        comment: 'LAPKA pet store',
        basketOrder: Array.isArray(body.items)
          ? body.items.map((item: any) => ({
              name: String(item.name).slice(0, 128),
              qty: Number(item.qty) || 1,
              sum: Math.round(Number(item.price) * 100),
              total: Math.round(Number(item.price) * 100 * (Number(item.qty) || 1)),
              unit: 'шт.',
              code: String(item.id ?? ''),
            }))
          : undefined,
      },
      redirectUrl: baseUrl + '/orders?paid=1',
      webHookUrl: baseUrl + '/api/payments/mono/webhook',
      validity: 3600,
      paymentType: 'debit',
    }),
  });

  const data = await monoRes.json();
  return Response.json(data, { status: monoRes.status });
}
