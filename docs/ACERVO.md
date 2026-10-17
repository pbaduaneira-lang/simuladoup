# Política de integridade do acervo

O feed e os desafios utilizam exclusivamente o catálogo aprovado. O banco de versões registra o conteúdo imutável utilizado nas tentativas. Nenhuma cópia de simulado antigo entra na correção.

O catálogo inicial contém 41 questões textuais do ENEM 2022, dia 1, caderno azul 1, aplicação regular. As quatro questões estrangeiras desse lote são de inglês. As cinco alternativas de todas as 41 questões foram comparadas com o lote de referência revisado; os textos completos foram restaurados a partir da prova original. As letras foram comparadas com o gabarito oficial, incluindo a coluna do idioma.

## Publicação de novos itens

1. Identificar ano, aplicação, dia, caderno, idioma e número. Inglês e espanhol têm chaves diferentes.
2. Preservar textos compartilhados, imagens, tabelas, fórmulas e todas as alternativas. Escolher a leitura conforme o layout de cada página. Não recortar automaticamente toda página em duas colunas.
3. Reconhecer `Anulado`/`Anulada` como estado sem resposta. Falhar se faltar gabarito; jamais preencher A por padrão.
4. Conferir a alternativa correta pelo texto e pela letra, além da integridade dos distratores e do comando. Fazer revisão pedagógica da explicação.
5. Manter `QUARANTINED` até concluir a revisão. Registrar a evidência de conferência. Só depois gerar um novo ID com o hash do conteúdo aprovado.
6. Atualizar a referência oficial e os testes; executar `npm run catalogue:check`, `npm test` e `npm run build`.

O hash atesta que o conteúdo não mudou desde a aprovação; não substitui a revisão pedagógica de conteúdo novo. `scripts/lib/exam-key.mjs` implementa a leitura estrita das linhas de gabarito e rejeita ausências e conflitos. A extração automática antiga foi desativada.

## Problemas antigos

Os cinco gabaritos de espanhol de 2023 foram corrigidos nos arquivos antigos. Os registros de 2023/177, 2024/102 e 2025/115,121,178 agora têm estado `ANNULLED` e `correta: null`. Todos os demais itens dessas importações permanecem em quarentena porque a qualidade do texto não foi demonstrada. Esses arquivos não alimentam o app.

Não apagar respostas de alunos para limpar o catálogo. Preserve as versões e marque um item como indisponível para novas tentativas. Respostas históricas antigas sem alternativa escolhida não podem ser recalculadas com segurança: não invente essa informação.
