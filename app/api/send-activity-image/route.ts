import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const activityId = formData.get('activityId');

  if (!file) return new Response('Missing image', { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'sergivj@hotmail.es',
    subject: `Nuevo pago confirmado para actividad ${activityId}`,
    text: 'Adjunto imagen de la actividad pagada',
    attachments: [
      {
        filename: 'activity.png',
        content: buffer,
      },
    ],
  };

  try {

    await fetch('http://localhost:1337/api/pedidos', {
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
