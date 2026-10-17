"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Route, Trophy, UserRound, Swords } from "lucide-react";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path.includes("/login")) return <>{children}</>;
  const links = [
    { href: "/app", text: "Início", icon: Home },
    { href: "/app/feed", text: "Praticar", icon: BookOpen },
    { href: "/app/trilha", text: "Minha trilha", icon: Route },
    { href: "/app/batalha", text: "Desafio", icon: Swords },
    { href: "/app/ranking", text: "Ranking", icon: Trophy },
    { href: "/app/perfil", text: "Perfil", icon: UserRound },
  ];
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/app" className="brand">
          <img src="/logo.png" alt="" />
          Simulado<span>Up</span>
        </Link>
        <span className="sidebar-label">SEU ESPAÇO DE APRENDIZADO</span>
        <nav aria-label="Navegação principal">
          {links.map((l) => (
            <Link
              key={l.href}
              aria-current={path === l.href ? "page" : undefined}
              href={l.href}
              className={path === l.href ? "active" : ""}
            >
              <l.icon size={20} />
              <span>{l.text}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="live-dot" /> Livre para aprender
          <p>Todos os recursos são gratuitos.</p>
        </div>
      </aside>
      <div className="app-main">
        <header className="mobile-header">
          <Link href="/app" className="brand">
            Simulado<span>Up</span>
          </Link>
          <span className="pill mint">Gratuito</span>
        </header>
        {children}
      </div>
      <nav className="mobile-nav" aria-label="Navegação no celular">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-label={l.text}
            aria-current={path === l.href ? "page" : undefined}
            className={path === l.href ? "active" : ""}
          >
            <l.icon size={20} />
            <span>{l.text}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
