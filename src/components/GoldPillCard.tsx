"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface GoldPillCardProps {
  title: string;
  content: string;
  onSabia: () => void;
  onNaoSabia: () => void;
}

export function GoldPillCard({ title, content, onSabia, onNaoSabia }: GoldPillCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="w-full flex flex-col items-center justify-center gap-6 p-8 rounded-3xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950 shadow-[0_0_40px_rgba(250,204,21,0.4)] neo-brutalism border-yellow-300"
    >
      <div className="flex items-center gap-2 bg-yellow-950/10 px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-wider">
        <Sparkles className="w-4 h-4" />
        Pílula de Ouro
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-black mb-4 uppercase">{title}</h2>
        <p className="text-xl font-bold leading-snug">
          {content}
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full mt-4">
        <Button 
          onClick={onSabia}
          className="w-full h-14 text-lg font-bold bg-white/20 hover:bg-white/30 text-yellow-950 border-2 border-yellow-950/20"
        >
          ✅ Já sabia
        </Button>
        <Button 
          onClick={onNaoSabia}
          className="w-full h-14 text-lg font-bold bg-yellow-950 hover:bg-yellow-900 text-yellow-400 shadow-xl"
        >
          🤯 Não sabia, manda mais!
        </Button>
      </div>
    </motion.div>
  );
}
