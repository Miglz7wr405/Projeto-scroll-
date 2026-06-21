import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PainelPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", data.user.id)
    .single();

  return (
    <main className="mx-auto max-w-2xl p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Olá, {profile?.full_name ?? "cliente"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Fase 3 concluída: autenticação por telefone e proteção de rotas
            funcionando. A lista de pedidos e o botão de novo pedido chegam
            na Fase 6.
          </p>
          <LogoutButton />
        </CardContent>
      </Card>
    </main>
  );
}
