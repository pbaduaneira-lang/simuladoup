"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function TermosPage() {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-background flex flex-col pt-8 px-4 pb-24 font-sans text-foreground"
    >
      <div className="w-full max-w-2xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-6 font-bold"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </button>

        <h1 className="text-3xl font-black mb-2 text-white">Privacidade e Termos</h1>
        <p className="text-muted-foreground mb-8 text-sm">Última atualização: Setembro de 2026</p>

        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed bg-[#1A1A1E] border-4 border-[#2A2A2E] p-6 rounded-2xl neo-brutalism">
          
          <section>
            <h2 className="text-lg font-black text-white mb-2 uppercase tracking-wide">1. Introdução</h2>
            <p>
              Bem-vindo ao SimuladoUp. Ao utilizar nosso aplicativo, você concorda com estes termos. 
              Nosso objetivo é fornecer a melhor experiência de estudos gamificada possível, respeitando a sua privacidade.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-2 uppercase tracking-wide">2. Coleta de Dados</h2>
            <p>
              Coletamos as informações estritamente necessárias para o funcionamento do app, como:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Seu nome e e-mail para identificação da conta.</li>
              <li>Seu histórico de questões resolvidas para a Inteligência Artificial moldar o seu nível.</li>
              <li>Informações básicas do dispositivo para corrigir bugs (Analytics).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#22D3EE] mb-2 uppercase tracking-wide">3. Segurança e Privacidade</h2>
            <p>
              Nunca venderemos seus dados. Todos os dados de cartão de crédito e informações de pagamento 
              são criptografados e processados por provedores terceirizados ultra seguros. 
              Não armazenamos números de cartão em nossos servidores.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#7C3AED] mb-2 uppercase tracking-wide">4. Plano Premium (PRO)</h2>
            <p>
              Assinaturas do SimuladoUp PRO são cobradas de forma recorrente. 
              Você pode cancelar a qualquer momento nas configurações da loja do seu celular 
              (App Store ou Google Play). O cancelamento interrompe a cobrança do próximo ciclo, 
              mas não gera reembolso do ciclo atual.
            </p>
          </section>

        </div>

        <Button 
          onClick={() => router.back()}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl mt-8 neo-brutalism"
        >
          Li e Concordo
        </Button>
      </div>
    </motion.div>
  );
}
