import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("strava_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const res = await fetch("https://www.strava.com/api/v3/athlete", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: "Strava API error", details: data }, { status: res.status });
  }
  return NextResponse.json({ athlete: data });
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("strava_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const res = await fetch("https://www.strava.com/api/v3/athlete", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: "Strava API error", details: data }, { status: res.status });
  }
  return NextResponse.json({ athlete: data });
}
