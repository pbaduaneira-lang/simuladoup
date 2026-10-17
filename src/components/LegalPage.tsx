import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="legal-shell">
      <header className="legal-header">
        <Link href="/" className="brand" aria-label="SimuladoUp, início">
          <img src="/logo.png" alt="" />
          Simulado<span>Up</span>
        </Link>
        <Link href="/app" className="text-link">
          Ir para o app →
        </Link>
      </header>
      <main className="page prose-page legal-content">
        <span className="eyebrow">TRANSPARÊNCIA E SUAS ESCOLHAS</span>
        <h1>{title}</h1>
        <p className="legal-description">{description}</p>
        <p>Atualizado em 17 de outubro de 2026.</p>
        {children}
      </main>
      <footer className="legal-footer">
        <p>SimuladoUp · Estrela Incorporadora Ltda.</p>
        <nav aria-label="Privacidade e atendimento">
          <Link href="/privacidade">Política de Privacidade</Link>
          <Link href="/excluir-conta">Excluir conta</Link>
          <Link href="/app/termos">Termos de uso</Link>
          <a href="mailto:estrelaincorporadora@gmail.com">Contato</a>
        </nav>
      </footer>
    </div>
  );
}
