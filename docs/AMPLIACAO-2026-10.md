# Ampliação do acervo — 19/10/2026

Validação final retomada em 20/10/2026: 26 testes aprovados, incluindo uma resposta correta e uma incorreta para cada uma das 525 questões, preservação de versões históricas, filtros, esgotamento de seleção e isolamento de contas. TypeScript e ESLint aprovados. Compilação de produção aprovada. Navegador verificado em 390 × 844 e 1440 × 1000: escolha de ano/rodada, imagens, ampliação, cinco respostas, conclusão e continuidade sem repetir os cinco itens anteriores; sem erros de JavaScript.

525 questões, em comparação com as 41 iniciais. As 41 versões anteriores foram preservadas integralmente. As 484 adições usam reprodução sem perdas do documento oficial, com gabarito oficial e sem comentário pedagógico inventado.

| Matéria                | Questões |
| ---------------------- | -------: |
| Português e Linguagens |      113 |
| Inglês                 |       20 |
| Espanhol               |       12 |
| História               |       32 |
| Geografia              |       47 |
| Filosofia              |       32 |
| Sociologia             |       28 |
| Ciências da Natureza   |      122 |
| Matemática             |      119 |

Por ano: 2022 (115), 2023 (98), 2024 (173), 2025 (139). Natureza reúne Física, Química e Biologia. As classificações por disciplina são editoriais.

## Origem e conferência

Aplicação regular, caderno azul 1 no primeiro dia e amarelo 5 no segundo. Fontes: páginas oficiais de provas e gabaritos do Inep de [2022](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2022), [2023](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2023), [2024](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2024), [2025](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2025).

Os oito gabaritos foram lidos independentemente dos arquivos antigos: 740 entradas, incluindo as duas opções de idioma. Anuladas mantêm `null`, nunca A. Cada item publicado precisa corresponder exatamente à chave ano/aplicação/dia/caderno/idioma/número. As seis anuladas destes documentos não entram na prática.

Para a ampliação foram aceitos apenas recortes com sequência completa A–E e sem texto atravessando a área segura. Itens que continuam em outra coluna, apresentam geometria ambígua ou não passam nessas verificações ficam de fora. A reprodução deve preservar as figuras e o contexto. O texto-base da página 6 de 2025 acompanha individualmente as questões 6 a 10 da página 7. A revisão visual incluiu os quatro anos, duas línguas estrangeiras, questões de página inteira, gráficos e fórmulas.

O manifesto contém os 16 endereços oficiais e hashes dos PDFs, coordenadas/páginas dos recortes, segmentos de contexto e hashes das imagens. O build verifica todos os gabaritos, origens, versões e arquivos de imagem. Não são reutilizados os textos incompletos das importações antigas em quarentena.

Para conferir os PDFs e gabaritos novamente, instale PyMuPDF 2.0.0 e Pillow em um ambiente Python separado e execute `python scripts/rebuild-question-media.py DIRETORIO_DOS_PDFS --keys-only`. Sem `--keys-only`, o script também reproduz e compara as imagens; não aprova questões novas e não sobrescreve imagens alteradas.

## Prática

Rodadas de 5, 10 ou 20 questões e filtro por ano. A escolha por matéria continua disponível. A seleção prioriza itens fora do histórico consultado (até 2.000 respostas recentes da conta e até 2.000 registros locais). Se restarem menos questões novas que o tamanho pedido, a rodada usa apenas as restantes. A revisão começa na rodada seguinte, depois de esgotado esse conjunto. A conclusão mostra a quantidade disponível e oferece continuidade.

O histórico local é enviado no corpo de uma requisição protegida por origem, com tamanho limitado; nenhuma resposta correta é aceita do cliente. Contas consultam o próprio histórico com parâmetros SQL. Não há alteração na regra de XP, nas versões históricas, no login, no pagamento ou na assinatura Android.

As imagens têm ampliação por diálogo e cache imutável pelo hash no nome. Fórmulas e diagramas são visuais; não foi adicionada uma transcrição acessível validada para as novas reproduções. Os 41 itens textuais continuam disponíveis. O gabarito de cada item permanece acompanhado do link para a prova e para o documento oficial.
