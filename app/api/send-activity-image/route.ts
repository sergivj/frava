import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) return new Response('Missing image', { status: 400 });

  try {

    await fetch('http://192.168.0.47:1337/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          activityId: '14913053839',
          stripeSessionId: 'cs_test_xxx',
          fecha: new Date().toISOString(),
          precio: 15.99,
          estado: 'pagado',
        }
      }),
    });

    return new Response('Email enviado correctamente', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Error enviando correo', { status: 500 });
  }
}
