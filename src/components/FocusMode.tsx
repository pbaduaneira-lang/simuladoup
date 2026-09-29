"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, CheckCircle2, Headphones } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

const FOCUS_DURATION = 25 * 60; // 25 minutes

const FOCUS_MOCK_QUESTIONS = [
  { id: "f1", materia: "Matemática", enunciado: "Qual é a raiz de 144?", alternativas: ["12", "14", "16", "24"], correta: 0 },
  { id: "f2", materia: "História", enunciado: "Ano da Proclamação da República?", alternativas: ["1500", "1822", "1889", "1930"], correta: 2 },
  { id: "f3", materia: "Português", enunciado: "Plural de troféu", alternativas: ["Troféus", "Troféis", "Trofézes", "Trofeles"], correta: 0 },
];

export function FocusMode({ onClose }: { onClose: () => void }) {
  const { isFocusModeActive, setFocusMode, questionsAnsweredInFocus, incrementFocusAnswers, resetFocusAnswers } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [showFeedback, setShowFeedback] = useState<boolean | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const coinAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setFocusMode(true);
    resetFocusAnswers();

    // Start lo-fi audio
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => console.log("Audio autoplay prevented"));
    }

    return () => {
      document.body.style.overflow = "auto";
      setFocusMode(false);
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (isPaused || isFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isFinished]);

  const handleFinish = () => {
    setIsFinished(true);
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#BEF264', '#22D3EE']
    });
  };

  const playCoinSound = () => {
    if (coinAudioRef.current) {
      coinAudioRef.current.currentTime = 0;
      coinAudioRef.current.volume = 0.5;
      coinAudioRef.current.play().catch(() => {});
    }
  };

  const handleAnswer = (idx: number) => {
    if (showFeedback !== null) return;
    
    const q = FOCUS_MOCK_QUESTIONS[currentQIdx % FOCUS_MOCK_QUESTIONS.length];
    const isCorrect = idx === q.correta;
    
    if (isCorrect) {
      playCoinSound();
      incrementFocusAnswers();
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#FACC15', '#EAB308']
      });
    }

    setShowFeedback(isCorrect);
    
    setTimeout(() => {
      setShowFeedback(null);
      setCurrentQIdx(prev => prev + 1);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (audioRef.current) {
      if (isPaused) audioRef.current.play();
      else audioRef.current.pause();
    }
  };

  if (isFinished) {
    const bonus = questionsAnsweredInFocus * 5 + 50;
    return (
      <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl font-black mb-4 text-primary neon-text">FOCO CONCLUÍDO!</h1>
        <p className="text-xl mb-8">Você fez {questionsAnsweredInFocus} questões em 25 minutos!</p>
        
        <div className="glass p-8 rounded-3xl neo-brutalism max-w-sm w-full mb-8">
          <p className="font-bold text-lg mb-2">Você está no TOP 8% de Curitiba hoje! 🔥</p>
          <p className="text-secondary font-black text-2xl">+{bonus} XP BÔNUS</p>
        </div>

        <Button onClick={onClose} size="lg" className="bg-primary hover:bg-primary/90 neo-brutalism w-full max-w-sm">
          Sair do Modo Foco
        </Button>
      </div>
    );
  }

  const q = FOCUS_MOCK_QUESTIONS[currentQIdx % FOCUS_MOCK_QUESTIONS.length];

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0A0B] flex flex-col items-center p-4 lg:p-8 overflow-y-auto">
      <audio ref={audioRef} src="/lofi.mp3" loop />
      <audio ref={coinAudioRef} src="/sounds/coin.mp3" />

      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
          <CheckCircle2 className="w-5 h-5 text-secondary" />
          <span className="font-bold text-sm">Questões: {questionsAnsweredInFocus}</span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/50 rounded-full">
          <Headphones className="w-4 h-4 animate-pulse" />
          <span className="font-bold text-sm">Lo-Fi</span>
        </div>

        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-destructive/20 hover:text-destructive">
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Timer Giant */}
      <div className="text-[120px] leading-none font-black text-white/90 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-8 tracking-tighter">
        {formatTime(timeLeft)}
      </div>

      <Button 
        variant="outline" 
        onClick={togglePause}
        className="mb-12 rounded-full w-16 h-16 border-2 border-white/20 hover:bg-white/10"
      >
        {isPaused ? <Play className="w-6 h-6 ml-1" /> : <Pause className="w-6 h-6" />}
      </Button>

      {/* Single Question */}
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`glass p-8 rounded-3xl neo-brutalism transition-colors duration-300 ${showFeedback === true ? 'border-secondary shadow-[0_0_30px_rgba(190,242,100,0.3)]' : showFeedback === false ? 'border-destructive shadow-[0_0_30px_rgba(220,38,38,0.3)]' : ''}`}
          >
            <div className="text-sm text-primary font-bold mb-2">{q.materia}</div>
            <h2 className="text-2xl font-semibold mb-6">{q.enunciado}</h2>

            <div className="flex flex-col gap-3">
              {q.alternativas.map((alt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showFeedback !== null}
                  className="w-full text-left p-4 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-all hover:scale-[1.02] neo-brutalism"
                >
                  <span className="font-medium text-lg">{alt}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
