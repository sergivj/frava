'use client'

export default function Payment() {
  const pay = async () => {
    const res = await fetch('/api/stripe/checkout', { method: 'POST' });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center">
      <button onClick={pay} className="px-6 py-3 rounded bg-purple-600 text-white">
        Pagar con Stripe
      </button>
    </div>
  );
}
