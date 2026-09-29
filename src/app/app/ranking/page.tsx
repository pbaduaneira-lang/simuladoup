"use client";

import { Trophy, Medal, Flame } from "lucide-react";

export default function Ranking() {
  const users = [
    { rank: 1, name: "Lucas M.", xp: 12450, isMe: false },
    { rank: 2, name: "Você", xp: 11200, isMe: true },
    { rank: 3, name: "Ana P.", xp: 9800, isMe: false },
    { rank: 4, name: "Carlos T.", xp: 8750, isMe: false },
    { rank: 5, name: "Julia R.", xp: 8100, isMe: false },
    { rank: 6, name: "Marcos S.", xp: 7500, isMe: false },
    { rank: 7, name: "Bia C.", xp: 7200, isMe: false },
  ];

  return (
    <div className="h-full w-full max-w-md mx-auto bg-background px-4 pt-10 pb-28 overflow-y-auto no-scrollbar border-x border-border/50">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/20 rounded-2xl neo-brutalism">
            <Trophy className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-black neon-text">Ranking</h1>
            <p className="text-sm text-muted-foreground">Liga Ouro - Curitiba, PR</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end text-primary">
            <Flame className="w-4 h-4 fill-primary" />
            <span className="font-bold">12 dias</span>
          </div>
          <span className="text-xs text-muted-foreground">Ofensiva</span>
        </div>
      </div>

      <div className="bg-gradient-to-b from-card to-background rounded-3xl p-2 border border-border shadow-xl">
        <div className="flex text-xs font-bold uppercase text-muted-foreground px-4 py-2">
          <span className="w-8 text-center">#</span>
          <span className="flex-1 ml-4">Nome</span>
          <span className="w-16 text-right">XP</span>
        </div>

        <div className="space-y-2 mt-2">
          {users.map((u) => (
            <div 
              key={u.rank} 
              className={`flex items-center px-4 py-3 rounded-2xl transition-all ${
                u.isMe ? 'bg-primary/20 border-2 border-primary neo-brutalism transform scale-[1.02]' : 'bg-card border-2 border-transparent hover:border-border'
              }`}
            >
              <div className="w-8 flex justify-center font-black">
                {u.rank === 1 ? <Medal className="w-6 h-6 text-yellow-400" /> : 
                 u.rank === 2 ? <Medal className="w-6 h-6 text-gray-300" /> : 
                 u.rank === 3 ? <Medal className="w-6 h-6 text-amber-600" /> : 
                 <span className="text-muted-foreground">{u.rank}</span>}
              </div>
              
              <div className="flex-1 ml-4 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  u.isMe ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {u.name.substring(0, 2).toUpperCase()}
                </div>
                <span className={`font-bold ${u.isMe ? 'text-primary neon-text' : 'text-foreground'}`}>
                  {u.name}
                </span>
              </div>
              
              <div className="w-16 text-right font-black tracking-wider text-accent">
                {u.xp}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Paywall Banner / CTA */}
      <div className="mt-8 p-6 rounded-3xl bg-secondary/10 border-2 border-secondary text-center neo-brutalism relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-secondary/30 rounded-full blur-xl" />
        <h3 className="font-black text-secondary text-lg mb-2">Você está no TOP 30%!</h3>
        <p className="text-sm text-muted-foreground mb-4">Assine o plano PRO para desbloquear questões ilimitadas e subir de Liga mais rápido.</p>
        <button className="w-full bg-secondary text-secondary-foreground font-bold py-3 rounded-xl hover:bg-secondary/90 transition-colors">
          Desbloquear PRO
        </button>
      </div>
    </div>
  );
}
