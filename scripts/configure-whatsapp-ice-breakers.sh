#!/usr/bin/env bash
# Configura os "ice breakers" do WhatsApp — os botões de início rápido que
# aparecem para o cliente antes de ele escrever qualquer mensagem (como na
# captura de tela de referência). É uma configuração única, gratuita, feita
# direto na Graph API da Meta (não precisa de Edge Function nem de re-rodar
# a cada notificação).
#
# Uso:
#   WHATSAPP_TOKEN=<token> WHATSAPP_PHONE_NUMBER_ID=<id> ./scripts/configure-whatsapp-ice-breakers.sh
#
# Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-conversational-components

set -euo pipefail

: "${WHATSAPP_TOKEN:?Defina a variável WHATSAPP_TOKEN}"
: "${WHATSAPP_PHONE_NUMBER_ID:?Defina a variável WHATSAPP_PHONE_NUMBER_ID}"
API_VERSION="${WHATSAPP_API_VERSION:-v21.0}"

curl -X POST "https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/conversational_automation" \
  -H "Authorization: Bearer ${WHATSAPP_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "enable_welcome_message": true,
    "prompts": [
      "Quero marcar uma chamada",
      "Tenho uma reunião marcada",
      "Quero saber mais informações",
      "Como funciona o atendimento"
    ]
  }'
