export async function exchangeToken(code: string) {
  const params = new URLSearchParams();
  params.append('client_id', process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID ?? '');
  params.append('client_secret', process.env.STRAVA_CLIENT_SECRET ?? '');
  params.append('code', code);
  params.append('grant_type', 'authorization_code');
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  if (!res.ok) throw new Error('Failed to exchange token');
  return res.json();
}

export async function fetchActivities(token: string) {
  const res = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=30', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load activities');
  return res.json();
}

export async function fetchActivity(id: string, token: string) {
  const res = await fetch(`https://www.strava.com/api/v3/activities/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load activity');
  return res.json();
}
