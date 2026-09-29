"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Mail, Lock, User, School, MapPin, Building2, Phone } from "lucide-react";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [ondeEstuda, setOndeEstuda] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");

  // Redireciona automaticamente se já estiver logado
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/app");
      }
    });
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Log in
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        router.push("/app");
      } else {
        // Sign up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nomeCompleto,
              ondeEstuda,
              cidade,
              endereco,
              telefone,
            }
          }
        });
        if (signUpError) throw signUpError;
        
        // Chamada para rota de API que vai criar o usuário no Prisma (Next steps)
        await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: data.user?.id,
            email,
            nomeCompleto,
            ondeEstuda,
            cidade,
            endereco,
            telefone,
          }),
        });

        router.push("/app");
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex overflow-hidden font-sans text-white">
      {/* Lado Esquerdo - Banner Decorativo (Hidden no Mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] items-center justify-center p-12 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/20 blur-[120px] rounded-full" />
        
        <div className="relative z-10 max-w-xl">
          <Link href="/" className="inline-flex items-center gap-2 mb-12 bg-white/10 px-4 py-2 rounded-full backdrop-blur hover:bg-white/20 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /> Voltar para o início
          </Link>
          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            O seu futuro não precisa ser chato.
          </h1>
          <p className="text-xl text-white/90 font-medium mb-12">
            Junte-se a milhares de estudantes que trocaram o feed infinito do TikTok por XP, Rankings e Batalhas Épicas.
          </p>
          
          <div className="flex gap-4">
            <div className="glass bg-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 border border-white/20">
              <span className="text-3xl">⚔️</span>
              <div>
                <p className="font-bold">Batalhas ao vivo</p>
                <p className="text-sm text-white/70">Desafie amigos</p>
              </div>
            </div>
            <div className="glass bg-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 border border-white/20">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="font-bold">Ofensiva Diária</p>
                <p className="text-sm text-white/70">Mantenha a chama</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative h-screen overflow-y-auto">
        <Link href="/" className="lg:hidden absolute top-6 left-6 text-muted-foreground flex items-center gap-2">
          <ArrowRight className="w-4 h-4 rotate-180" /> Voltar
        </Link>

        <div className="w-full max-w-md my-auto">
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-xl object-contain" />
          </div>

          <h2 className="text-3xl font-black mb-2 text-center">
            {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
          </h2>
          <p className="text-[#A1A1AA] text-center mb-8">
            {isLogin ? "Pronto para aumentar seu XP hoje?" : "Preencha seus dados para começar a batalhar."}
          </p>

          {/* Toggle Login/Signup */}
          <div className="flex p-1 bg-[#141417] rounded-xl mb-8 border border-[#1F1F23]">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-primary text-white shadow-lg' : 'text-[#A1A1AA] hover:text-white'}`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-primary text-white shadow-lg' : 'text-[#A1A1AA] hover:text-white'}`}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input required={!isLogin} type="text" placeholder="Nome Completo" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} className="w-full bg-[#141417] border border-[#1F1F23] rounded-xl h-12 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input required={!isLogin} type="text" placeholder="Onde estuda? (Ex: Colégio X)" value={ondeEstuda} onChange={(e) => setOndeEstuda(e.target.value)} className="w-full bg-[#141417] border border-[#1F1F23] rounded-xl h-12 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input required={!isLogin} type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full bg-[#141417] border border-[#1F1F23] rounded-xl h-12 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input required={!isLogin} type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full bg-[#141417] border border-[#1F1F23] rounded-xl h-12 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input required={!isLogin} type="tel" placeholder="Telefone (WhatsApp)" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-[#141417] border border-[#1F1F23] rounded-xl h-12 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input required type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#141417] border border-[#1F1F23] rounded-xl h-12 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors" />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input required type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#141417] border border-[#1F1F23] rounded-xl h-12 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors" />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-sm text-center">
                {error}
              </motion.div>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90 text-white font-black h-12 rounded-xl mt-4 shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "ENTRAR NO SIMULADOUP" : "CRIAR CONTA E JOGAR")}
            </Button>
          </form>

          <p className="text-center text-[#A1A1AA] text-xs mt-8">
            Ao continuar, você concorda com nossos <a href="#" className="underline hover:text-white">Termos de Uso</a> e <a href="#" className="underline hover:text-white">Política de Privacidade</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B]" />}>
      <LoginContent />
    </Suspense>
  );
}
