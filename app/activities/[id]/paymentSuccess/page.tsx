'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas';
import CustomStravaTemplate from '@/src/components/CustomStravaTemplate';

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
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
  };
}

interface StripeData {
  id: string;
  status: string;
  amount_total: number;
  customer_details: {
    name?: string;
    email?: string;
  };
  payment_intent: string;
  collected_information?: {
    shipping_details?: {
      address?: {
        line1?: string;
        line2?: string;
        city?: string;
        postal_code?: string;
        state?: string;
      };
    };
  };
}

export default function PaymentSuccessPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [stripeData, setStripeData] = useState<StripeData | null>(null); 
  const [activity, setActivity] = useState<Activity | null>(null);
  const [pushedToStrapi, setPushedToStrapi] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/stripe/session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => setStripeData(data));
  }, [sessionId]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/strava/activity?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.activity) setActivity(data.activity);
      });
  }, [id]);

  useEffect(() => {
    const sendToStrapi = async () => {
      if (!stripeData || !activity || pushedToStrapi) return;
      const element = document.getElementById('template');
      if (!element) return;

      const canvas = await html2canvas(element);
      const base64 = canvas.toDataURL('image/png');
      const blob = await fetch(base64).then((res) => res.blob());
      const file = new File([blob], 'activity.png', { type: 'image/png' });

      const imageForm = new FormData();
      imageForm.append('files', file);

      const uploadRes = await fetch('https://frava-cms.onrender.com/api/upload', {
        method: 'POST',
        body: imageForm,
      });

      const uploaded = await uploadRes.json();
      const imageId = uploaded[0]?.id;

      const pedido = {
        data: {
          activityId: activity.id.toString(),
          email: stripeData.customer_details?.email || '',
          precio: stripeData.amount_total / 100,
          fecha: new Date().toISOString(),
          stripePaymentId: stripeData.payment_intent,
          Image: imageId,
          estado: stripeData.status === 'complete' ? 'pagado' : 'fallido',
          stravaId: activity.athlete.id.toString(),
          shippingAddress: [
            stripeData.collected_information?.shipping_details?.address?.line1,
            stripeData.collected_information?.shipping_details?.address?.line2,
            stripeData.collected_information?.shipping_details?.address?.city,
            stripeData.collected_information?.shipping_details?.address?.postal_code,
            stripeData.collected_information?.shipping_details?.address?.state,
          ].filter(Boolean).join(' | '),
        },
      };

      await fetch('https://frava-cms.onrender.com/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      });

      setPushedToStrapi(true);
    };

    sendToStrapi();
  }, [stripeData, activity, pushedToStrapi]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* Título de estado */}
        <div className="text-center">
          {stripeData && stripeData.status === 'complete' ? (
            <h1 className="text-3xl font-bold text-green-600 flex items-center justify-center gap-2">
              ✅ ¡Pago confirmado!
            </h1>
          ) : stripeData ? (
            <h1 className="text-3xl font-bold text-red-600 flex items-center justify-center gap-2">
              ❌ Pago fallido
            </h1>
          ) : (
            <h1 className="text-3xl font-semibold text-gray-700">Cargando datos...</h1>
          )}
        </div>

        {/* Información del pago */}
        {stripeData && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Resumen del pedido</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <p><span className="font-medium text-gray-800">Nombre:</span> {stripeData.customer_details?.name}</p>
                <p><span className="font-medium text-gray-800">Correo:</span> {stripeData.customer_details?.email}</p>
                <p><span className="font-medium text-gray-800">Precio total:</span> {(stripeData.amount_total / 100).toFixed(2)} €</p>
              </div>
            </div>
            {stripeData.status === 'complete' && (
              <p className="text-gray-700 text-sm">
                Gracias por tu compra. Tu actividad ha sido registrada correctamente y se enviará en los próximos <strong>2 días</strong>.
              </p>
            )}
          </div>
        )}

        {/* Vista previa de la actividad */}
        {activity && stripeData?.status && (
          <div
            id="template"
            className="bg-white rounded-xl shadow-md overflow-hidden p-4"
          >
            <CustomStravaTemplate activity={activity} />
          </div>
        )}
      </div>
    </div>
  );
}
