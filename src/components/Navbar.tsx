"use client";

import { useEffect, useState } from "react";
import StravaLoginButton from "@/src/components/StravaLoginButton";

interface Athlete {
  firstname: string;
  lastname: string;
  profile: string;
}

export default function Navbar() {
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/strava/athlete")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.athlete) setAthlete(data.athlete);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    fetch("/api/strava/logout", { method: "POST" }).then(() => {
      setAthlete(null);
      setOpen(false);
      window.location.href = "/";
    });
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-orange-500 text-white">
      <div className="text-lg font-bold">Frava</div>
      {athlete ? (
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src={athlete.profile}
              alt="profile"
              className="w-8 h-8 rounded-full border"
            />
            <span>{athlete.firstname} {athlete.lastname}</span>
          </button>
          {open && (
            <ul className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow">
              <li>
                <a
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Perfil
                </a>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <StravaLoginButton />
      )}
    </nav>
  );
}
