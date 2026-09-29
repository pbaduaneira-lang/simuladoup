# 🚀 Status do Projeto SimuladoUp (Checkpoint Final Gravi)

Este documento registra o estado completo do projeto, o progresso realizado, a arquitetura, a segurança implementada, o acervo de questões e o passo a passo para **Deploy (GitHub + Vercel)** e **Publicação na Google Play Store**.

---

## 🎯 A Visão do Produto
O **SimuladoUp** é uma plataforma gamificada de estudos e simulados voltada para vestibulandos e concurseiros (estilo "TikTok dos simulados"). Possui estética **Neo-Brutalista** moderna, áudio com síntese de voz (TTS) para acessibilidade, feed de resolução fluida, arena de batalha 1vs1 e trilhas de estudo.

---

## 📊 Acervo de Questões no Banco (Supabase)
O banco de dados conta atualmente com **398 questões oficiais e limpas do ENEM**, com gabarito oficial e explicações didáticas:

| Simulado | Quantidade de Questões | Status |
| :--- | :--- | :--- |
| **ENEM 2025 Oficial** (`enem-2025-oficial`) | 164 questões | ✅ Ativo e populado |
| **ENEM 2024 Oficial** (`enem-2024-oficial`) | 72 questões | ✅ Ativo e populado |
| **ENEM 2023 Oficial** (`enem-2023-oficial`) | 147 questões | ✅ Ativo e populado |
| **Mix Geral Randômico** (`enem-mix-completo`) | 398 questões | ✅ Sorteio dinâmico |

---

## 🛡️ Segurança Server-Side Blindada
- **Ocultação de Gabarito:** O endpoint `GET /api/questions` entrega apenas enunciado e alternativas. Ninguém consegue ver o gabarito ou a explicação via DevTools (F12) antes de responder.
- **Validação no Servidor:** O endpoint `POST /api/users/progress` recebe a alternativa marcada, consulta a questão no banco e valida o acerto no servidor antes de conceder XP e ofensivas (*streak*).

---

## 🛠️ Stack Tecnológica
- **Frontend / Backend:** Next.js 14 (App Router) + TypeScript + React 18
- **Estilização & Design:** Tailwind CSS (Paleta Neo-Brutalista: `#0A0A0B`, `#7C3AED`, `#22D3EE`, `#BEF264`) + Framer Motion
- **Banco de Dados & ORM:** PostgreSQL (Supabase) + Prisma ORM
- **Áudio / TTS:** OpenAI TTS API com fallback para Web Speech API
- **Build Status:** Compilação 100% aprovada (`npm run build` gerando todas as 22 rotas).

---

## 🚀 Próximas Etapas para Lançamento

1. **Subir para o GitHub:** Criar repositório e sincronizar código.
2. **Deploy na Vercel:** Conectar o repositório GitHub e configurar as variáveis de ambiente (`DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`).
3. **Domínio Próprio:** Apontar o domínio (ex: `simuladoup.com.br`) nos DNS da Vercel.
4. **Empacotamento Android (`.aab`):** Gerar o pacote oficial via Bubblewrap/TWA para o Google Play Console.
