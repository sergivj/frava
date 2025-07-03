"use client";
import { useEffect, useState } from "react";

export default function Profile() {
  const [weight, setWeight] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetch("/api/strava/athlete")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.athlete?.weight) setWeight(String(data.athlete.weight));
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/strava/athlete", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight: parseFloat(weight) }),
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then(() => setMessage("Actualizado"))
      .catch(() => setMessage("Error al actualizar"));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tu Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Peso (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded">
          Guardar
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
