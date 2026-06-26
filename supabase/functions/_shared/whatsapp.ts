// Helper para a WhatsApp Cloud API (Meta) — gratuita: basta uma conta de
// desenvolvedor Meta + um número de teste do WhatsApp Business, sem custo
// de mensageria como nos BSPs pagos (Twilio, etc.).
//
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages

const GRAPH_VERSION = Deno.env.get("WHATSAPP_API_VERSION") ?? "v21.0";

export type QuickReplyButton = {
  /** Identificador devolvido no webhook quando o cliente toca no botão. */
  id: string;
  /** Texto do botão — limite da Meta é 20 caracteres. */
  title: string;
};

function graphUrl(phoneNumberId: string) {
  return `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`;
}

/**
 * Envia uma mensagem interativa com até 3 botões de resposta rápida.
 * `to` deve estar em formato internacional sem "+", ex.: "244912345678".
 */
export async function sendWhatsAppQuickReply(params: {
  to: string;
  bodyText: string;
  buttons: QuickReplyButton[];
}) {
  const token = Deno.env.get("WHATSAPP_TOKEN");
  const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
  if (!token || !phoneNumberId) {
    throw new Error("WHATSAPP_TOKEN ou WHATSAPP_PHONE_NUMBER_ID não configurados.");
  }
  if (params.buttons.length === 0 || params.buttons.length > 3) {
    throw new Error("A WhatsApp Cloud API aceita entre 1 e 3 botões por mensagem.");
  }

  const res = await fetch(graphUrl(phoneNumberId), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: params.to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: params.bodyText },
        action: {
          buttons: params.buttons.map((b) => ({
            type: "reply",
            reply: { id: b.id, title: b.title },
          })),
        },
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Falha ao enviar WhatsApp: ${JSON.stringify(data)}`);
  }
  return data as { messages?: { id: string }[] };
}
