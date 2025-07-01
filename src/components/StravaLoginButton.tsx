// /components/StravaLoginButton.tsx
export default function StravaLoginButton() {
  const redirectUri = "http://localhost:3000/api/strava/callback";

  const authUrl = `https://www.strava.com/oauth/authorize?client_id=165786&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&approval_prompt=force&scope=read,activity:read_all`;

  return (
    <a href={authUrl}>
      <button className="bg-orange-500 text-white px-4 py-2 rounded">
        Conectar con Strava
      </button>
    </a>
  );
}
