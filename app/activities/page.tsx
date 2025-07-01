"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Activity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  type: string;
  start_date: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/strava/activities", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.activities) {
          setActivities(data.activities);
        } else {
          setError("No se pudieron cargar las actividades");
        }
      })
      .catch(() => setError("Error al conectar con la API"));
  }, []);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tus actividades</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <ul className="grid gap-4 sm:grid-cols-2">
        {activities.map((activity) => (
          <li key={activity.id}>
            <Link
              href={`/activities/${activity.id}`}
              className="block border border-gray-200 rounded-lg p-4 bg-white shadow hover:border-orange-500 hover:shadow-md transition"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">{activity.name}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(activity.start_date).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p>Tipo: {activity.type}</p>
                <p>Distancia: {(activity.distance / 1000).toFixed(2)} km</p>
                <p>Duración: {(activity.moving_time / 60).toFixed(0)} min</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
