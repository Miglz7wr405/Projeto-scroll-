import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="text-lg font-bold">Microcrédito Digital</p>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Crédito rápido e simples, direto do seu telemóvel.
          </p>
        </div>
        <div>
          <p className="font-semibold">Contactos</p>
          <ul className="mt-2 space-y-1 text-sm text-primary-foreground/80">
            <li>Telefone: +244 900 000 000</li>
            <li>E-mail: contacto@microcredito.app</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Localização</p>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Luanda, Angola
          </p>
          <Link
            href="/sobre"
            className="mt-2 inline-block text-sm text-primary-foreground underline-offset-4 hover:underline"
          >
            Saber mais sobre nós
          </Link>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} Microcrédito Digital. Todos os direitos reservados.
      </div>
    </footer>
  );
}
