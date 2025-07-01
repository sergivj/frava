export async function createCheckoutSession() {
  const params = new URLSearchParams();
  params.append('success_url', `${process.env.NEXT_PUBLIC_BASE_URL}/activities`);
  params.append('cancel_url', process.env.NEXT_PUBLIC_BASE_URL ?? '');
  params.append('mode', 'payment');
  params.append('line_items[0][price]', process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? '');
  params.append('line_items[0][quantity]', '1');
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
}
