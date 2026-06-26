// Edge Function: POST /whatsapp-quick-reply
// Envia uma mensagem WhatsApp com botões de resposta rápida via Cloud API
// da Meta (gratuita) e regista o envio em `notifications`.
//
// Body esperado:
// {
//   "clientId": "uuid",
//   "applicationId": "uuid | null",
//   "phone": "244912345678",
//   "message": "O seu pedido foi aprovado. Quer continuar?",
//   "buttons": [{ "id": "ver_pedido", "title": "Ver pedido" }, { "id": "falar_atendente", "title": "Falar com atendente" }]
// }

import { createClient } from "jsr:@supabase/supabase-js@2";
import { sendWhatsAppQuickReply } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { clientId, applicationId, phone, message, buttons } = await req.json();

    if (!clientId || !phone || !message || !Array.isArray(buttons) || buttons.length === 0) {
      return new Response(
        JSON.stringify({ error: "clientId, phone, message e buttons são obrigatórios." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let status = "enviado";
    try {
      await sendWhatsAppQuickReply({ to: phone, bodyText: message, buttons });
    } catch (sendError) {
      status = "falhou";
      await supabase.from("notifications").insert({
        client_id: clientId,
        application_id: applicationId ?? null,
        channel: "whatsapp",
        message,
        status,
      });
      throw sendError;
    }

    await supabase.from("notifications").insert({
      client_id: clientId,
      application_id: applicationId ?? null,
      channel: "whatsapp",
      message,
      status,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
