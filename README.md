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
