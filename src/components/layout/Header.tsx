import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-primary">
          Microcrédito Digital
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/sobre"
            className="hidden text-sm font-medium text-foreground hover:text-primary sm:inline"
          >
            Sobre
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/cadastro">Solicitar microcrédito</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
