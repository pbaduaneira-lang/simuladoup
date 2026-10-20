# SimuladoUp

Aplicativo gratuito de prática do ENEM. Next.js 16, React 19, Turso/libSQL e Better Auth. Sem assinaturas, cartão, checkout ou serviços pagos de IA na execução do app.

## Rodar localmente

Requer Node.js 22.18 ou superior (Node 24 recomendado).

```powershell
npm ci
# Crie .env.local conforme a seção abaixo.
npm run db:migrate
npm run dev
```

Abra http://localhost:3005. Sem `TURSO_DATABASE_URL`, o desenvolvimento utiliza `.data/simuladoup.db`. Esse arquivo é ignorado pelo Git. Em produção, o aplicativo exige Turso remoto para contas; nunca usa um arquivo temporário de hospedagem como banco persistente.

Exemplo de `.env.local` para desenvolvimento:

```dotenv
BETTER_AUTH_URL=http://localhost:3005
BETTER_AUTH_SECRET=SUBSTITUA_POR_UM_SEGREDO_ALEATORIO_DE_PELO_MENOS_32_CARACTERES
```

Gere o segredo com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Não envie segredos para o chat nem os versione.

## Conectar Turso

Use um banco dedicado a este app e configure:

```dotenv
TURSO_DATABASE_URL=libsql://SEU-BANCO.turso.io
TURSO_AUTH_TOKEN=SEU_TOKEN
BETTER_AUTH_URL=https://SEU_DOMINIO
BETTER_AUTH_SECRET=SEU_SEGREDO_ALEATORIO
```

As quatro variáveis são somente do servidor. Não use prefixo `NEXT_PUBLIC_`. Em produção, configure-as no provedor de hospedagem, reinicie a aplicação e verifique cadastro, login e persistência. `BETTER_AUTH_URL` precisa corresponder exatamente ao domínio usado no navegador; faz parte da proteção de origem.

`npm run db:migrate` aplica somente criações aditivas e idempotentes das tabelas. A primeira conexão do aplicativo também inicializa o esquema. Não executa exclusões ou seeds de questões antigas. O app gratuito não implica custo zero de hospedagem ou banco: acompanhe os limites do serviço escolhido.

## Verificar

```powershell
npm run catalogue:check
npm run typecheck
npm run lint
npm test
npm run build
```

Os testes HTTP iniciam um servidor e um banco SQLite/libSQL local exclusivo para testes. Cobrem login, tentativas, versões, todas as respostas do catálogo, reenvios, isolamento entre usuários, ranking opcional, desafios e exclusão com senha. Eles não certificam conectividade com um Turso remoto sem credenciais.

## Acervo e segurança

O único acervo servido é `src/data/approved-questions.json`: 525 questões oficiais do ENEM 2022 a 2025. O lote textual original de 41 questões mantém suas versões; 484 reproduções preservam os textos, imagens, fórmulas e alternativas das provas. Cada versão possui origem e hash. As letras foram conferidas nos oito gabaritos oficiais. Os novos itens têm gabarito e indicam explicitamente a ausência de comentário pedagógico revisado; não se apresenta uma resolução gerada como se fosse oficial. Veja [ampliação e evidências](docs/AMPLIACAO-2026-10.md).

Os arquivos de importação antigos ficam em quarentena. Os scripts antigos de seed e exclusão estão desativados. Veja [Acervo](docs/ACERVO.md), [Migração](docs/MIGRACAO-TURSO.md) e [Verificação](docs/VERIFICACAO.md).

Em uma tentativa autenticada, cada resposta é única por tentativa e questão. Gabarito, alternativa escolhida, tempo e versão ficam registrados. XP é calculado no servidor e concedido apenas no primeiro acerto de cada questão no dia de São Paulo. Sem conta, a prática funciona e registra histórico apenas no navegador, sem XP no ranking.

Contas usam cookies de sessão protegidos e o armazenamento de credenciais do Better Auth. Todas as rotas privadas consultam a sessão no servidor. Alterações de perfil têm uma lista explícita de campos permitidos. A recuperação de senha por e-mail depende de configurar um provedor de envio e não está habilitada nesta versão; não existe reset inseguro por e-mail informado pelo cliente.
