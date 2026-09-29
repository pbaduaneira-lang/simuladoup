"use client";

import { Button } from "@/components/ui/button";
import { FocusMode } from "@/components/FocusMode";
import { Map, Brain, Target, Zap, CheckCircle2, Lock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Trilha() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingIA, setIsGeneratingIA] = useState(false);
  const [trilhaSemana, setTrilhaSemana] = useState<{text: string; status: string}[] | null>(null);
  
  const { isFocusModeActive } = useAppStore();

  useEffect(() => {
    fetch("/api/trilha")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.trilha) {
          setTrilhaSemana(data.trilha);
        } else {
          setTrilhaSemana([]);
        }
      })
      .catch(() => setTrilhaSemana([]));
  }, []);

  if (isFocusModeActive) {
    return <FocusMode onClose={() => useAppStore.getState().setFocusMode(false)} />;
  }

  const gerarSimuladoPessoal = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/simulados/gerar-pessoal", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        router.push(`/app/feed?simulado=${data.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const gerarTrilhaIA = async () => {
    setIsGeneratingIA(true);
    try {
      const res = await fetch("/api/trilha/gerar-ia", { method: "POST" });
      const data = await res.json();
      if (data.success && data.trilha) {
        setTrilhaSemana(data.trilha);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingIA(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-8 px-4 pb-24 font-sans text-foreground overflow-y-auto">
      
      {/* HEADER SIMPLES */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6 relative">
        <div className="flex items-center gap-3">
          <Link href="/app" className="p-2 bg-card rounded-full border-2 border-border hover:bg-muted transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-xl font-black neon-text flex items-center gap-2">
            <Map className="w-6 h-6 text-secondary" /> Trilha
          </h1>
        </div>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-4 mb-8">
        
        {/* SIMULADO GERAL DO DIA */}
        <div className="w-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] p-5 rounded-2xl shadow-lg flex flex-col items-start relative overflow-hidden neo-brutalism hover:-translate-y-1 transition-transform">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />
          <h2 className="text-white text-xl lg:text-2xl font-black mb-1 z-10 flex items-center gap-2">
            🔥 SIMULADO GERAL DO DIA - 14/09
          </h2>
          <p className="text-white/90 text-sm font-medium mb-4 z-10 max-w-[90%]">
            Uma única prova para todo o Brasil. 1.247 já fizeram hoje. Você vai ficar de fora?
          </p>
          <Button 
            onClick={() => router.push("/app/feed?simulado=geral-do-dia")}
            className="bg-white hover:bg-gray-100 text-[#7C3AED] font-black h-12 px-6 rounded-xl border-2 border-transparent shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] text-sm shrink-0 z-10 transition-all hover:scale-[1.02]"
          >
            JOGAR O SIMULADO DE HOJE
          </Button>
        </div>

        {/* MEU SIMULADO PESSOAL */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#141417] rounded-2xl border-2 border-[#2A2A2E] shadow-lg relative overflow-hidden neo-brutalism hover:-translate-y-1 transition-transform">
          
          <div className="w-14 h-14 rounded-xl bg-[#BEF264]/20 flex items-center justify-center border-2 border-[#BEF264] shrink-0">
            <span className="text-3xl">🎲</span>
          </div>
          
          <div className="flex-1 text-center sm:text-left z-10">
            <h2 className="text-lg font-black text-white">Meu Simulado Pessoal</h2>
            <p className="text-xs text-muted-foreground font-medium mt-1">10 questões aleatórias só pra você - XP em dobro</p>
          </div>
          <Button 
            onClick={gerarSimuladoPessoal}
            disabled={isGenerating}
            className="w-full sm:w-auto bg-[#BEF264] hover:bg-[#BEF264]/90 text-black font-black h-12 px-6 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs shrink-0 z-10"
          >
            {isGenerating ? "GERANDO..." : "GERAR MEU SIMULADO AGORA"}
          </Button>
        </div>
      </div>

      {/* TIMELINE TRILHA DA SEMANA */}
      <div className="w-full max-w-2xl flex flex-col">
        <h2 className="text-lg font-black mb-4 text-white">Sua Trilha da Semana</h2>
        
        {!trilhaSemana ? (
          <div className="w-full p-4 text-center">
            <span className="text-muted-foreground font-bold animate-pulse">Carregando trilha inteligente...</span>
          </div>
        ) : trilhaSemana.length === 0 ? (
          <div className="w-full bg-[#1A1A1E] border-4 border-dashed border-[#7C3AED]/50 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 neo-brutalism">
            <div className="w-14 h-14 bg-[#7C3AED]/20 rounded-xl flex items-center justify-center shrink-0 border-2 border-[#7C3AED]">
              <Brain className="w-7 h-7 text-[#7C3AED]" />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-black text-white">Descubra Onde Focar</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">
                Nossa IA analisará seus erros recentes e montará um plano de estudos focado no que você precisa melhorar.
              </p>
            </div>
            
            <Button 
              onClick={gerarTrilhaIA}
              disabled={isGeneratingIA}
              className="w-full sm:w-auto bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:opacity-90 text-white font-black h-12 px-5 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] text-xs shrink-0 transition-all hover:scale-[1.02]"
            >
              {isGeneratingIA ? "ANALISANDO..." : "✨ GERAR TRILHA"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
            {trilhaSemana.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-xl border-4 flex items-center gap-3 z-10 bg-[#1A1A1E] transition-all
                  ${item.status === 'done' ? 'border-[#22D3EE]/50 shadow-[4px_4px_0px_0px_rgba(34,211,238,0.2)]' : ''}
                  ${item.status === 'current' ? 'border-[#7C3AED] shadow-[4px_4px_0px_0px_rgba(139,92,246,0.6)] -translate-y-1' : ''}
                  ${item.status === 'locked' ? 'border-muted-foreground/30 border-dashed opacity-60 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]' : ''}
                `}
              >
                {/* Status Icon Indicator */}
                <div className={`w-8 h-8 rounded-full border-2 border-[#1A1A1E] flex items-center justify-center shrink-0
                  ${item.status === 'done' ? 'bg-[#22D3EE]' : ''}
                  ${item.status === 'current' ? 'bg-[#7C3AED]' : ''}
                  ${item.status === 'locked' ? 'bg-muted-foreground' : ''}
                `}>
                  {item.status === 'done' && <CheckCircle2 className="w-4 h-4 text-[#1A1A1E]" />}
                  {item.status === 'current' && <Map className="w-4 h-4 text-[#1A1A1E]" />}
                  {item.status === 'locked' && <Lock className="w-4 h-4 text-[#1A1A1E]" />}
                </div>
                
                {/* Content */}
                <div className="flex flex-col overflow-hidden">
                  <span className={`font-bold text-sm truncate ${item.status === 'locked' ? 'text-muted-foreground' : 'text-white'}`}>
                    {item.text}
                  </span>
                  {item.status === 'current' && (
                    <span className="text-[10px] font-bold text-[#7C3AED] mt-0.5">EM ANDAMENTO</span>
                  )}
                  {item.status === 'done' && (
                    <span className="text-[10px] font-bold text-[#22D3EE] mt-0.5">CONCLUÍDO</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}
