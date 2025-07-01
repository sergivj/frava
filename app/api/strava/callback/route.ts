// /app/api/strava/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const client_id = "165786";
  const client_secret = process.env.STRAVA_CLIENT_SECRET; // Asegúrate de tenerlo en .env

  try {
    const res = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
        grant_type: "authorization_code",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error al obtener el token:", data);
      return NextResponse.json(data, { status: 400 });
    }

    // Puedes guardar el token en DB, cookie, sesión, etc.
    return NextResponse.redirect(new URL("/activities", req.url), {
      headers: {
        "Set-Cookie": `strava_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=21600`,
      },
    });
  } catch (error) {
    console.error("Error al llamar a Strava:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
