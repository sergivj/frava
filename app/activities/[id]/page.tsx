"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import StaticPolylineCanvas from "@/src/components/StaticPolylineCanvas";
import CustomStravaTemplate from "@/src/components/CustomStravaTemplate";

interface Activity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  map?: {
    summary_polyline?: string;
  };
}

const StravaMap = dynamic(() => import("@/src/components/StravaMap"), { ssr: false });

export default function ActivityDetailPage() {
  const { id } = useParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    const res = await fetch('/api/stripe/checkout', { method: 'POST' });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  useEffect(() => {
    if (!id) return;

    fetch(`/api/strava/activity?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.activity) {
          setActivity(data.activity);
        } else {
          setError("No se pudo cargar la actividad");
        }
      })
      .catch(() => setError("Error al conectar con la API"));
  }, [id]);

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!activity) return <p className="p-6">Cargando actividad...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{activity.name}</h1>
      <p>Tipo: {activity.type}</p>
      <p>Distancia: {(activity.distance / 1000).toFixed(2)} km</p>
      <p>Duración: {(activity.moving_time / 60).toFixed(0)} min</p>
      <p>Elevación: {activity.total_elevation_gain} m</p>
      <p>Fecha: {new Date(activity.start_date).toLocaleString()}</p>

      {activity.map?.summary_polyline && (
        <div>
        <StravaMap encodedPolyline={activity.map.summary_polyline} />

        <StaticPolylineCanvas encodedPolyline={activity.map.summary_polyline} />

        <CustomStravaTemplate activity={activity} />
        <div className="mt-6">
          <button
            onClick={pay}
            className="px-6 py-3 rounded bg-purple-600 text-white"
          >
            Pagar con Stripe
          </button>
        </div>
        </div>
      )}
    </div>
  );
}
