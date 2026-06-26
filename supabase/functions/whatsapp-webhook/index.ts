// Edge Function: webhook da WhatsApp Cloud API (Meta).
//
// GET  -> verificação do webhook (handshake exigido pela Meta ao configurar
//         a URL no painel do app: https://developers.facebook.com/apps).
// POST -> eventos recebidos; aqui tratamos o clique num botão de resposta
//         rápida e gravamos em `whatsapp_button_replies`.

import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    const expected = Deno.env.get("WHATSAPP_VERIFY_TOKEN");

    if (mode === "subscribe" && token && expected && token === expected) {
      return new Response(challenge ?? "", { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const payload = await req.json();

    const messages =
      payload?.entry?.[0]?.changes?.[0]?.value?.messages ?? ([] as unknown[]);

    for (const msg of messages) {
      const buttonReply = msg?.interactive?.button_reply;
      if (!buttonReply) continue;

      const phone: string | undefined = msg.from;
      let clientId: string | null = null;
      if (phone) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("phone", phone)
          .maybeSingle();
        clientId = profile?.id ?? null;
      }

      await supabase.from("whatsapp_button_replies").insert({
        client_id: clientId,
        phone: phone ?? "",
        button_id: buttonReply.id,
        button_title: buttonReply.title,
        wa_message_id: msg.id ?? null,
      });
    }

    // A Meta exige resposta 200 rápida, senão re-tenta o evento.
    return new Response("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    console.error("Erro a processar webhook do WhatsApp:", error);
    return new Response("EVENT_RECEIVED", { status: 200 });
  }
});
