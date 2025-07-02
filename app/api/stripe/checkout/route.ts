import { createCheckoutSession } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // 👈 Esto faltaba
    const activityId = body.activityId;

    if (!activityId) {
      return NextResponse.json({ error: 'Missing activityId' }, { status: 400 });
    }

    const session = await createCheckoutSession(activityId);
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
