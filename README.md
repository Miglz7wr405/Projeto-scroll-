# Microcrédito Digital

Plataforma web para solicitação e gestão de microcrédito, substituindo a recolha manual de dados por um fluxo digital de cadastro, envio de documentos e análise administrativa.

Veja a especificação completa em [`SPEC.md`](./SPEC.md). O projeto é construído fase por fase; este README é atualizado ao final de cada fase.

## Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions)
- **E-mail:** Resend
- **Deploy alvo:** Vercel (frontend) + Supabase (backend)

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Sem as variáveis de ambiente do Supabase configuradas, a aplicação ainda sobe (útil nas fases iniciais), mas as funcionalidades de dados/auth só funcionam a partir da Fase 1/3.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: painel do projeto Supabase → **Settings → API**.
- `SUPABASE_SERVICE_ROLE_KEY`: mesma página, chave `service_role`. **Nunca** expor no frontend — usada só em código de servidor/edge functions.
- `RESEND_API_KEY`: painel da Resend → **API Keys**. Necessária a partir da Fase 9 (notificações).

## Aplicar as migrations no Supabase

As migrations em `supabase/migrations/` foram validadas localmente (Postgres 16, com schema `auth` simulado) — RLS testado com dois clientes confirmando isolamento de dados, e admin confirmando acesso total.

Para aplicar no seu projeto Supabase real, com a [CLI do Supabase](https://supabase.com/docs/guides/cli) instalada:

```bash
supabase link --project-ref <seu-project-ref>
supabase db push
```

Ou cole o conteúdo de cada ficheiro, em ordem (`0001` → `0008`), no **SQL Editor** do painel do Supabase.

## Botões de resposta rápida do WhatsApp (gratuito, via Meta Cloud API)

Em vez de um BSP pago (Twilio, etc.), as Edge Functions usam diretamente a
**WhatsApp Cloud API da Meta**, que é gratuita para o número de teste e para
o volume inicial de conversas.

1. Crie uma conta em [developers.facebook.com](https://developers.facebook.com/), crie um app do tipo **Business** e adicione o produto **WhatsApp**.
2. No painel do produto WhatsApp → **API Setup**, copie o **Temporary access token** (ou gere um permanente com um System User) e o **Phone number ID** do número de teste fornecido gratuitamente pela Meta.
3. Defina um `WHATSAPP_VERIFY_TOKEN` à sua escolha (qualquer string secreta).
4. Configure os secrets nas Edge Functions do Supabase:
   ```bash
   supabase secrets set WHATSAPP_TOKEN=<token> WHATSAPP_PHONE_NUMBER_ID=<id> WHATSAPP_VERIFY_TOKEN=<sua-string>
   ```
5. Faça deploy das funções:
   ```bash
   supabase functions deploy whatsapp-quick-reply
   supabase functions deploy whatsapp-webhook --no-verify-jwt
   ```
6. No painel do app Meta → WhatsApp → **Configuration**, registe a **Callback URL** como a URL pública de `whatsapp-webhook` e o **Verify token** igual ao `WHATSAPP_VERIFY_TOKEN`. Subscreva o campo `messages`.
7. Para enviar uma mensagem com até 3 botões de resposta rápida, chame a função:
   ```bash
   curl -X POST "<SUPABASE_URL>/functions/v1/whatsapp-quick-reply" \
     -H "Authorization: Bearer <SUPABASE_ANON_KEY>" \
     -H "Content-Type: application/json" \
     -d '{
       "clientId": "<uuid-do-cliente>",
       "applicationId": null,
       "phone": "244912345678",
       "message": "O seu pedido foi aprovado. O que deseja fazer?",
       "buttons": [
         { "id": "ver_pedido", "title": "Ver pedido" },
         { "id": "falar_atendente", "title": "Falar com atendente" }
       ]
     }'
   ```
   O envio é registado em `notifications` (`channel = 'whatsapp'`); quando o cliente toca num botão, o webhook grava a resposta em `whatsapp_button_replies`.

> Limite da Meta: até 3 botões por mensagem, títulos com no máximo 20 caracteres. Fora da janela gratuita de 24h de uma conversa iniciada pelo cliente, o envio de mensagens iniciadas pela empresa pode exigir um *template* aprovado — para respostas a uma conversa em curso (ex.: depois do cliente escrever), os botões funcionam sem custo.

## Tornar uma conta administradora

(Detalhado quando a Fase 1/7 estiver concluída — vai envolver atualizar `role` para `admin` na tabela `profiles` via SQL editor do Supabase ou Service Role.)

## Estado do projeto

- [x] Fase 0 — Setup (Next.js, Tailwind, shadcn/ui, cliente Supabase, `.env.example`)
- [x] Fase 1 — Dados (migrations, RLS)
- [x] Fase 2 — Público (`/`, `/sobre`)
- [x] Fase 3 — Auth cliente
- [ ] Fase 4 — Pedido
- [ ] Fase 5 — Documentos
- [ ] Fase 6 — Envio + painel
- [ ] Fase 7 — Admin (acesso)
- [ ] Fase 8 — Análise
- [ ] Fase 9 — Notificações
- [ ] Fase 10 — Auditoria
