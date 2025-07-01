import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST() {
  try {
    const session = await createCheckoutSession();
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
