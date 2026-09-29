"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Trophy, User, Swords } from "lucide-react";
import { motion } from "framer-motion";
import { StreakHeader } from "@/components/StreakHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide bottom nav on onboarding and login
  if (pathname.includes("/onboarding") || pathname.includes("/login")) {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Feed", href: "/app", icon: <Home className="w-6 h-6" /> },
    { name: "Trilha", href: "/app/trilha", icon: <Map className="w-6 h-6" /> },
    { name: "Batalha", href: "/app/batalha", icon: <Swords className="w-6 h-6" /> },
    { name: "Ranking", href: "/app/ranking", icon: <Trophy className="w-6 h-6" /> },
    { name: "Perfil", href: "/app/perfil", icon: <User className="w-6 h-6" /> },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden relative">
      <StreakHeader />
      <main className="flex-1 w-full overflow-hidden">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="w-full h-16 shrink-0 bg-background/90 backdrop-blur-xl border-t border-border flex justify-around items-center px-2 pb-1 z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="relative flex flex-col items-center justify-center w-full h-full pt-2">
              <div className={`transition-colors duration-300 ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] mt-1 font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav"
                  className="absolute top-0 w-12 h-1 bg-primary rounded-b-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
