export async function POST(req: Request) {
  const payload = await req.json().catch(() => null);
  if (!payload) return new Response('bad request', { status: 400 });

  // TODO: persist verified payment state in DB.
  // For production, verify the webhook signature using monobank's public key endpoint.
  console.log('mono webhook', {
    invoiceId: payload.invoiceId,
    status: payload.status,
    amount: payload.amount,
    reference: payload.reference,
  });

  return new Response('ok', { status: 200 });
}
