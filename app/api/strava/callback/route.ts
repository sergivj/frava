import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const client_id = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const client_secret = process.env.STRAVA_CLIENT_SECRET;

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

    // Guardar token en cookie segura
    const isLocal = req.headers.get("host")?.startsWith("192.168.") || req.headers.get("host")?.includes("localhost");

    const cookieHeader = `strava_token=${data.access_token}; Path=/; HttpOnly; ${
      isLocal ? "" : "Secure;"
    } SameSite=Lax; Max-Age=21600`;

    return NextResponse.redirect(new URL("https://frava.vercel.app/activities", req.url), {
      headers: {
        "Set-Cookie": cookieHeader,
      },
    });
  } catch (error) {
    console.error("Error al llamar a Strava:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
