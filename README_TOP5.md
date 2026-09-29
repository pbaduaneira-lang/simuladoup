# 🏆 TOP 5 Funcionalidades Viciantes - SimuladoUp

Este guia explica como testar localmente cada uma das 5 funcionalidades virais e de retenção implementadas no projeto.

## Pré-requisitos
Antes de iniciar, certifique-se de ter configurado o seu arquivo `.env` com as seguintes variáveis:
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
OPENAI_API_KEY="..."
```
E certifique-se de que o banco de dados está atualizado:
```bash
npx prisma db push
```

---

## ⚔️ 1. Modo Batalha 1vs1 Ao Vivo
**Como testar:**
1. Navegue para `http://localhost:3000/app/batalha` (ou clique no botão no header, caso adicionado).
2. O sistema gerará automaticamente um `room` (ex: `?room=xpto123`) e você ficará na tela de "Aguardando Oponente".
3. Abra uma **nova aba anônima** e cole exatamente o mesmo link com o `room`.
4. Assim que a segunda aba abrir, o contador 3, 2, 1 se iniciará em ambas as telas simultaneamente (via Supabase Realtime).
5. Responda as questões (o primeiro a acertar ganha mais XP). Veja a tela de vitória no final com os confetes!

## 🔊 2. Explicação em Áudio (Tutor Up 30s)
**Como testar:**
1. Navegue para o Feed `http://localhost:3000/app`.
2. Responda uma das questões mockadas para revelar a "Explicação Up".
3. Clique no botão **[🔊 Ouvir em 30s]**.
4. O áudio será gerado dinamicamente pela API da OpenAI (modelo `tts-1`, voz `nova`) e cacheado no seu bucket `tts-audio` do Supabase. A animação *waveform* aparecerá e o áudio será reproduzido!

## 🔥 3. Streak com Anel de Fogo e Push Notification
**Como testar UI:**
1. Entre em qualquer rota dentro de `/app` (como `http://localhost:3000/app` ou `/app/trilha`).
2. No canto superior direito, você verá o widget fixo `[🔥 5 dias]` com um anel de progresso preenchendo 7/10 questões. (O mock visual já demonstra a animação circular estilo Apple Watch).

**Como testar a "Lógica" do Push (Mock):**
1. Ao longo do uso, caso a lógica fosse real, ela interagiria com o banco. O arquivo `/src/lib/push.ts` pode ser importado para testes manuais. Você verá o log no seu terminal/console do navegador simulando o disparo às 20h.

## 💊 4. Pílula de Ouro (Flashcard)
**Como testar:**
1. Navegue para o Feed `http://localhost:3000/app`.
2. O Feed possui questões infinitas (no mock, ele faz loop).
3. Responda 7 vezes clicando nas alternativas e avançando.
4. Na 7ª interação, a questão dará lugar ao card dourado **PÍLULA DE OURO**. Você notará que o fundo é dourado com uma sombra amarela brilhante (Neo-Brutalism).
5. Clique em qualquer um dos botões para prosseguir com o feed. A contagem volta ao rastreamento.

## 🧠 5. Modo Foco Pomodoro (25min) com Lo-Fi
**Como testar:**
1. Navegue para `http://localhost:3000/app/trilha`.
2. Clique no grande botão roxo **"🧠 ENTRAR EM MODO FOCO"**.
3. Um modal tela-cheia escuro será aberto, travando o scroll.
4. Um áudio lo-fi começará a tocar automaticamente de fundo (se o navegador bloquear autoplay, clique para pausar/despausar).
5. Um timer gigante de 25:00 começa a contagem decrescente.
6. Responda as questões do modo foco. Acertos disparam o clássico som de "moeda" e lançam alguns confetes dourados do centro da tela.
7. Se quiser ver a tela de finalização antes de 25 minutos passarem, você pode alterar temporariamente `const FOCUS_DURATION = 5;` em `FocusMode.tsx` para durar 5 segundos e presenciar o cálculo de XP bônus e a tela "FOCO CONCLUÍDO".
