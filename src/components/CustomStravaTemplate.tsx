"use client";

import { useEffect, useRef } from "react";
import polyline from "polyline";

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

interface CustomStravaTemplateProps {
  activity: Activity;
  backgroundColor?: string;
  polylineColor?: string;
  stats?: ("distance" | "moving_time" | "total_elevation_gain" | "type" | "start_date")[];
  width?: number;
  height?: number;
}

export default function CustomStravaTemplate({
  activity,
  backgroundColor = "#ffffff",
  polylineColor = "#ff0000",
  stats = ["distance", "moving_time", "total_elevation_gain"],
  width = 800,
  height = 600,
}: CustomStravaTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const points = activity.map?.summary_polyline
      ? polyline.decode(activity.map.summary_polyline)
      : [];

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !points.length) return;

    // Canvas setup
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Escalado del recorrido
    const lats = points.map((p) => p[0]);
    const lngs = points.map((p) => p[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const padding = 40;
    const scaleX = (width - padding * 2) / (maxLng - minLng || 1);
    const scaleY = (height - padding * 2) / (maxLat - minLat || 1);

    // Dibujo de polyline
    ctx.strokeStyle = polylineColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    
    points.forEach(([lat, lng], index) => {
      // @typescript-eslint/no-unused-expressions
      const x = (lng - minLng) * scaleX + padding;
      const y = height - ((lat - minLat) * scaleY + padding);
      index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });

    ctx.stroke();

    // Texto / estadísticas
    ctx.fillStyle = "#000";
    ctx.font = "18px sans-serif";

    const lines: string[] = [];

    if (stats.includes("distance")) {
      lines.push(`Distancia: ${(activity.distance / 1000).toFixed(2)} km`);
    }
    if (stats.includes("moving_time")) {
      lines.push(`Tiempo: ${(activity.moving_time / 60).toFixed(0)} min`);
    }
    if (stats.includes("total_elevation_gain")) {
      lines.push(`Elevación: ${activity.total_elevation_gain} m`);
    }
    if (stats.includes("type")) {
      lines.push(`Tipo: ${activity.type}`);
    }
    if (stats.includes("start_date")) {
      lines.push(`Fecha: ${new Date(activity.start_date).toLocaleDateString()}`);
    }

    lines.forEach((line, i) => {
      ctx.fillText(line, 40, height - padding + 25 + i * 25);
    });
  }, [activity, backgroundColor, polylineColor, stats, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: "1px solid #ccc", borderRadius: 12 }}
    />
  );
}
