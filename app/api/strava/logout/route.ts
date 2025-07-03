import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.redirect(new URL("https://frava.vercel.app/", req.url), {
    headers: {
      "Set-Cookie": "strava_token=; Path=/; Max-Age=0",
    },
  });
}
