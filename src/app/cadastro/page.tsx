"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import {
  cadastroSchema,
  phoneToSyntheticEmail,
  type CadastroInput,
} from "@/lib/validations/auth";

export default function CadastroPage() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroInput>({
    resolver: zodResolver(cadastroSchema),
  });

  async function onSubmit(dados: CadastroInput) {
    setErro(null);
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: phoneToSyntheticEmail(dados.phone),
      password: dados.password,
      options: {
        data: {
          full_name: dados.fullName,
          phone: dados.phone,
        },
      },
    });

    setCarregando(false);

    if (error) {
      if (error.message.toLowerCase().includes("already registered")) {
        setErro("Já existe uma conta com este número de telefone.");
      } else {
        setErro("Não foi possível criar a sua conta. Tente novamente.");
      }
      return;
    }

    router.push("/painel");
  }

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input id="fullName" autoComplete="name" {...register("fullName")} />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Número de telefone</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+244 900 000 000"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {erro && <p className="text-sm text-destructive">{erro}</p>}

            <Button type="submit" disabled={carregando}>
              {carregando ? "A criar conta..." : "Criar conta"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
