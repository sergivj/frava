'use client';

export default function StravaLoginButton() {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const redirectUri = "https://frava.vercel.app/api/strava/callback";
  const scope = "read,activity:read_all";
  const responseType = "code";
  const approvalPrompt = "force";

  const stravaWebAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&approval_prompt=${approvalPrompt}&scope=${scope}`;

  const stravaAppDeepLink = `strava://oauth/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&approval_prompt=${approvalPrompt}&scope=${scope}`;

  const handleClick = () => {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = stravaAppDeepLink;

      // Fallback al navegador si la app no se abre
      setTimeout(() => {
        window.location.href = stravaWebAuthUrl;
      }, 1200);
    } else {
      // Desktop
      window.location.href = stravaWebAuthUrl;
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600 transition cursor-pointer"
    >
      Conectar con Strava
    </button>
  );
}
