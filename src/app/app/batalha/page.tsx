"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { Copy, Users, Zap, CheckCircle2, XCircle, Send, MessageSquare } from "lucide-react";

// Mock das questões de batalha
const BATTLE_QUESTIONS = [
  { id: "b1", materia: "Matemática", enunciado: "2 + 2 = ?", alternativas: ["3", "4", "5", "6"], correta: 1 },
  { id: "b2", materia: "História", enunciado: "Quem descobriu o Brasil?", alternativas: ["Cabral", "Colombo", "Vespucci", "Caminha"], correta: 0 },
  { id: "b3", materia: "Física", enunciado: "Fórmula de Einstein?", alternativas: ["E=mc2", "F=ma", "V=IR", "P=VI"], correta: 0 },
  { id: "b4", materia: "Português", enunciado: "Plural de Cidadão", alternativas: ["Cidadões", "Cidadãos", "Cidadães", "Cidadas"], correta: 1 },
  { id: "b5", materia: "Geografia", enunciado: "Capital da França?", alternativas: ["Londres", "Berlim", "Paris", "Madrid"], correta: 2 },
];

type Message = { user: string; text: string; id: string };

function Batalha1v1Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomQuery = searchParams.get("room");
  
  const [roomId, setRoomId] = useState<string | null>(roomQuery);
  const [status, setStatus] = useState<"waiting" | "playing" | "finished">("waiting");
  const [isHost, setIsHost] = useState(false);
  const [playerName, setPlayerName] = useState("");
  
  // Game State
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [myAnswer, setMyAnswer] = useState<number | null>(null);
  const [oppAnswer, setOppAnswer] = useState<number | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const channelRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Definir nome temporário para o jogador no chat
    const pName = `Jogador ${Math.floor(Math.random() * 1000)}`;
    setPlayerName(pName);

    // Inicializar sala
    let currentRoom = roomQuery;
    if (!currentRoom) {
      currentRoom = Math.random().toString(36).substring(2, 9);
      setRoomId(currentRoom);
      setIsHost(true);
      window.history.replaceState(null, "", `?room=${currentRoom}`);
    } else {
      setRoomId(currentRoom);
    }

    // Conectar Realtime
    const channel = supabase.channel(`room:${currentRoom}`, {
      config: { presence: { key: isHost ? "host" : "guest" } }
    });

    channelRef.current = channel;

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const playersCount = Object.keys(state).length;
        if (playersCount >= 2 && status === "waiting" && isHost) {
           channel.send({ type: "broadcast", event: "start_countdown" });
           startCountdown();
        }
      })
      .on("broadcast", { event: "start_countdown" }, () => {
        if (!isHost && status === "waiting") startCountdown();
      })
      .on("broadcast", { event: "answer" }, ({ payload }) => {
        setOppAnswer(payload.answerIdx);
        if (payload.isCorrect) {
          setOpponentScore(prev => prev + payload.points);
          playSound("coin");
          confetti({
            particleCount: 20,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#8B5CF6', '#BEF264']
          });
        }
      })
      .on("broadcast", { event: "next_question" }, () => {
        advanceQuestion();
      })
      .on("broadcast", { event: "chat_message" }, ({ payload }) => {
        setMessages(prev => [...prev, payload]);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.unsubscribe();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [roomQuery]); // eslint-disable-line

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const msg: Message = { user: playerName, text: chatInput, id: Date.now().toString() };
    
    // Adiciona localmente
    setMessages(prev => [...prev, msg]);
    setChatInput("");
    
    // Envia para o canal
    channelRef.current?.send({
      type: "broadcast",
      event: "chat_message",
      payload: msg
    });
  };

  const sendReaction = (emoji: string) => {
    const msg: Message = { user: playerName, text: emoji, id: Date.now().toString() };
    setMessages(prev => [...prev, msg]);
    channelRef.current?.send({
      type: "broadcast",
      event: "chat_message",
      payload: msg
    });
  };

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    const id = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(id);
        setCountdown(null);
        setStatus("playing");
        startQuestionTimer();
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const startQuestionTimer = () => {
    setTimeLeft(15);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const playSound = (type: "correct" | "wrong" | "coin") => {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.play().catch(() => {});
  };

  const handleAnswer = (idx: number) => {
    if (myAnswer !== null || timeLeft === 0) return;
    setMyAnswer(idx);
    
    const q = BATTLE_QUESTIONS[currentQIdx];
    const isCorrect = idx === q.correta;
    
    let points = 0;
    if (isCorrect) {
      points = oppAnswer === null ? 100 : 50; 
      setMyScore(prev => prev + points);
      playSound("coin");
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22D3EE', '#BEF264']
      });
    } else {
      playSound("wrong");
    }

    channelRef.current?.send({
      type: "broadcast",
      event: "answer",
      payload: { answerIdx: idx, isCorrect, points }
    });

    setTimeout(() => {
      if (isHost) {
        channelRef.current?.send({
          type: "broadcast",
          event: "next_question",
        });
        advanceQuestion();
      }
    }, 2000);
  };

  const handleTimeOut = () => {
    if (myAnswer === null) {
      setMyAnswer(-1);
    }
    if (isHost) {
      setTimeout(() => {
        channelRef.current?.send({
          type: "broadcast",
          event: "next_question",
        });
        advanceQuestion();
      }, 2000);
    }
  };

  const advanceQuestion = () => {
    setMyAnswer(null);
    setOppAnswer(null);
    setCurrentQIdx((prev) => {
      if (prev + 1 >= BATTLE_QUESTIONS.length) {
        finishBattle();
        return prev;
      }
      startQuestionTimer();
      return prev + 1;
    });
  };

  const finishBattle = () => {
    setStatus("finished");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (status === "finished") {
      if (myScore >= opponentScore) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#BEF264', '#22D3EE']
        });
      }
    }
  }, [status, myScore, opponentScore]);

  const copyLink = () => {
    const url = `${window.location.origin}/app/batalha?room=${roomId}`;
    navigator.clipboard.writeText(url);
    alert("Link copiado!");
  };

  // Renderizadores de estado da Batalha
  const renderWaiting = () => (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center relative overflow-hidden flex-1">
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob" />
      
      <h1 className="text-4xl lg:text-5xl font-black mb-8 neon-text uppercase flex items-center gap-3">
        <Zap className="w-12 h-12 text-primary" /> Arena
      </h1>
      
      <div className="glass p-8 rounded-3xl max-w-sm w-full neo-brutalism flex flex-col items-center z-10 bg-background/80 backdrop-blur-xl border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <Users className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Aguardando Oponente</h2>
        <p className="text-muted-foreground mb-6 font-medium">Compartilhe o link com um amigo para iniciar o duelo.</p>
        
        <div className="w-full bg-card border-2 border-border p-3 rounded-xl mb-6 flex items-center justify-between text-sm overflow-hidden neo-brutalism">
          <span className="truncate mr-2 select-all font-bold text-secondary">{roomId}</span>
          <Button size="icon" variant="ghost" onClick={copyLink} className="hover:bg-primary/20 hover:text-primary">
            <Copy className="w-5 h-5" />
          </Button>
        </div>
        
        {countdown !== null && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="text-7xl font-black text-secondary neon-text"
          >
            {countdown}
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderPlaying = () => {
    const q = BATTLE_QUESTIONS[currentQIdx];
    return (
      <div className="flex flex-col items-center w-full h-full p-4 lg:p-8 animate-in fade-in zoom-in duration-500 overflow-y-auto custom-scrollbar">
        {/* Top Header do Game */}
        <div className="w-full max-w-3xl flex justify-between items-center mb-8 glass p-4 lg:p-6 rounded-3xl neo-brutalism bg-background/90 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shrink-0">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-primary/20 border-4 border-primary flex items-center justify-center font-black text-lg">
              P1
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm lg:text-base">Você</span>
              <span className="text-primary font-black text-xl lg:text-2xl">{myScore}</span>
            </div>
          </div>

          <div className="text-3xl lg:text-4xl font-black text-secondary animate-pulse neon-text">
            00:{timeLeft.toString().padStart(2, '0')}
          </div>

          <div className="flex items-center gap-3 lg:gap-4 text-right">
            <div className="flex flex-col">
              <span className="font-bold text-sm lg:text-base">Rival</span>
              <span className="text-muted-foreground font-black text-xl lg:text-2xl">{opponentScore}</span>
            </div>
            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-card border-4 border-border flex items-center justify-center font-black text-lg text-muted-foreground">
              P2
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="w-full max-w-3xl mb-8 flex gap-2 shrink-0">
          {BATTLE_QUESTIONS.map((_, i) => (
            <div key={i} className={`h-3 flex-1 rounded-full border-2 border-black ${i <= currentQIdx ? 'bg-secondary' : 'bg-muted'}`} />
          ))}
        </div>

        {/* Question Banner */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-3xl glass p-6 lg:p-10 rounded-[2rem] neo-brutalism bg-card border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden shrink-0 mb-4"
          >
            <div className="absolute top-0 right-0 bg-primary px-4 py-1 rounded-bl-2xl font-black border-l-4 border-b-4 border-black text-black">
              {q.materia}
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-black mb-8 mt-4 leading-tight">{q.enunciado}</h2>

            <div className="flex flex-col gap-4 lg:gap-5">
              {q.alternativas.map((alt, idx) => {
                let btnClass = "bg-background border-border hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-primary text-foreground";
                let Icon = null;
                
                if (myAnswer !== null) {
                  if (idx === q.correta) {
                    btnClass = "bg-secondary border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0 hover:shadow-none";
                    Icon = CheckCircle2;
                  } else if (idx === myAnswer) {
                    btnClass = "bg-destructive border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0 hover:shadow-none";
                    Icon = XCircle;
                  } else {
                    btnClass = "bg-background border-border opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={myAnswer !== null}
                    className={`w-full text-left p-4 lg:p-5 rounded-2xl border-4 transition-all duration-200 flex items-center justify-between font-bold text-lg lg:text-xl ${btnClass}`}
                  >
                    <span>{alt}</span>
                    {Icon && <Icon className="w-8 h-8" />}
                  </button>
                );
              })}
            </div>
            
            {oppAnswer !== null && (
              <div className="mt-8 text-center text-sm font-black text-primary animate-bounce bg-primary/10 py-2 rounded-xl border-2 border-primary/20">
                ⚡ O oponente já respondeu! ⚡
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const renderFinished = () => {
    const won = myScore >= opponentScore;
    const draw = myScore === opponentScore;
    
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center animate-in zoom-in duration-500 flex-1">
        <h1 className={`text-6xl lg:text-7xl font-black mb-6 uppercase neon-text tracking-tight ${draw ? 'text-yellow-400' : (won ? 'text-secondary' : 'text-destructive')}`}>
          {draw ? 'EMPATE!' : (won ? 'VITÓRIA!' : 'DERROTA!')}
        </h1>
        
        <div className="glass p-8 lg:p-12 rounded-[2.5rem] max-w-md w-full neo-brutalism flex flex-col gap-8 bg-card border-4 border-border shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center text-2xl font-black">
            <div className="flex flex-col items-center">
              <span className="text-base text-muted-foreground mb-2">Você</span>
              <span className={`text-5xl ${won ? 'text-secondary' : 'text-foreground'}`}>{myScore}</span>
              <span className="text-sm text-primary mt-2">+{won ? 200 : 50} XP</span>
            </div>
            <span className="text-muted-foreground/30 text-4xl">VS</span>
            <div className="flex flex-col items-center">
              <span className="text-base text-muted-foreground mb-2">Rival</span>
              <span className={`text-5xl ${!won && !draw ? 'text-secondary' : 'text-muted-foreground'}`}>{opponentScore}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Button onClick={() => window.location.reload()} className="bg-primary text-black hover:bg-primary/90 neo-brutalism py-6 text-xl border-4 border-black">
              Revanche
            </Button>
            <Button variant="outline" onClick={() => router.push('/app')} className="neo-brutalism py-6 text-xl border-4">
              Sair da Arena
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-background text-foreground flex flex-col lg:flex-row p-4 lg:p-6 gap-4 max-w-[1600px] mx-auto overflow-y-auto custom-scrollbar">
      
      {/* Esquerda: Arena de Batalha (Lobby ou Gameplay) */}
      <div className="flex-1 flex flex-col bg-card/30 rounded-[2.5rem] border-4 border-border shadow-inner overflow-hidden min-h-[45vh] lg:min-h-0 relative neo-brutalism-soft">
         {status === "waiting" && renderWaiting()}
         {status === "playing" && renderPlaying()}
         {status === "finished" && renderFinished()}
      </div>

      {/* Direita: Chat Ao Vivo */}
      <div className="w-full lg:w-[320px] h-[200px] lg:h-full flex flex-col glass p-3 lg:p-4 rounded-[2rem] neo-brutalism border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shrink-0 bg-card">
        
        {/* Chat Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b-4 border-border shrink-0">
          <div className="w-10 h-10 bg-primary/20 rounded-xl border-2 border-primary flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-black text-lg uppercase tracking-tight">Live Chat</h3>
            <p className="text-[10px] text-muted-foreground font-bold">Sala {roomId}</p>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4 pr-2 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-bold text-center px-4">
              O chat está silencioso. Seja o primeiro a provocar o oponente!
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col animate-in slide-in-from-bottom-2 ${msg.user === playerName ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] uppercase font-black text-muted-foreground mb-1 ml-1">{msg.user}</span>
                <div className={`px-4 py-2 rounded-2xl border-2 font-medium max-w-[85%] break-words shadow-sm ${
                  msg.user === playerName 
                  ? 'bg-primary/20 border-primary/50 rounded-tr-sm text-foreground' 
                  : 'bg-muted border-border rounded-tl-sm text-foreground'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Reactions */}
        <div className="flex gap-2 pb-2 shrink-0 overflow-x-auto no-scrollbar">
          {["🔥", "😱", "🤯", "😂", "🚀", "👀"].map(emoji => (
            <button 
              key={emoji}
              onClick={() => sendReaction(emoji)}
              className="text-xl bg-background border-2 border-border p-2 rounded-xl hover:scale-110 hover:border-primary transition-all neo-brutalism shrink-0"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 pt-2 shrink-0">
          <input 
            className="flex-1 bg-background border-4 border-border rounded-2xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-primary transition-colors neo-brutalism placeholder:text-muted-foreground/50"
            placeholder="Digite algo..."
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} className="h-auto aspect-square bg-primary hover:bg-primary/90 text-black border-4 border-black rounded-2xl neo-brutalism p-0 flex items-center justify-center">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

    </div>
  );
}

export default function Batalha1v1() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-background"><span className="text-xl font-bold neon-text">Carregando Arena...</span></div>}>
      <Batalha1v1Content />
    </Suspense>
  );
}
