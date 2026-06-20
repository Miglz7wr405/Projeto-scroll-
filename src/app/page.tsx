import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Microcrédito Digital</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Fase 0 concluída: projeto Next.js, Tailwind, shadcn/ui e cliente
            Supabase configurados. A página inicial completa chega na Fase 2.
          </p>
          <Button variant="secondary" disabled>
            Solicitar microcrédito (em breve)
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
