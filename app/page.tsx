'use client';
// @typescript-eslint/no-unused-expressions

import StravaLoginButton from "@/src/components/StravaLoginButton";

import bg from "@/src/assets/bg.png"; // Asegúrate de que esta ruta sea correcta
import Image from "next/image";
import { useEffect, useState } from "react";

const features = [
  {
    title: "Elige tu mejor actividad",
    text: "Conecta con Strava y selecciona la ruta que quieras enmarcar.",
  },
  {
    title: "Personaliza el diseño",
    text: "Ajusta colores y detalles para crear un recuerdo único.",
  },
  {
    title: "Recibe tu cuadro impreso",
    text: "Enviamos tu recorrido listo para colgar en la pared.",
  },
];

export default function Home() {
  const [athlete, setAthlete] = useState(null);

  useEffect(() => {
    const athleteL = localStorage.getItem("athlete");
    athleteL && setAthlete(JSON.parse(athleteL));
  }
  , []);

  return (
    <main className="bg-[#562b00]">
      {/* Hero con imagen de fondo */}
      <section
        className="relative w-full h-[90vh] bg-cover bg-center flex items-center justify-center text-white px-6"
      >
        <Image src={bg} alt="Fondo de Strava" className="absolute inset-0 object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black/60" /> {/* Capa oscura encima de la imagen */}

        <div className="relative z-10 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Convierte tus rutas de Strava en obras de arte
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Crea cuadros impresos con tus recorridos y revive cada kilómetro.
          </p>
          {athlete ? (
          <div></div>
          ) : (
            <StravaLoginButton />
          )}
        </div>
      </section>

      {/* Características */}
      <section className="py-22 px-6 max-w-6xl mx-auto grid gap-14 md:grid-cols-3 text-center">
        {features.map((f) => (
          <div key={f.title}>
            <h3 className="text-2xl font-semibold mb-2 text-gray-100">{f.title}</h3>
            <p className="text-gray-100">{f.text}</p>
          </div>
        ))}
      </section>

      {/* CTA final */}
      {/* <section className="bg-gray-100 dark:bg-gray-900 py-12 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
          ¿Listo para empezar?
        </h2>
        <StravaLoginButton />
      </section> */}
    </main>
  );
}
