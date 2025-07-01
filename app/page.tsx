import StravaLoginButton from "@/src/components/StravaLoginButton";

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
  return (
    <main>
      <section className="bg-orange-500 text-white py-24 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Convierte tus rutas de Strava en arte
        </h1>
        <p className="mb-8 text-lg">
          Crea cuadros impresos con tus recorridos y revive cada kilómetro.
        </p>
        <StravaLoginButton />
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto grid gap-8 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="text-center">
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{f.text}</p>
          </div>
        ))}
      </section>

      <section className="bg-gray-100 dark:bg-gray-900 py-12 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">¿Listo para empezar?</h2>
        <StravaLoginButton />
      </section>
    </main>
  );
}