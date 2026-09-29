"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2, Pause, Play } from "lucide-react";
import { motion } from "framer-motion";

export function TtsPlayer({ text }: { text: string }) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [useBrowserTTS, setUseBrowserTTS] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop browser TTS if component unmounts
  useEffect(() => {
    return () => {
      if (useBrowserTTS && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [useBrowserTTS]);

  const fetchAudio = async () => {
    if (audioUrl || useBrowserTTS) {
      togglePlay();
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ explicacao: text })
      });
      
      const data = await res.json();

      if (!res.ok || data.error || data.url?.includes("soundhelix")) {
        // Se a API retornar erro, ou for a mock URL (SoundHelix), forçamos o TTS nativo do navegador
        // pois o TTS nativo é muito melhor que um mp3 musical de teste.
        startBrowserTTS();
      } else if (data.url) {
        setAudioUrl(data.url);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(() => startBrowserTTS());
            setIsPlaying(true);
          }
        }, 100);
      }
    } catch (e) {
      // Falha na requisição, fallback para navegador
      startBrowserTTS();
    } finally {
      setIsLoading(false);
    }
  };

  const startBrowserTTS = () => {
    setUseBrowserTTS(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Para qualquer fala anterior
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Seu navegador não suporta leitura de tela.");
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (useBrowserTTS) {
      if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      }
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => startBrowserTTS());
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2 border-t border-primary/20 pt-4">
      {/* Botão inicial sempre visível enquanto não carregar áudio e não estiver usando browser TTS */}
      {!audioUrl && !useBrowserTTS && (
        <Button 
          variant="outline" 
          onClick={fetchAudio} 
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 border-primary/50 text-primary hover:bg-primary/10 rounded-xl neo-brutalism"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
          <span>{isLoading ? "Carregando Voz..." : "Ouvir Explicação"}</span>
        </Button>
      )}

      {/* Player de áudio (Mock/Real ou Browser TTS ativo) */}
      {(audioUrl || useBrowserTTS) && (
        <div className="flex items-center gap-4 bg-background/50 p-3 rounded-xl border border-border">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 shrink-0 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>
          
          <div className="flex-1 flex items-center justify-center gap-1 h-6">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary rounded-full"
                animate={{ height: isPlaying ? [8, 24, 8] : 4 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5 + (i % 3) * 0.2,
                  delay: i * 0.05
                }}
              />
            ))}
          </div>

          <audio 
            ref={audioRef} 
            src={audioUrl || undefined} 
            onEnded={() => setIsPlaying(false)}
            className="hidden" 
          />
        </div>
      )}
      
      <span className="text-[10px] text-center text-muted-foreground mt-1 font-medium">
        Explicado pelo Tutor Up {useBrowserTTS && "(Voz Nativa)"}
      </span>
    </div>
  );
}
