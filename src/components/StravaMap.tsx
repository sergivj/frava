// src/components/StravaMap.tsx
"use client";

import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import polyline from "polyline";

interface StravaMapProps {
  encodedPolyline: string;
}

export default function StravaMap({ encodedPolyline }: StravaMapProps) {
  const positions = polyline.decode(encodedPolyline);

  if (!positions.length) {
    return <p>No hay datos de recorrido disponibles.</p>;
  }

  const center = positions[Math.floor(positions.length / 2)] as [number, number];

  return (
    <div className="h-[400px] w-full mt-6 rounded overflow-hidden">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={positions as [number, number][]} color="red" />
      </MapContainer>
    </div>
  );
}
