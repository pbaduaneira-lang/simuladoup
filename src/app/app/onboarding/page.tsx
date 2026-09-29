"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, Clock, Zap, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [meta, setMeta] = useState("");
  const [tempo, setTempo] = useState("");

  const metas = [
    "ENEM",
    "Concurso Prefeitura",
    "Polícia Militar",
    "Polícia Federal",
    "TRT",
    "OAB"
  ];

  const tempos = [
    "15 min/dia",
    "30 min/dia",
    "1 hora/dia",
    "+2 horas/dia"
  ];

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else {
      // Finalizar onboarding e ir pro feed
      router.push("/app");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Top Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "33%" }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6 text-center"
            >
              <div className="mx-auto bg-primary/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 neo-brutalism">
                <Target className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-black">Qual sua meta principal?</h2>
              <p className="text-muted-foreground">Vamos focar o algoritmo da IA no que realmente importa pra você.</p>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                {metas.map((m) => (
                  <Card
                    key={m}
                    onClick={() => { setMeta(m); nextStep(); }}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      meta === m ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-semibold">{m}</span>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6 text-center"
            >
              <div className="mx-auto bg-secondary/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 neo-brutalism">
                <Clock className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="text-3xl font-black">Quanto tempo por dia?</h2>
              <p className="text-muted-foreground">Consistência é melhor que intensidade. Seja realista.</p>
              
              <div className="grid grid-cols-1 gap-3 mt-4">
                {tempos.map((t) => (
                  <Card
                    key={t}
                    onClick={() => { setTempo(t); nextStep(); }}
                    className={`p-4 cursor-pointer transition-all border-2 flex justify-between items-center ${
                      tempo === t ? "border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(190,242,100,0.3)]" : "border-border hover:border-secondary/50"
                    }`}
                  >
                    <span className="font-semibold text-lg">{t}</span>
                    <Zap className={`w-5 h-5 ${tempo === t ? "text-secondary" : "text-muted-foreground"}`} />
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-6 text-center"
            >
              <div className="mx-auto bg-accent/20 p-4 rounded-full w-24 h-24 flex items-center justify-center mb-4 animate-bounce neo-brutalism">
                <CheckCircle2 className="w-12 h-12 text-accent" />
              </div>
              <h2 className="text-4xl font-black neon-text">Tudo Pronto!</h2>
              <p className="text-lg text-muted-foreground">
                Criamos um plano personalizado com IA para <strong className="text-foreground">{meta}</strong> treinando <strong className="text-foreground">{tempo}</strong>.
              </p>
              
              <Button 
                onClick={nextStep}
                size="lg" 
                className="mt-8 bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all text-white font-bold h-14 text-lg neo-brutalism shadow-[0_0_20px_rgba(34,211,238,0.5)]"
              >
                Começar a Viciar!
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
