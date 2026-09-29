"use client";

import { useState } from "react";
import { User, Flame, Calculator, BookA, Globe, Atom, BookOpen, ScrollText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Matemática");

  const openModal = (subject: string) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const subjectData = {
    "Matemática": { icon: Calculator, color: "#7C3AED", route: "matematica" },
    "Português": { icon: BookA, color: "#22D3EE", route: "portugues" },
    "História": { icon: ScrollText, color: "#F59E0B", route: "historia" },
    "Ciências": { icon: Atom, color: "#10B981", route: "ciencias" },
    "Geografia": { icon: Globe, color: "#3B82F6", route: "geografia" },
    "Outras": { icon: BookOpen, color: "#EC4899", route: "outras" },
  };

  const currentSubjectData = subjectData[selectedSubject as keyof typeof subjectData];
  const IconComponent = currentSubjectData?.icon || Calculator;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-8 px-4 pb-24 font-sans text-foreground">
      
      {/* HEADER SIMPLES */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black neon-text">Olá, Edmilton! 👋</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-card border border-border px-3 py-1 rounded-full flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-sm font-bold">3 dias - 7/10 hoje</span>
            </div>
          </div>
        </div>
        <Link href="/app/perfil" className="w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer shrink-0">
          <User className="w-6 h-6 text-primary" />
        </Link>
      </div>

      {/* SEÇÃO PRINCIPAL */}
      <div className="w-full max-w-2xl flex flex-col mb-12">
        <h2 className="text-3xl lg:text-4xl font-black mb-1">Começar por onde?</h2>
        <p className="text-muted-foreground mb-8">Escolha uma matéria e dê o seu Up agora</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* MATEMÁTICA */}
          <button 
            onClick={() => openModal("Matemática")}
            className="flex flex-col items-start p-5 bg-[#1A1A1E] rounded-2xl border-2 border-[#7C3AED] hover:bg-[#1A1A1E]/80 transition-all neo-brutalism text-left relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#7C3AED]/10 rounded-full blur-xl" />
            <Calculator className="w-8 h-8 text-[#7C3AED] mb-3" />
            <span className="font-bold text-lg">Matemática</span>
            <span className="text-xs text-muted-foreground mt-1">127 questões</span>
          </button>

          {/* PORTUGUÊS */}
          <button 
            onClick={() => openModal("Português")}
            className="flex flex-col items-start p-5 bg-[#1A1A1E] rounded-2xl border-2 border-[#22D3EE] hover:bg-[#1A1A1E]/80 transition-all neo-brutalism text-left relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#22D3EE]/10 rounded-full blur-xl" />
            <BookA className="w-8 h-8 text-[#22D3EE] mb-3" />
            <span className="font-bold text-lg">Português</span>
            <span className="text-xs text-muted-foreground mt-1">84 questões</span>
          </button>

          {/* HISTÓRIA */}
          <button 
            onClick={() => openModal("História")}
            className="flex flex-col items-start p-5 bg-[#1A1A1E] rounded-2xl border-2 border-[#F59E0B] hover:bg-[#1A1A1E]/80 transition-all neo-brutalism text-left relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#F59E0B]/10 rounded-full blur-xl" />
            <ScrollText className="w-8 h-8 text-[#F59E0B] mb-3" />
            <span className="font-bold text-lg">História</span>
            <span className="text-xs text-muted-foreground mt-1">45 questões</span>
          </button>

          {/* CIÊNCIAS */}
          <button 
            onClick={() => openModal("Ciências")}
            className="flex flex-col items-start p-5 bg-[#1A1A1E] rounded-2xl border-2 border-[#10B981] hover:bg-[#1A1A1E]/80 transition-all neo-brutalism text-left relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#10B981]/10 rounded-full blur-xl" />
            <Atom className="w-8 h-8 text-[#10B981] mb-3" />
            <span className="font-bold text-lg">Ciências</span>
            <span className="text-xs text-muted-foreground mt-1">62 questões</span>
          </button>

          {/* GEOGRAFIA */}
          <button 
            onClick={() => openModal("Geografia")}
            className="flex flex-col items-start p-5 bg-[#1A1A1E] rounded-2xl border-2 border-[#3B82F6] hover:bg-[#1A1A1E]/80 transition-all neo-brutalism text-left relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#3B82F6]/10 rounded-full blur-xl" />
            <Globe className="w-8 h-8 text-[#3B82F6] mb-3" />
            <span className="font-bold text-lg">Geografia</span>
            <span className="text-xs text-muted-foreground mt-1">50 questões</span>
          </button>

          {/* OUTRAS */}
          <button 
            onClick={() => openModal("Outras")}
            className="flex flex-col items-start p-5 bg-[#1A1A1E] rounded-2xl border-2 border-[#EC4899] hover:bg-[#1A1A1E]/80 transition-all neo-brutalism text-left relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#EC4899]/10 rounded-full blur-xl" />
            <BookOpen className="w-8 h-8 text-[#EC4899] mb-3" />
            <span className="font-bold text-lg">Outras</span>
            <span className="text-xs text-muted-foreground mt-1">20 questões</span>
          </button>

          {/* BATALHA 1VS1 NO GRID */}
          <div className="col-span-2 lg:col-span-2 bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border-2 border-primary/50 rounded-2xl p-5 flex flex-col justify-center items-center text-center relative overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => router.push('/app/batalha')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
            <span className="text-3xl mb-2">⚔️</span>
            <h3 className="font-black text-lg text-foreground">Quer desafiar um amigo?</h3>
            <p className="text-xs text-muted-foreground mb-3">Batalha 1vs1 em tempo real</p>
            <Link href="/app/batalha" className="w-full max-w-[200px] text-center bg-primary hover:bg-primary/80 text-white font-bold py-2 rounded-xl transition-colors text-sm neo-brutalism">
              BATALHAR
            </Link>
          </div>

        </div>
      </div>



      {/* MODAL SIMULADO DINÂMICO */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-background border-2 border-primary shadow-[4px_4px_0px_0px_rgba(139,92,246,0.5)] sm:max-w-md rounded-2xl p-0 overflow-hidden">
          <div className="bg-card p-6 flex flex-col items-center text-center border-b border-border">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 border-2 border-primary">
              <IconComponent className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-black mb-1">Simulado de {selectedSubject}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Você está prestes a iniciar um novo simulado.
            </DialogDescription>
          </div>
          
          <div className="p-6">
            <ul className="space-y-4 mb-8 text-sm font-medium">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                10 questões selecionadas para o seu nível
              </li>
              <li className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Temporizador ativado (15 min)
                </div>
                <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Ouça a explicação em áudio após cada questão
              </li>
              <li className="flex items-center gap-3 text-secondary font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Ganhe +10 XP por acerto
              </li>
            </ul>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => router.push(`/app/feed?materia=${currentSubjectData?.route || 'matematica'}`)}
                className="w-full h-14 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white font-black text-lg rounded-xl hover:opacity-90 neo-brutalism"
              >
                SIM, INICIAR
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="w-full h-14 border-2 border-border font-bold text-lg rounded-xl hover:bg-muted"
              >
                NÃO, VOLTAR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
