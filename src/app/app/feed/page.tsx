"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Share2, Play, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TtsPlayer } from "@/components/TtsPlayer";
import { GoldPillCard } from "@/components/GoldPillCard";
import { useAppStore } from "@/store/useAppStore";
import { BattleBanner, FocusBanner } from "@/components/Banners";
import { FocusMode } from "@/components/FocusMode";
import { ActionModal } from "@/components/ActionModals";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function FeedContent() {
  const searchParams = useSearchParams();
  const materiaQuery = searchParams.get("materia");
  const simuladoQuery = searchParams.get("simulado");

  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (materiaQuery) queryParams.append("materia", materiaQuery);
        if (simuladoQuery) queryParams.append("simulado", simuladoQuery);
        
        const res = await fetch(`/api/questions?${queryParams.toString()}`);
        const data = await res.json();
        
        if (data.success && data.questoes) {
          setQuestions(data.questoes);
        } else {
          setQuestions([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchQuestions();
  }, [materiaQuery, simuladoQuery]);

  const { questionCountSession, incrementQuestionCount, isFocusModeActive } = useAppStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answerResults, setAnswerResults] = useState<Record<string, { correta: number; explicacaoIA: string; acertou: boolean }>>({});
  const [likes, setLikes] = useState([124, 89]);
  const [hasLiked, setHasLiked] = useState<boolean[]>([false, false]);
  
  // Modals state
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TEST USER (Inserido no banco)
  const TEST_USER_ID = "b6b43411-fe62-4966-ac48-1cfd906d2e85";

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <span className="text-xl font-bold animate-pulse text-muted-foreground">Carregando questões...</span>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <span className="text-xl font-bold text-muted-foreground">Nenhuma questão encontrada.</span>
        <Link href="/app">
          <Button className="bg-primary hover:bg-primary/90 text-white">Voltar para o Início</Button>
        </Link>
      </div>
    );
  }

  const q = questions[currentIdx] || questions[0];
  const activeResult = answerResults[q.id];

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/questions/${q.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: TEST_USER_ID })
      });
      const data = await res.json();
      
      const newLikes = [...likes];
      const newHasLiked = [...hasLiked];
      
      if (data.liked) {
        newLikes[currentIdx] += 1;
        newHasLiked[currentIdx] = true;
      } else {
        newLikes[currentIdx] -= 1;
        newHasLiked[currentIdx] = false;
      }
      setLikes(newLikes);
      setHasLiked(newHasLiked);
    } catch (e) {
      console.error(e);
    }
  };

  const handleComment = async (text: string) => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/questions/${q.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: TEST_USER_ID, text })
      });
      setCommentModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async (reason: string) => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/questions/${q.id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: TEST_USER_ID, reason })
      });
      setReportModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswer = async (index: number) => {
    if (selected !== null) return;
    setSelected(index);

    try {
      // Validação 100% Server-Side: enviamos apenas o índice escolhido e a API confere o gabarito no banco
      const res = await fetch("/api/users/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: TEST_USER_ID,
          questionId: q.id,
          selectedOption: index,
          tempo: 15 // Mock de tempo por enquanto
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setAnswerResults(prev => ({
          ...prev,
          [q.id]: {
            correta: data.correta,
            explicacaoIA: data.explicacaoIA || "",
            acertou: data.acertou
          }
        }));
        setShowExplanation(true);
        console.log(`XP Ganho: ${data.xpGained} | Novo XP: ${data.totalXp} | Streak Atual: ${data.currentStreak}`);
      }
    } catch (e) {
      console.error("Erro ao salvar progresso:", e);
    }
  };

  const nextQuestion = () => {
    incrementQuestionCount();
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="h-screen w-full bg-background flex justify-center items-center overflow-hidden">
      {isFocusModeActive && <FocusMode onClose={() => useAppStore.getState().setFocusMode(false)} />}
      
      {/* Wrapper principal: mobile continua celular, desktop espalha */}
      <div className="w-full h-full flex flex-col lg:flex-row relative lg:max-w-[1400px] lg:px-8 lg:gap-8">
        
        {/* Top bar - Mobile apenas */}
        <div className="lg:hidden absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-background to-transparent">
          <div className="flex items-center gap-2">
            <Link href="/app" className="mr-2 p-1 bg-background/50 rounded-full backdrop-blur">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <span className="font-bold text-lg neon-text">{q.materia}</span>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{q.dificuldade}</span>
          </div>
          <div className="flex items-center gap-1 bg-primary/20 text-primary px-3 py-1 rounded-full font-bold">
            🔥 12
          </div>
        </div>

        {/* Left Sidebar (Desktop) / Top Banners (Mobile) */}
        <div className="hidden lg:flex flex-col w-80 pt-10 pb-8 gap-6 z-10 h-full border-r border-border/20 pr-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl" />
              <span className="font-black text-2xl tracking-tight">SimuladoUp</span>
            </div>
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
            <BattleBanner />
            <FocusBanner />
            
            {/* Desktop Status */}
            <div className="bg-card/50 border border-border rounded-2xl p-4 mt-8">
              <h3 className="font-bold text-sm text-muted-foreground mb-4 uppercase tracking-wider">Seu Progresso</h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Ofensiva</span>
                <span className="text-orange-500 font-bold flex items-center gap-1">🔥 12 dias</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Questões Hoje</span>
                <span className="text-primary font-bold">{questionCountSession} / 10</span>
              </div>
              <div className="w-full bg-background rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(100, (questionCountSession / 10) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content (Feed Central) */}
        <div className="flex-1 flex flex-col h-full relative lg:max-w-2xl lg:mx-auto border-x lg:border-none border-border/50">
          
          <div className="flex-1 flex flex-col px-0 lg:px-4 pt-16 lg:pt-10 pb-24 lg:pb-10 overflow-y-auto overflow-x-hidden no-scrollbar">
            {/* Banners só aparecem no mobile aqui */}
            <div className="lg:hidden w-full flex flex-col gap-4">
              <BattleBanner />
              <FocusBanner />
            </div>

            {/* Desktop Top Bar equivalente */}
            <div className="hidden lg:flex justify-between items-center mb-10 w-full">
              <div className="flex items-center gap-3">
                <Link href="/app" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mr-2 bg-card/50 px-4 py-2 rounded-xl border border-border">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-bold text-sm">Sair</span>
                </Link>
                <span className="font-bold text-lg neon-text">{q.materia}</span>
                <span className="text-xs bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full">{q.dificuldade}</span>
              </div>
            </div>

            <div className="px-4 lg:px-0 mt-6 lg:mt-0 flex-1 flex flex-col justify-center">
              {questionCountSession > 0 && questionCountSession % 7 === 0 ? (
              <div className="flex flex-col justify-center h-full">
                <GoldPillCard 
                  title="Pílula de Ouro"
                  content="A crase NUNCA é usada antes de palavra masculina ou verbo! Ex: Andar a pé."
                  onSabia={() => incrementQuestionCount()}
                  onNaoSabia={() => incrementQuestionCount()}
                />
              </div>
            ) : (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 lg:gap-4"
              >
              {/* Card do Enunciado */}
              <div className="bg-card/50 border border-border/80 rounded-xl p-3.5 lg:p-4 shadow-sm max-h-[32vh] overflow-y-auto">
                <h2 className="text-xs sm:text-sm lg:text-[15px] font-medium leading-relaxed text-foreground/90">
                  {q.enunciado}
                </h2>
              </div>
              
              {/* Lista de Alternativas */}
              <div className="flex flex-col gap-2">
                {q.alternativas.map((alt: any, idx: number) => {
                  let bgColor = "bg-card/70 border-border hover:border-primary/40 hover:bg-card";
                  if (selected !== null && activeResult) {
                    if (idx === activeResult.correta) bgColor = "bg-secondary/20 border-secondary text-secondary-foreground shadow-[0_0_12px_rgba(190,242,100,0.25)]";
                    else if (idx === selected) bgColor = "bg-destructive/20 border-destructive shadow-[0_0_12px_rgba(220,38,38,0.25)]";
                    else bgColor = "bg-card/40 border-border opacity-40";
                  }

                  return (
                    <motion.button
                      whileTap={selected === null ? { scale: 0.99 } : {}}
                      whileHover={selected === null ? { scale: 1.003 } : {}}
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full text-left p-2.5 lg:p-3 rounded-xl border transition-all neo-brutalism ${bgColor}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[11px] lg:text-xs font-bold ${selected !== null && activeResult && idx === activeResult.correta ? 'border-secondary bg-secondary text-background' : 'border-muted-foreground/30 text-muted-foreground'}`}>
                          {['A', 'B', 'C', 'D', 'E'][idx]}
                        </div>
                        <span className="font-normal text-xs lg:text-[13.5px] leading-snug text-foreground/90">{alt}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explicação AI (revelada após resposta via Server-Side Validation) */}
              {showExplanation && activeResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-1 lg:mt-2 p-3.5 lg:p-4 rounded-xl bg-primary/10 border border-primary/30"
                >
                  <div className="flex items-center gap-1.5 mb-1.5 text-primary font-bold text-xs lg:text-sm">
                    <Play className="w-3.5 h-3.5 fill-primary" /> Explicação Up
                  </div>
                  <p className="text-xs lg:text-sm font-normal whitespace-pre-wrap leading-relaxed text-foreground/80">
                    {activeResult.explicacaoIA}
                  </p>
                  
                  {activeResult.explicacaoIA && (
                    <div className="mt-2.5">
                      <TtsPlayer text={activeResult.explicacaoIA} />
                    </div>
                  )}

                  <Button onClick={nextQuestion} className="w-full mt-3 h-10 text-xs sm:text-sm bg-primary hover:bg-primary/90 text-white font-bold neo-brutalism rounded-xl">
                    {currentIdx < questions.length - 1 ? "Próxima Questão" : "Finalizar Simulado"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
            )}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Social Actions no Desktop) / Floating no Mobile */}
        <div className="lg:flex lg:flex-col lg:w-24 lg:h-full lg:justify-end lg:pb-10 lg:pl-6 lg:border-l lg:border-border/20 z-20">
          
          <Link href="/app/batalha" className="fixed lg:relative bottom-24 lg:bottom-0 right-4 lg:right-0 w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] lg:mb-10 hover:scale-110 transition-transform cursor-pointer">
            <span className="text-2xl lg:text-3xl">⚔️</span>
          </Link>

          <div className="absolute lg:relative right-4 bottom-44 lg:right-0 lg:bottom-0 flex flex-col gap-6 lg:gap-8 items-center">
            <div className="flex flex-col items-center gap-1">
              <button 
                onClick={handleLike}
                className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-card/80 backdrop-blur border flex items-center justify-center transition-colors cursor-pointer ${hasLiked[currentIdx] ? 'bg-primary/20 text-primary border-primary' : 'border-border hover:bg-primary/20 hover:text-primary'}`}
              >
                <Heart className={`w-6 h-6 lg:w-7 lg:h-7 ${hasLiked[currentIdx] ? 'fill-primary text-primary' : ''}`} />
              </button>
              <span className="text-xs lg:text-sm font-bold">{likes[currentIdx]}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button 
                onClick={() => setCommentModalOpen(true)}
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center hover:bg-accent/20 hover:text-accent transition-colors cursor-pointer"
              >
                <MessageSquare className="w-6 h-6 lg:w-7 lg:h-7" />
              </button>
              <span className="text-xs lg:text-sm font-bold">12</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button 
                onClick={() => setReportModalOpen(true)}
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-6 h-6 lg:w-7 lg:h-7 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

      </div>
      
      {/* Modais Elegantes Shadcn */}
      <ActionModal
        open={commentModalOpen}
        onOpenChange={setCommentModalOpen}
        title="Novo Comentário"
        description="Deixe sua dúvida ou explicação para ajudar a comunidade."
        placeholder="Escreva aqui seu comentário..."
        onSubmit={handleComment}
        isLoading={isSubmitting}
      />

      <ActionModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        title="Reportar Erro"
        description="Encontrou algo de errado na questão? Conta pra gente."
        placeholder="O que tem de errado com a questão?"
        onSubmit={handleReport}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default function Feed() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-background"><span className="text-xl font-bold neon-text">Carregando...</span></div>}>
      <FeedContent />
    </Suspense>
  );
}
