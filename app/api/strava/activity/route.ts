import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const accessToken = req.cookies.get("strava_token")?.value;

  if (!accessToken || !id) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://www.strava.com/api/v3/activities/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: "Strava API error", details: data }, { status: 400 });
    }

    return NextResponse.json({ activity: data });
  } catch (error) {
    return NextResponse.json({ error: "Error inesperado", details: error }, { status: 500 });
  }
}
