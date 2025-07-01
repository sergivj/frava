'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      fetch(`/api/strava/token?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            localStorage.setItem('strava_token', data.access_token);
            router.replace('/activities');
          }
        });
    }
  }, [router]);

  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI;
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=read,activity:read_all`;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <a
        className="px-6 py-3 rounded bg-orange-500 text-white"
        href={authUrl}
      >
        Login with Strava
      </a>
    </div>
  );
}
