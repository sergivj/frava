import { NextRequest, NextResponse } from 'next/server';
import { exchangeToken } from '@/lib/strava';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }
  try {
    const data = await exchangeToken(code);
    return NextResponse.json({ access_token: data.access_token });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 });
  }
}
