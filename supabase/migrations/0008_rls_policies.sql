-- Fase 1: políticas de RLS. RLS já foi ativado em cada tabela nas
-- migrations anteriores; aqui definimos quem pode ler/escrever o quê.

-- profiles: utilizador lê/edita o próprio perfil; admin lê/edita todos.
-- (Não há policy de insert: a linha é criada pelo trigger
-- handle_new_user, que corre como SECURITY DEFINER e ignora RLS.)
create policy "profiles_select_own_or_admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
on public.profiles for update
using (id = auth.uid() or public.is_admin());

-- credit_applications: cliente cria e lê só os seus; admin lê e
-- atualiza todos (aprovar/rejeitar/pedir informação).
create policy "credit_applications_select_own_or_admin"
on public.credit_applications for select
using (client_id = auth.uid() or public.is_admin());

create policy "credit_applications_insert_own"
on public.credit_applications for insert
with check (client_id = auth.uid());

create policy "credit_applications_update_admin"
on public.credit_applications for update
using (public.is_admin());

-- documents: cliente envia e lê só os seus; admin lê todos.
create policy "documents_select_own_or_admin"
on public.documents for select
using (client_id = auth.uid() or public.is_admin());

create policy "documents_insert_own"
on public.documents for insert
with check (client_id = auth.uid());

-- status_history: cliente lê o histórico dos seus próprios pedidos;
-- tanto o cliente (ao enviar o pedido pela primeira vez) quanto o admin
-- (ao aprovar/rejeitar/pedir info) podem inserir.
create policy "status_history_select_own_or_admin"
on public.status_history for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.credit_applications ca
    where ca.id = status_history.application_id
      and ca.client_id = auth.uid()
  )
);

create policy "status_history_insert_own_or_admin"
on public.status_history for insert
with check (
  public.is_admin()
  or exists (
    select 1
    from public.credit_applications ca
    where ca.id = status_history.application_id
      and ca.client_id = auth.uid()
  )
);

-- notifications: cliente lê as suas; admin lê todas. O envio é feito
-- pela Edge Function com a service role key (Fase 9), que ignora RLS,
-- por isso não há policy de insert para utilizadores autenticados.
create policy "notifications_select_own_or_admin"
on public.notifications for select
using (client_id = auth.uid() or public.is_admin());
