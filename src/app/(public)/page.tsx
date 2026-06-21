import Link from "next/link";
import { FileText, ShieldCheck, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const passos = [
  {
    icon: FileText,
    titulo: "1. Preencha o seu pedido",
    descricao: "Conte-nos sobre si, o seu trabalho e o valor que precisa, em poucos minutos.",
  },
  {
    icon: ShieldCheck,
    titulo: "2. Envie os seus documentos",
    descricao: "BI e comprovativo de residência, tirados pela câmara do telemóvel ou da galeria.",
  },
  {
    icon: Wallet,
    titulo: "3. Receba a resposta",
    descricao: "A nossa equipa analisa o seu pedido e avisa-o em até 24 horas.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-b from-card to-background px-4 py-20 text-center sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-primary sm:text-4xl">
            O microcrédito que você precisa, sem saídas de casa
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Solicite o seu crédito direto do telemóvel, envie os seus documentos
            com segurança, e acompanhe a análise do seu pedido em tempo real.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href="/cadastro">Solicitar microcrédito</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sobre">Saber mais</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-primary">
            Como funciona
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {passos.map(({ icon: Icon, titulo, descricao }) => (
              <Card key={titulo}>
                <CardContent className="flex flex-col items-start gap-3 pt-6">
                  <span className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <Icon className="size-5" />
                  </span>
                  <p className="font-semibold text-primary">{titulo}</p>
                  <p className="text-sm text-muted-foreground">{descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
