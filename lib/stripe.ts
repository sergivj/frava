export async function createCheckoutSession(activityId: string) {
  const params = new URLSearchParams({
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/activities/${activityId}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/activities/${activityId}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
    mode: 'payment',
    'line_items[0][price]': process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? '',
    'line_items[0][quantity]': '1',
    'shipping_address_collection[allowed_countries][0]': 'ES',
    billing_address_collection: 'required',
    'metadata[activityId]': activityId,
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
