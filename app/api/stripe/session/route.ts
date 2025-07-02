// /app/api/stripe/session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session_id = req.nextUrl.searchParams.get('session_id');

  if (!session_id) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${session_id}`, {
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Error al recuperar la sesión de Stripe:', data);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }

  return NextResponse.json(data);
}
