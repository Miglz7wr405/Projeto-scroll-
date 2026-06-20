# 🏗️ Especificação para o Claude Code — Sistema de Microcrédito Digital

> **Como usar este documento (importante):**
> O Claude Code trabalha num repositório real, então NÃO mande pedaço por pedaço como no Lovable. Faça assim:
>
> 1. Crie uma pasta vazia para o projeto e abra o Claude Code nela.
> 2. Salve este ficheiro como `SPEC.md` dentro da pasta.
> 3. Mande o **prompt de arranque** abaixo. O Claude Code vai ler a spec, montar um plano e construir fase por fase.
>
> **Prompt de arranque (cole isto):**
> ```
> Leia o ficheiro SPEC.md por completo. Antes de escrever código, apresente-me um plano de construção em fases e a estrutura de pastas que pretende usar, e espere a minha aprovação. Depois construa o sistema fase por fase, seguindo exatamente a SPEC: ao fim de cada fase, rode a aplicação, corrija erros, faça um commit com mensagem clara, e me diga o que validar antes de avançar. Sempre que precisar de uma chave/segredo (Supabase, Resend), pare e peça-me.
> ```

---

## 1. Objetivo

Substituir o processo manual (motoboys recolhendo dados de clientes) por uma **plataforma web de microcrédito** onde o cliente se cadastra, solicita crédito, envia documentos, e a empresa analisa e decide através de um painel administrativo. O sistema lida com **dados pessoais sensíveis e documentos de identidade**, então segurança é requisito de primeira classe, não um extra.

---

## 2. Stack técnica (use exatamente esta)

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui.
- **Backend / dados:** Supabase — Postgres, Auth, Storage e Edge Functions.
- **E-mail:** Resend (para notificações).
- **Deploy alvo:** Vercel (frontend) + Supabase (backend). Deixe pronto para deploy, mas não faça deploy automático.
- Responsivo, **mobile-first** (a maioria dos clientes usa telemóvel).
- Idioma da interface: **português**.

---

## 3. Variáveis de ambiente

Crie um `.env.example` com:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```
Nunca exponha a `SERVICE_ROLE_KEY` no frontend — só em código de servidor / edge functions. Peça-me cada valor quando for necessário.

---

## 4. Design

- Estilo profissional e confiável (instituição financeira).
- Paleta: azul-marinho `#0F2A4A` (principal), verde `#1E9E5A` (ações positivas/dinheiro), cinza-claro de fundo, branco nos cartões.
- Fonte sem serifa, legível; botões com cantos arredondados suaves.

---

## 5. Modelo de dados (Postgres / Supabase)

Crie como **migrations SQL** versionadas. Ative **RLS em todas as tabelas**.

**ENUMS:**
- `user_role`: `cliente`, `admin`
- `work_type`: `formal`, `informal`, `negocio_proprio`
- `application_status`: `em_analise`, `pendente_info`, `aprovado`, `rejeitado`, `pago`, `finalizado`
- `document_type`: `bi_frente`, `bi_verso`, `comprovativo_residencia`
- `residence_proof`: `declaracao_bairro`, `talao_energia`, `talao_agua`, `outro`

**`profiles`** (estende `auth.users`): `id` (uuid, = auth.users.id, PK), `full_name`, `phone` (único), `email` (opcional), `role` (`user_role`, default `cliente`), `created_at`.
→ Trigger: ao criar utilizador no auth, criar a linha em `profiles` automaticamente.

**`credit_applications`**: `id` (uuid, default gen_random_uuid()), `client_id` (→ profiles.id), `full_name`, `birth_date`, `document_number`, `phone`, `neighborhood`, `city`, `full_address`, `occupation`, `workplace_name`, `work_type`, `monthly_income` (numeric), `amount_requested` (numeric), `loan_reason`, `desired_term`, `status` (default `em_analise`), `admin_notes` (opcional), `approved_amount` (numeric, opcional), `reviewed_by` (→ profiles.id, opcional), `reviewed_at` (opcional), `created_at`.

**`documents`**: `id`, `application_id` (→ credit_applications.id), `client_id` (→ profiles.id), `doc_type` (`document_type`), `residence_proof_type` (`residence_proof`, opcional), `file_path` (caminho no Storage), `uploaded_at`.

**`status_history`**: `id`, `application_id` (→ credit_applications.id), `old_status` (opcional), `new_status`, `changed_by` (→ profiles.id), `note` (opcional), `created_at`.

**`notifications`**: `id`, `client_id`, `application_id`, `channel` (texto: email/whatsapp/sms), `message`, `status` (texto: enviado/falhou), `created_at`.

**Políticas RLS:**
- `profiles`: utilizador lê/edita o próprio; admin lê todos.
- `credit_applications`: cliente insere/lê só onde `client_id = auth.uid()`; admin lê e atualiza todos.
- `documents`: cliente insere/lê os próprios; admin lê todos.
- `status_history`: cliente lê os dos seus pedidos; admin lê e insere todos.
- `notifications`: cliente lê as suas; admin lê todas.
- Crie uma função `is_admin()` segura (SECURITY DEFINER, sem recursão) para usar nas políticas.

---

## 6. Funcionalidades e páginas

**Públicas:**
- `/` — Página inicial: hero com "Solicitar Microcrédito" (→ /cadastro) e "Saber Mais" (→ /sobre); 3 passos de como funciona; rodapé com contactos e localização.
- `/sobre` — Quem somos, serviços, como funciona, FAQ (acordeão), contactos.

**Cliente (rotas protegidas):**
- `/cadastro` e `/login` — ver secção 7 (auth por telefone + senha).
- `/solicitar` — formulário em 3 etapas: (1) dados pessoais [nome, data de nascimento, BI/documento, telefone, bairro, cidade, endereço]; (2) dados profissionais [ocupação, local de trabalho, tipo de trabalho, rendimento mensal]; (3) dados do empréstimo [valor, motivo, prazo]. Pré-preencher nome/telefone do perfil. Validar cada etapa.
- `/documentos` — upload de BI frente, BI verso (obrigatórios) e UM comprovativo de residência (declaração do bairro / talão de energia / talão de água / outro). Permitir câmara ou galeria; aceitar imagem e PDF; pré-visualização; barra de progresso. Guardar no Storage e registar em `documents`.
- `/revisar` — resumo de todos os dados + documentos; botão "ENVIAR PEDIDO" salva em `credit_applications` (status `em_analise`), vincula documentos e cria o primeiro `status_history`. Mensagem: "Pedido recebido com sucesso. Estamos a analisar os seus dados. Por favor aguarde até 24 horas."
- `/painel` — saudação; botão novo pedido; lista de pedidos do cliente com estado colorido (🟡 análise, 🟢 aprovado, 🔴 rejeitado, 🟠 pendente, 🔵 pago, ⚫ finalizado). Detalhe mostra mensagem conforme o estado (aprovado → valor aprovado + próximos passos + contacto; rejeitado/pendente → nota do admin).

**Administrador:**
- `/admin` — lista de TODOS os pedidos (nome, telefone, valor, data, estado), com filtros por estado e busca por nome/telefone, cartões de resumo no topo, ordenado por mais recente.
- `/admin/pedido/:id` — detalhe completo + visualização dos documentos (via URLs assinadas/temporárias) + histórico de estados. Três ações: 🟢 APROVAR (pede valor aprovado e próximos passos), 🔴 REJEITAR (pede motivo), 🟡 PEDIR MAIS INFORMAÇÕES (pede nota). Cada ação atualiza o pedido, regista em `status_history` e dispara notificação (secção 9).

---

## 7. Autenticação do cliente (detalhe que evita erro comum)

O cliente faz login com **número de telefone + senha**, não e-mail. O Supabase Auth nativo por telefone exige provedor de SMS (complexo/caro). Para o MVP:
- No cadastro, gere internamente um **e-mail sintético** no formato `{telefone}@cliente.app.local` e use-o no Supabase Auth (email/password). Guarde o **telefone real** e o **e-mail real (opcional)** em `profiles`. O cliente nunca vê o e-mail técnico — digita só telefone e senha.
- Proteja rotas privadas: sem sessão → redireciona para `/login`. Mensagens de erro claras em português.

---

## 8. Acesso ao painel administrativo (atalho + PIN)

- Coloque um **botão discreto** no rodapé (ex.: um "•" ou "Admin") que passe despercebido aos clientes. Ao clicar, abre um modal pedindo um PIN.
- Se o PIN for **`6677`**, encaminha para o **login real do administrador**. Qualquer outro valor → "PIN incorreto", não passa.
- **Segurança (faça exatamente assim):** o PIN só REVELA a porta; ele NÃO é a segurança real. Após o PIN, o admin ainda faz login com utilizador e senha reais (Supabase Auth) e só entra se tiver `role = 'admin'`. A verificação de admin é feita no back-end (RLS), nunca apenas no PIN. Não escreva lógica que dê acesso a dados baseando-se só no PIN do frontend.

---

## 9. Notificações

- Crie uma **Edge Function** no Supabase que, quando um pedido muda para `aprovado`, `rejeitado` ou `pendente_info`, envia mensagem ao cliente.
- Comece pelo canal **e-mail (Resend)**. Estruture o código de forma extensível para acrescentar **WhatsApp** (Twilio ou API da Meta) e **SMS** depois, sem reescrever.
- Exemplos: aprovado → "Olá [nome], o seu pedido de microcrédito foi aprovado. Entre no sistema para continuar." | rejeitado → "Olá [nome], o seu pedido não foi aprovado desta vez. Entre no sistema para mais detalhes."
- Registe cada envio em `notifications`.

---

## 10. Requisitos de segurança (obrigatórios)

- **RLS ativo** em todas as tabelas; cliente nunca acede aos dados de outro cliente.
- **Bucket de Storage privado** (`documentos-clientes`); documentos só acessíveis por URLs **assinadas/temporárias** para o dono e admins — nunca links públicos permanentes.
- **Sem senhas em texto** em nenhuma tabela — apenas Supabase Auth.
- `SERVICE_ROLE_KEY` só em servidor/edge functions.
- Validação de dados também no servidor, não só no frontend.

---

## 11. Plano de construção em fases (siga esta ordem)

Ao fim de cada fase: rode a app, corrija erros, faça commit, e me diga o que validar.

- **Fase 0 — Setup:** Next.js + TypeScript + Tailwind + shadcn/ui; cliente Supabase; `.env.example`; estrutura de pastas; README.
- **Fase 1 — Dados:** migrations com enums, tabelas, triggers, função `is_admin()` e políticas RLS.
- **Fase 2 — Público:** páginas `/` e `/sobre`.
- **Fase 3 — Auth cliente:** `/cadastro`, `/login` (telefone+senha sintético), proteção de rotas.
- **Fase 4 — Pedido:** formulário `/solicitar` em 3 etapas.
- **Fase 5 — Documentos:** `/documentos` + Storage privado.
- **Fase 6 — Envio + painel:** `/revisar` e `/painel`.
- **Fase 7 — Admin:** atalho + PIN 6677 + login admin + lista `/admin`.
- **Fase 8 — Análise:** `/admin/pedido/:id` + aprovar/rejeitar/pedir info + histórico.
- **Fase 9 — Notificações:** edge function + e-mail (Resend).
- **Fase 10 — Auditoria:** rever RLS, bucket privado, ausência de senhas em texto; escrever testes do isolamento de dados (um cliente não vê o outro).

---

## 12. Critérios de aceitação (pronto = tudo isto verdadeiro)

- Um cliente consegue: cadastrar-se, logar com telefone+senha, solicitar crédito, enviar documentos, enviar o pedido e ver o estado.
- Um cliente **não** consegue ver os dados nem os documentos de outro cliente (testado com duas contas).
- O admin acede pelo atalho+PIN, faz login real, vê todos os pedidos, abre o detalhe com os documentos e aprova/rejeita/pede info; o estado muda e o cliente vê.
- A mudança de estado dispara o e-mail de notificação.
- O bucket de documentos é privado; documentos abrem só por URL assinada.
- A app roda localmente sem erros e está pronta para deploy.

---

## 13. Como me conduzir (para o Claude Code)

- Apresente o plano e a estrutura de pastas **antes** de codificar e espere aprovação.
- Construa **fase por fase**; não pule a Fase 1 (o banco é a fundação).
- **Commit** ao fim de cada fase, com mensagem clara.
- Quando precisar de chaves/segredos, **pare e peça**.
- Ao terminar, entregue um **README** explicando como rodar, quais variáveis configurar, e como tornar uma conta admin.
