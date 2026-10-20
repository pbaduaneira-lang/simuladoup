# Política de integridade do acervo

O feed e os desafios utilizam exclusivamente o catálogo aprovado. O banco de versões registra o conteúdo imutável utilizado nas tentativas. Nenhuma cópia de simulado antigo entra na correção.

O catálogo contém 525 questões oficiais de 2022 a 2025. As 41 questões textuais originais conservam seus IDs e versões. As 484 adições usam reproduções dos PDFs oficiais, incluindo as cinco alternativas, figuras, fórmulas e textos compartilhados. Ano, aplicação, dia, caderno, idioma e número identificam a entrada no gabarito. As imagens e os PDFs têm SHA-256 registrado em `src/data/catalogue-provenance.json`.

O estado `APPROVED` atesta a disponibilidade do enunciado, alternativas e vínculo com o gabarito. A disponibilidade de comentário é independente: `explanationStatus: "answer-key-only"` informa que não existe comentário pedagógico revisado. A interface não chama a confirmação da letra de resolução. Não há questões geradas por IA neste lote. A categorização por matéria é editorial; o Inep organiza a prova por áreas.

## Publicação de novos itens

1. Identificar ano, aplicação, dia, caderno, idioma e número. Inglês e espanhol têm chaves diferentes.
2. Preservar textos compartilhados, imagens, tabelas, fórmulas e todas as alternativas. Escolher a leitura conforme o layout de cada página. Não recortar automaticamente toda página em duas colunas.
3. Reconhecer `Anulado`/`Anulada` como estado sem resposta. Falhar se faltar gabarito; jamais preencher A por padrão.
4. Conferir a alternativa correta pela reprodução das alternativas e pela letra do gabarito, além da integridade dos distratores e do comando. Só publicar explicação após revisão pedagógica. Se publicar apenas o gabarito, exigir `explanationStatus: "answer-key-only"` e informar essa limitação ao estudante.
5. Manter `QUARANTINED` até concluir a revisão. Registrar a evidência de conferência. Só depois gerar um novo ID com o hash do conteúdo aprovado.
6. Atualizar a referência oficial e os testes; executar `npm run catalogue:check`, `npm test` e `npm run build`.

O hash atesta que o conteúdo não mudou desde a aprovação; não substitui a revisão pedagógica de conteúdo novo. `scripts/lib/exam-key.mjs` implementa a leitura estrita das linhas de gabarito e rejeita ausências e conflitos. A extração automática antiga foi desativada.

## Problemas antigos

Os cinco gabaritos de espanhol de 2023 foram corrigidos nos arquivos antigos. Os registros de 2023/177, 2024/102 e 2025/115,121,178 agora têm estado `ANNULLED` e `correta: null`. Todos os demais itens dessas importações permanecem em quarentena porque a qualidade do texto não foi demonstrada. Esses arquivos não alimentam o app.

Não apagar respostas de alunos para limpar o catálogo. Preserve as versões e marque um item como indisponível para novas tentativas. Respostas históricas antigas sem alternativa escolhida não podem ser recalculadas com segurança: não invente essa informação.
