"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  // O usuário solicitou que o app SEMPRE inicie pela Landing Page.
  // Removido o redirecionamento automático baseado na sessão.

  const features = [
    {
      icon: "⚔️",
      title: "Batalha 1vs1 ao vivo",
      description: "Desafie amigos em tempo real. Quem acerta mais rápido leva +200 XP",
    },
    {
      icon: "🔊",
      title: "Áudio 30s estilo amigo",
      description: "Sem ler. Ouça a explicação como se fosse um amigo de 20 anos",
    },
    {
      icon: "🔥",
      title: "Streak de fogo",
      description: "Anel que só preenche se fizer 10 questões/dia. Push às 20h pra não queimar",
    },
    {
      icon: "💊",
      title: "Pílula de Ouro",
      description: "A cada 7 questões, uma dica de 15s que cai na prova",
    },
    {
      icon: "🧠",
      title: "Modo Foco Pomodoro",
      description: "25min travado com lo-fi e moedinha do Mario a cada acerto",
    },
  ];

  const floatingAnimation = {
    y: ["-10px", "10px", "-10px"],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  const floatingAnimationDelay = {
    y: ["10px", "-10px", "10px"],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-purple-500/30 font-sans">
      {/* Header Fixo */}
      <header className="fixed top-0 w-full z-50 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SimuladoUp Logo" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-black text-xl tracking-tight">SimuladoUp</span>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/app/login">
              <Button variant="outline" className="hidden md:flex border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full font-bold h-10 px-6">
                Entrar
              </Button>
            </Link>
            <Link href="/app/login?mode=signup">
              <Button className="bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white border-0 hover:opacity-90 rounded-full font-bold h-10 px-6">
                Criar conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-32">
          {/* Esquerda */}
          <div className="flex-1 flex flex-col items-start text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs md:text-sm font-bold text-purple-300 mb-6"
            >
              <span>🔥</span>
              <span>Acervo com quase 400 questões oficiais do ENEM (2023, 2024 e 2025)</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-[#7C3AED] via-[#9F7AEA] to-[#22D3EE]"
            >
              O TikTok dos simulados.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-[#A1A1AA] mb-10 max-w-lg leading-relaxed font-medium"
            >
              Batalhe 1vs1 ao vivo, ouça explicações de áudio em 30s e mantenha seu streak diário. O app de estudos com ritmo que não cansa.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link href="/app/login?mode=signup" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white border-0 hover:opacity-90 rounded-full font-black h-14 px-8 text-lg shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-all hover:scale-105">
                  Começar agora - é grátis
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-white/20 bg-transparent text-white hover:bg-white/5 rounded-full font-bold h-14 px-8 text-lg hover:scale-105 transition-transform">
                  Ver como funciona
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Direita - Imagem com Cards Flutuantes */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none mx-auto mt-10 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 aspect-[4/5] lg:aspect-auto lg:h-[600px] w-full"
            >
              <img 
                src="/images/brazilian_students_studying.jpg" 
                alt="Jovens estudando juntos" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-80" />
            </motion.div>

            {/* Floating Card 1 */}
            <motion.div
              animate={floatingAnimation}
              className="absolute -left-6 md:-left-12 top-20 bg-[#141417]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-lg">
                ⚔️
              </div>
              <div>
                <p className="font-bold text-sm text-white">Você venceu a batalha!</p>
                <p className="text-xs text-cyan-400 font-black">+200 XP</p>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              animate={floatingAnimationDelay}
              className="absolute -right-6 md:-right-10 bottom-32 bg-[#141417]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-lg border border-orange-500/30">
                🔥
              </div>
              <div>
                <p className="font-bold text-sm text-white">12 dias de streak</p>
                <p className="text-xs text-[#A1A1AA]">Sua ofensiva tá on fire!</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="scroll-mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Mais retenção. Menos atrito.</h2>
            <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
              Tudo foi desenhado com gatilhos de dopamina para que você passe mais tempo estudando do que rodando o feed das redes sociais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-[#141417] border border-[#1F1F23] rounded-2xl p-8 hover:border-purple-500/30 transition-colors group ${i === 3 || i === 4 ? 'lg:col-span-1.5' : ''}`}
                style={{ gridColumn: i === 3 ? '1 / span 1' : i === 4 ? '2 / span 2' : 'auto' }} // Trick to make the last row look good if needed, but we'll stick to basic tailwind spanning below
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform origin-left">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#A1A1AA] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-32">
          <div className="bg-gradient-to-br from-[#141417] to-[#1A1A24] border border-[#2A2A35] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Pronto pra dar <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Up</span> nos seus estudos?
              </h2>
              <p className="text-xl text-[#A1A1AA] mb-10">
                Junte-se à nova geração que parou de sofrer pra estudar. É de graça.
              </p>
              <Link href="/app/login?mode=signup">
                <Button className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 rounded-full font-black h-16 px-10 text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all">
                  Criar minha conta grátis <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Minimal */}
      <footer className="border-t border-white/5 py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <img src="/logo.png" alt="SimuladoUp Logo" className="w-6 h-6 rounded grayscale" />
            <span className="font-bold text-sm">SimuladoUp © 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#A1A1AA]">
            <Link href="/app/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="/app/termos#privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <a href="mailto:contato@simuladoup.com.br" className="hover:text-white transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
