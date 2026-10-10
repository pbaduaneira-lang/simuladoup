# 🚀 Status e Checkpoint Geral do Projeto SimuladoUp

**Data do Checkpoint:** 10 de Outubro de 2026  
**Status Atual:** 🟢 **100% EM PRODUÇÃO NA VERCEL E NO GITHUB - PRONTO PARA A GOOGLE PLAY STORE**

---

## 🎯 1. Resumo do Produto e Conquistas de Hoje

O **SimuladoUp** é uma plataforma educacional gamificada estilo *"TikTok dos Simulados"*, com estética **Neo-Brutalista** moderna, áudio com síntese de voz (TTS) para acessibilidade, feed contínuo de resolução de questões, arena de batalha 1vs1 em tempo real e trilhas personalizadas de estudo.

### 🏆 Conquistas e Correções Finalizadas Hoje:

1. **Correção Definitiva do Fluxo de Cadastro e Autenticação:**
   - Resolvido o erro `Failed to fetch` ao criar conta no navegador.
   - Adicionada proteção de rede em bloco `try/catch`, login automático pós-cadastro e mensagens amigáveis em português claro (avisando caso haja bloqueadores como AdBlock ou Brave Shields interferindo no Supabase).
   - Rota `/api/auth/register` atualizada para verificar com segurança a existência do usuário por ID ou por E-mail antes de criar ou atualizar, prevenindo falhas de chave única no PostgreSQL.
2. **Desacoplamento do Usuário de Teste (`TEST_USER_ID` -> Usuário Real Logado):**
   - O feed agora recupera a sessão ativa do usuário com `supabase.auth.getSession()`, computando XP, streaks e histórico de respostas diretamente no perfil de quem está jogando.
3. **Purificação e Auditoria Completa do Acervo:**
   - **113 questões foram excluídas permanentemente:** removidas questões que dependiam de imagens ausentes (gráficos, mapas, charges, tirinhas da Mafalda sem imagem), alternativas quebradas de OCR e questões duplicadas.
4. **Ingestão Oficial do ENEM 2022 (Caderno 1 Azul):**
   - Inseridas **41 questões oficiais do ENEM 2022** puramente textuais e conceituais, com textos integrais e gabarito oficial alinhado ao cartão-resposta do INEP.
   - O acervo agora conta com **321 questões de elite**, 100% textuais, íntegras e com gabarito auditado.
5. **Novo Card de Enunciado no Feed com Suporte a Textos de Interpretação:**
   - Implementado o parser `parseEnunciado` que detecta a tag do ENEM e separa com destaque o **Texto de Interpretação / Apoio** da **Pergunta / Comando**.
   - Caixa com badge `📖 Texto para Interpretação`, área de leitura ampliada (`max-h-[50vh]`) e preservação de quebras de linha (`whitespace-pre-wrap`) para crônicas e poemas.
6. **Blindagem Defensiva no Backend (`/api/questions`):**
   - Implementado filtro no Route Handler que impede o sorteio de questões com menções a figuras ou recursos visuais ausentes.
7. **Deploy de Produção Aprovado na Vercel & GitHub:**
   - Build de produção (`npx next build`) aprovado com código 0 em todas as 14 rotas.
   - Repositório sincronizado em [`https://github.com/pbaduaneira-lang/simuladoup.git`](https://github.com/pbaduaneira-lang/simuladoup.git) na branch `main`.

---

## 📊 2. Estrutura do Banco de Dados (Supabase PostgreSQL)

| Tabela / Recurso | Descrição / Quantidade |
| :--- | :--- |
| **`Question`** | **321 questões de elite auditadas** (Linguagens, Humanas, Natureza e Matemática) |
| **`Simulado: enem-2022-oficial`** | 41 questões oficiais puramente textuais do ENEM 2022 |
| **`Simulado: enem-2023-oficial`** | Questões oficiais auditadas do ENEM 2023 |
| **`Simulado: enem-2024-oficial`** | Questões oficiais auditadas do ENEM 2024 |
| **`Simulado: enem-2025-oficial`** | Questões puramente conceituais do acervo 2025 com textos restaurados |
| **`Simulado: enem-mix-completo`** | 321 questões consolidadas para sorteio aleatório |
| **`User` / `UserAnswer`** | Gestão de perfis, XP, streaks diários e histórico de acertos/erros |
| **`TrilhaDaSemana`** | Trilhas semanais personalizadas com foco nos pontos fracos do estudante |
| **`BattleRoom`** | Salas de duelo 1vs1 integradas com Supabase Realtime |

---

## 📋 3. Roteiro Passo a Passo para Segunda-Feira (Publicação na Google Play Store)

Na segunda-feira, executaremos este roteiro exato para empacotar e enviar o SimuladoUp para a Loja do Google:

### Etapa 1: Conexão do Domínio Próprio na Vercel (DNS)
1. Acessar o painel da Vercel no projeto **simuladoup** -> aba **Settings** -> **Domains**.
2. Adicionar o domínio customizado (ex: `simuladoup.com.br` e `www.simuladoup.com.br`).
3. No painel onde o domínio foi registrado (Registro.br, GoDaddy, Hostinger, etc.), apontar:
   - **Tipo A:** Host `@` -> IP `76.76.21.21`
   - **Tipo CNAME:** Host `www` -> `cname.vercel-dns.com`
4. Aguardar a emissão automática do certificado SSL (HTTPS) pela Vercel.

---

### Etapa 2: Configuração de PWA e Digital Asset Links (TWA)
1. **Manifesto Web (`public/manifest.json`):**
   - Configurar `display: "standalone"`, `orientation: "portrait"`, `theme_color: "#7C3AED"` e `background_color: "#0A0A0B"`.
   - Gerar ícones adaptativos Android de alta resolução em `public/icons/` (192x192, 512x512 e maskable).
2. **Associação do Domínio com o App Android (`assetlinks.json`):**
   - Criar o arquivo `public/.well-known/assetlinks.json`.
   - Inserir a declaração com o *Package Name* (ex: `com.simuladoup.app`) e a assinatura digital SHA-256 da chave `.keystore`.
   - *Finalidade:* Permite que o app abra em tela cheia (full-screen nativo), sem barra de URL do navegador.

---

### Etapa 3: Empacotamento do Android App Bundle (`.aab`)
1. Instalar a ferramenta oficial do Google para TWA:
   ```bash
   npm install -g @bubblewrap/cli
   ```
2. Inicializar o projeto Android a partir do domínio próprio:
   ```bash
   bubblewrap init --manifest https://seudominio.com.br/manifest.json
   ```
3. Gerar a chave criptográfica segura `.keystore` (guardando senha e alias de assinatura com segurança).
4. Compilar o pacote de produção para a loja:
   ```bash
   bubblewrap build
   ```
   - *Arquivo gerado:* `app-release-bundle.aab`.

---

### Etapa 4: Publicação no Google Play Console
1. Acessar [play.google.com/console](https://play.google.com/console) com a conta de desenvolvedor Google.
2. Criar um novo aplicativo: **SimuladoUp**.
3. **Ficha da Loja:**
   - Nome do app: *SimuladoUp - O TikTok dos Simulados ENEM*
   - Descrição curta e completa destacando gamificação, ofensivas diárias e áudio TTS.
   - Upload do ícone oficial (512x512) e capturas de tela do feed e batalhas.
4. **Políticas e Privacidade:**
   - Link da Política de Privacidade: `https://seudominio.com.br/app/termos` (já online).
   - Questionário de classificação indicativa (Livre / 10+).
   - Informações de segurança dos dados (autenticação segura e banco de dados criptografado).
5. **Produção / Faixa de Lançamento:**
   - Fazer upload do arquivo `app-release-bundle.aab`.
   - Enviar a versão para revisão do Google.

---

**Checkpoint registrado por Gravi 🚀. Tudo pronto e documentado para retornarmos na segunda-feira com força total e colocarmos o SimuladoUp na Play Store!**
