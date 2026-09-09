import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente de Supabase con Service Role si necesitas saltear RLS o anon si es público
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1. Verificación del Webhook por parte de Meta
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Unauthorized', { status: 403 });
}

// 2. Recepción de mensajes de WhatsApp
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Extraer el mensaje entrante
    const messageData = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!messageData) return NextResponse.json({ success: true });

    const from = messageData.from; // Número de teléfono del arquero
    const text = messageData.text?.body; // Texto que escribió

    // Consultar Supabase según la consulta (ejemplo básico de búsqueda de puntajes)
    // Aquí podrías integrar la lógica de IA para entender qué arquero busca
    const { data: scores, error } = await supabase
      .from('scores')
      .select('archers(name), round_score, target_distance')
      .ilike('archers.name', `%${text}%`) // Buscando coincidencia con el nombre enviado
      .limit(5);

    let replyText = "Hola! No encontré puntajes con ese nombre en la base de datos de arquería.";

    if (scores && scores.length > 0) {
      replyText = `📊 *Resultados encontrados:* \n` + 
        scores.map(s => `- ${s.archers?.name}: ${s.round_score} pts (Distancia: ${s.target_distance})`).join('\n');
    }

    // Enviar respuesta de vuelta a WhatsApp usando la Cloud API
    await sendWhatsAppMessage(from, replyText);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en webhook de WhatsApp:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function sendWhatsAppMessage(to: string, message: string) {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: message },
    }),
  });
}