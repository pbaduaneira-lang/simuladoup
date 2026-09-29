import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";

export function BattleBanner() {
  return (
    <Link href="/app/batalha" className="block mx-4 mt-20 p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-transform">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0">
            ⚔️
          </div>
          <div className="flex flex-col">
            <span className="font-black text-white text-base leading-tight">BATALHA 1VS1</span>
            <span className="text-white/80 text-xs">Desafie um amigo agora • +200 XP</span>
          </div>
        </div>
        <div className="bg-white text-purple-600 px-3 py-1.5 rounded-full font-black text-xs whitespace-nowrap">
          BATALHAR
        </div>
      </div>
    </Link>
  );
}

export function FocusBanner() {
  const { setFocusMode } = useAppStore();
  return (
    <div className="mx-4 mt-4 p-4 rounded-2xl bg-[#1A1A1E] border border-[#2A2A2E] flex flex-col gap-3">
      <p className="text-sm font-medium text-white/90">
        🧠 Precisa focar? Modo Pomodoro 25min + Lo-fi + Moeda do Mario a cada acerto
      </p>
      <button 
        onClick={() => setFocusMode(true)}
        className="self-end bg-[#BEF264] text-black px-4 py-2 rounded-full font-black text-xs hover:bg-[#a8e04b] transition-colors"
      >
        ENTRAR EM FOCO
      </button>
    </div>
  );
}
