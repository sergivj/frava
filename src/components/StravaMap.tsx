"use client";

import { MapContainer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import polyline from "polyline";

interface StravaMapProps {
  encodedPolyline: string;
}

export default function StravaMap({ encodedPolyline }: StravaMapProps) {
  const positions = polyline.decode(encodedPolyline);

  if (!positions.length) return <p>No hay ruta disponible.</p>;

  const center = positions[Math.floor(positions.length / 2)] as [number, number];

  return (
    <div style={{ height: "400px", width: "100%", marginTop: "2rem", background: "white" }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Sin TileLayer */}
        <Polyline positions={positions as [number, number][]} color="red" />
      </MapContainer>
    </div>
  );
}
