export async function createCheckoutSession() {
  const params = new URLSearchParams({
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/activities`,
    cancel_url: process.env.NEXT_PUBLIC_BASE_URL ?? '',
    mode: 'payment',
    'line_items[0][price]': process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? '',
    'line_items[0][quantity]': '1',
  });

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Stripe Error:", data);
    throw new Error('Failed to create session');
  }

  return data;
}
