"use client";

import { useEffect, useRef } from "react";
import polyline from "polyline";

interface StaticPolylineCanvasProps {
  encodedPolyline: string;
  width?: number;
  height?: number;
  lineColor?: string;
}

export default function StaticPolylineCanvas({
  encodedPolyline,
  width = 400,
  height = 400,
  lineColor = "red",
}: StaticPolylineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const points = polyline.decode(encodedPolyline); // [[lat, lng], ...]

    if (!points.length || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Convert to relative canvas coordinates
    const lats = points.map((p) => p[0]);
    const lngs = points.map((p) => p[1]);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const scaleX = width / (maxLng - minLng);
    const scaleY = height / (maxLat - minLat);

    const margin = 10;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Style
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    points.forEach(([lat, lng], index) => {
      const x = (lng - minLng) * scaleX + margin;
      const y = height - (lat - minLat) * scaleY - margin;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [encodedPolyline, width, height, lineColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: "1px solid #ccc",
        background: "#fff",
        borderRadius: 8,
        marginTop: 24,
      }}
    />
  );
}
