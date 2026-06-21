import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const servicos = [
  "Microcrédito para negócio próprio",
  "Microcrédito para despesas pessoais e familiares",
  "Acompanhamento do pedido em tempo real, pelo telemóvel",
];

const faq = [
  {
    pergunta: "Quem pode solicitar um microcrédito?",
    resposta:
      "Qualquer pessoa maior de idade, com documento de identidade válido e comprovativo de residência, seja trabalhador formal, informal ou com negócio próprio.",
  },
  {
    pergunta: "Quanto tempo demora a análise do meu pedido?",
    resposta:
      "Normalmente até 24 horas após o envio de todos os dados e documentos.",
  },
  {
    pergunta: "Que documentos preciso de enviar?",
    resposta:
      "O BI (frente e verso) e um comprovativo de residência: declaração do bairro, talão de energia, talão de água ou outro documento equivalente.",
  },
  {
    pergunta: "Como sei se o meu pedido foi aprovado?",
    resposta:
      "Você recebe uma notificação por e-mail e pode ver o estado atualizado a qualquer momento no seu painel.",
  },
];

export default function Sobre() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-primary">Sobre nós</h1>
      <p className="mt-4 text-muted-foreground">
        Somos uma instituição de microcrédito focada em tornar o acesso a
        crédito mais simples, rápido e seguro, substituindo o processo manual
        de recolha de dados por uma plataforma digital completa.
      </p>

      <h2 className="mt-12 text-xl font-bold text-primary">O que fazemos</h2>
      <Card className="mt-4">
        <CardContent className="pt-6">
          <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
            {servicos.map((servico) => (
              <li key={servico}>{servico}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <h2 className="mt-12 text-xl font-bold text-primary">Como funciona</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-foreground">
        <li>Cadastre-se com o seu número de telemóvel.</li>
        <li>Preencha os seus dados pessoais, profissionais e do empréstimo.</li>
        <li>Envie o BI e um comprovativo de residência.</li>
        <li>Aguarde a nossa análise — até 24 horas.</li>
        <li>Acompanhe o estado do seu pedido no seu painel.</li>
      </ol>

      <h2 className="mt-12 text-xl font-bold text-primary">
        Perguntas frequentes
      </h2>
      <Accordion type="single" collapsible className="mt-4">
        {faq.map(({ pergunta, resposta }) => (
          <AccordionItem key={pergunta} value={pergunta}>
            <AccordionTrigger>{pergunta}</AccordionTrigger>
            <AccordionContent>{resposta}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h2 className="mt-12 text-xl font-bold text-primary">Contactos</h2>
      <p className="mt-4 text-sm text-muted-foreground">
        Telefone: +244 900 000 000
        <br />
        E-mail: contacto@microcredito.app
        <br />
        Localização: Luanda, Angola
      </p>
    </main>
  );
}
