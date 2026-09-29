"use client";

import { useState } from "react";
import { User as UserIcon, Settings, LogOut, CreditCard, Shield, HelpCircle, Edit3, Check, Loader2, Volume2, Bell, Moon, X, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Perfil() {
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isPrefOpen, setIsPrefOpen] = useState(false);
  const [isProOpen, setIsProOpen] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  
  // States do Formulário
  const [nome, setNome] = useState("Lucas M.");
  const [cidade, setCidade] = useState("Curitiba, PR");
  const [ondeEstuda, setOndeEstuda] = useState("Colégio Estadual do Paraná");
  const [meta, setMeta] = useState("ENEM 2026");

  // TEST USER ID
  const TEST_USER_ID = "b6b43411-fe62-4966-ac48-1cfd906d2e85";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: TEST_USER_ID,
          nomeCompleto: nome,
          cidade,
          ondeEstuda,
          meta
        })
      });
      if (res.ok) {
        setIsEditing(false);
      } else {
        alert("Erro ao salvar o perfil.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar o perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full w-full max-w-md mx-auto bg-background px-4 pt-10 pb-28 overflow-y-auto no-scrollbar border-x border-border/50 flex flex-col items-center"
    >
      <div className="flex flex-col items-center justify-center mb-10 w-full relative">
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isSaving}
          className="absolute top-0 right-0 p-2 bg-[#7C3AED]/20 text-[#7C3AED] rounded-full hover:bg-[#7C3AED] hover:text-white transition-colors border-2 border-transparent hover:border-[#7C3AED] neo-brutalism"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditing ? <Check className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />)}
        </button>

        <div className="w-28 h-28 rounded-full bg-[#1A1A1E] border-4 border-[#7C3AED] shadow-[4px_4px_0px_0px_rgba(139,92,246,0.6)] flex items-center justify-center neo-brutalism mb-6 relative transition-transform hover:scale-105">
          <UserIcon className="w-14 h-14 text-[#7C3AED]" />
          <div className="absolute -bottom-3 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white text-[10px] font-black px-4 py-1.5 rounded-full border-2 border-transparent shadow-[0_0_10px_rgba(34,211,238,0.5)] uppercase tracking-widest">
            Nível 14
          </div>
        </div>
        
        {isEditing ? (
          <input 
            type="text" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="text-2xl font-black text-center bg-transparent border-b-2 border-[#7C3AED] focus:outline-none mb-1 w-full max-w-[200px]"
            placeholder="Seu Nome"
          />
        ) : (
          <h1 className="text-3xl font-black text-white">{nome}</h1>
        )}
        
        <p className="text-sm text-muted-foreground mt-1 font-medium">user@simuladoup.com</p>
        <div className="mt-4 bg-[#1A1A1E] border-2 border-[#2A2A2E] text-muted-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          Plano Grátis
        </div>
      </div>

      {/* Profile Edit Fields */}
      {isEditing ? (
        <div className="bg-[#1A1A1E] border-4 border-[#2A2A2E] p-5 rounded-2xl mb-8 space-y-4 w-full neo-brutalism">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cidade</label>
            <input 
              type="text" 
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full bg-background border-2 border-[#2A2A2E] rounded-xl p-3 mt-1 focus:border-[#7C3AED] outline-none font-medium transition-colors text-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Onde Estuda</label>
            <input 
              type="text" 
              value={ondeEstuda}
              onChange={(e) => setOndeEstuda(e.target.value)}
              className="w-full bg-background border-2 border-[#2A2A2E] rounded-xl p-3 mt-1 focus:border-[#7C3AED] outline-none font-medium transition-colors text-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Meta / Foco</label>
            <input 
              type="text" 
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              className="w-full bg-background border-2 border-[#2A2A2E] rounded-xl p-3 mt-1 focus:border-[#7C3AED] outline-none font-medium transition-colors text-white"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-10 w-full">
          <div className="bg-[#1A1A1E] border-4 border-[#22D3EE]/50 shadow-[4px_4px_0px_0px_rgba(34,211,238,0.2)] p-4 rounded-2xl flex flex-col items-center text-center hover:-translate-y-1 transition-transform neo-brutalism cursor-default">
            <span className="text-3xl font-black text-[#22D3EE]">1.245</span>
            <span className="text-xs text-muted-foreground font-bold uppercase mt-1 tracking-wider">Questões</span>
          </div>
          <div className="bg-[#1A1A1E] border-4 border-[#7C3AED]/50 shadow-[4px_4px_0px_0px_rgba(139,92,246,0.2)] p-4 rounded-2xl flex flex-col items-center text-center hover:-translate-y-1 transition-transform neo-brutalism cursor-default">
            <span className="text-3xl font-black text-[#7C3AED]">78%</span>
            <span className="text-xs text-muted-foreground font-bold uppercase mt-1 tracking-wider">Taxa de Acerto</span>
          </div>
        </div>
      )}

      <div className="space-y-3 w-full">
        <h3 className="font-bold text-muted-foreground uppercase text-xs tracking-wider mb-3 ml-2">Configurações</h3>
        
        <Button onClick={() => setIsProOpen(true)} className="w-full justify-start h-16 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:opacity-90 text-white border-2 border-transparent text-base font-black rounded-2xl shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:-translate-y-1 transition-transform neo-brutalism relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 blur-3xl rounded-full transition-transform group-hover:scale-110" />
          <CreditCard className="w-6 h-6 mr-3 z-10" />
          <span className="z-10 tracking-wide">ASSINAR PRO</span>
        </Button>
        
        <Button onClick={() => setIsPrefOpen(true)} className="w-full justify-start h-14 bg-[#1A1A1E] hover:bg-[#2A2A2E] border-4 border-[#2A2A2E] hover:border-[#7C3AED]/50 text-white text-sm font-bold rounded-2xl transition-all hover:scale-[1.02] neo-brutalism">
          <Settings className="w-5 h-5 mr-3 text-muted-foreground" />
          Preferências
        </Button>
        
        <Button onClick={() => router.push('/app/termos')} className="w-full justify-start h-14 bg-[#1A1A1E] hover:bg-[#2A2A2E] border-4 border-[#2A2A2E] hover:border-[#22D3EE]/50 text-white text-sm font-bold rounded-2xl transition-all hover:scale-[1.02] neo-brutalism">
          <Shield className="w-5 h-5 mr-3 text-muted-foreground" />
          Privacidade e Termos
        </Button>
        
        <Button onClick={() => window.open('https://wa.me/5511999999999?text=Ol%C3%A1+Suporte+do+SimuladoUp%21+Preciso+de+ajuda.', '_blank')} className="w-full justify-start h-14 bg-[#1A1A1E] hover:bg-[#2A2A2E] border-4 border-[#2A2A2E] hover:border-muted-foreground/30 text-white text-sm font-bold rounded-2xl transition-all hover:scale-[1.02] neo-brutalism">
          <HelpCircle className="w-5 h-5 mr-3 text-muted-foreground" />
          Ajuda e Suporte
        </Button>

        <Button className="w-full justify-start h-14 bg-destructive/10 hover:bg-destructive/20 border-4 border-destructive/50 text-destructive text-sm font-bold rounded-2xl mt-8 transition-transform hover:-translate-y-1 neo-brutalism">
          <LogOut className="w-5 h-5 mr-3" />
          Sair da conta
        </Button>
      </div>

      {/* MODAL PREFERÊNCIAS */}
      <Dialog open={isPrefOpen} onOpenChange={setIsPrefOpen}>
        <DialogContent className="bg-background border-4 border-[#2A2A2E] sm:max-w-md rounded-2xl p-0 overflow-hidden neo-brutalism">
          <div className="bg-[#1A1A1E] p-6 flex flex-col items-center text-center border-b-4 border-[#2A2A2E]">
            <h2 className="text-2xl font-black text-white">Preferências</h2>
            <p className="text-muted-foreground text-sm mt-1">Ajuste o app do seu jeito.</p>
          </div>
          <div className="p-6 space-y-4">
            
            <div className="flex items-center justify-between p-4 bg-background border-2 border-[#2A2A2E] rounded-xl">
              <div className="flex items-center gap-3 text-white font-bold">
                <Volume2 className="text-[#7C3AED]" /> Efeitos Sonoros
              </div>
              <div 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors border-2 ${soundEnabled ? 'bg-[#7C3AED] border-[#7C3AED]' : 'bg-[#1A1A1E] border-[#2A2A2E]'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-[1px] transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-background border-2 border-[#2A2A2E] rounded-xl">
              <div className="flex items-center gap-3 text-white font-bold">
                <Bell className="text-[#22D3EE]" /> Lembretes de Estudo
              </div>
              <div 
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors border-2 ${pushEnabled ? 'bg-[#22D3EE] border-[#22D3EE]' : 'bg-[#1A1A1E] border-[#2A2A2E]'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-[1px] transition-transform ${pushEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-background border-2 border-[#2A2A2E] rounded-xl opacity-60">
              <div className="flex items-center gap-3 text-white font-bold">
                <Moon className="text-muted-foreground" /> Modo Escuro
              </div>
              <div className="text-xs font-bold bg-[#1A1A1E] px-2 py-1 rounded">PADRÃO</div>
            </div>

            <Button onClick={() => setIsPrefOpen(false)} className="w-full h-12 mt-4 font-bold rounded-xl neo-brutalism bg-white text-black hover:bg-white/90">
              FECHAR
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL PRO */}
      <Dialog open={isProOpen} onOpenChange={setIsProOpen}>
        <DialogContent className="bg-background border-4 border-[#7C3AED] shadow-[0_0_30px_rgba(139,92,246,0.3)] sm:max-w-md rounded-2xl p-0 overflow-hidden neo-brutalism [&>button]:hidden">
          <button onClick={() => setIsProOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white z-10"><X /></button>
          
          <div className="bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />
            <Crown className="w-16 h-16 text-white mb-4 drop-shadow-md" />
            <h2 className="text-3xl font-black text-white drop-shadow-md mb-2">SimuladoUp PRO</h2>
            <p className="text-white/90 font-medium">Desbloqueie o Máximo do seu Cérebro 🧠</p>
          </div>
          
          <div className="p-6">
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 font-bold text-white">
                <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center"><Zap className="w-4 h-4 text-[#7C3AED]" /></div>
                Simulados de IA Ilimitados
              </li>
              <li className="flex items-center gap-3 font-bold text-white">
                <div className="w-8 h-8 rounded-full bg-[#22D3EE]/20 flex items-center justify-center"><Shield className="w-4 h-4 text-[#22D3EE]" /></div>
                Vidas Infinitas na Batalha
              </li>
              <li className="flex items-center gap-3 font-bold text-white">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center"><Check className="w-4 h-4 text-pink-500" /></div>
                Zero Anúncios Sempre
              </li>
            </ul>

            <Button onClick={() => alert("Integração de pagamento em breve!")} className="w-full h-14 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:opacity-90 text-white font-black text-lg rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.4)] neo-brutalism hover:-translate-y-1 transition-transform">
              ASSINAR POR R$ 19,90 / mês
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4 font-medium">Cancele quando quiser. Cobrança mensal.</p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
