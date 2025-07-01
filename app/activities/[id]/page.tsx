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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{activity.name}</h1>
      <p className="text-gray-500 mb-4">
        {new Date(activity.start_date).toLocaleString()}
      </p>

      {activity.map?.summary_polyline && (
        <div className="mb-6">
          <StravaMap encodedPolyline={activity.map.summary_polyline} />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded shadow text-center py-4">
        <div>
          <div className="text-xl font-bold">
            {(activity.distance / 1000).toFixed(2)} km
          </div>
          <div className="text-sm text-gray-500">Distancia</div>
        </div>
        <div>
          <div className="text-xl font-bold">
            {(activity.moving_time / 60).toFixed(0)} min
          </div>
          <div className="text-sm text-gray-500">Tiempo</div>
        </div>
        <div>
          <div className="text-xl font-bold">{activity.total_elevation_gain} m</div>
          <div className="text-sm text-gray-500">Elevación</div>
        </div>
        <div>
          <div className="text-xl font-bold">{activity.type}</div>
          <div className="text-sm text-gray-500">Tipo</div>
        </div>
      </div>

        {/* <CustomStravaTemplate activity={activity} /> */}
        <div className="mt-6">
          <button
            onClick={pay}
            className="px-6 py-3 rounded bg-purple-600 text-white"
          >
            Pagar con Stripe
          </button>
        </div>

      {/* {activity.map?.summary_polyline && (
        <div className="mt-8 space-y-8">
          <StaticPolylineCanvas encodedPolyline={activity.map.summary_polyline} />
          <CustomStravaTemplate activity={activity} />

        </div>
      )} */}
    </div>
  );
}
