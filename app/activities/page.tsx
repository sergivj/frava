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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tus actividades recientes</h1>

      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-4">
        {activities.map((activity) => (
          <Link
            key={activity.id}
            href={`/activities/${activity.id}`}
            className="block border rounded p-4 shadow hover:bg-gray-50"
          >
            <h2 className="text-lg font-semibold">{activity.name}</h2>
            <p>Tipo: {activity.type}</p>
            <p>Distancia: {(activity.distance / 1000).toFixed(2)} km</p>
            <p>Duración: {(activity.moving_time / 60).toFixed(0)} minutos</p>
          </Link>
        ))}
      </ul>
    </div>
  );
}
