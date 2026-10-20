# Verificação da versão 0.2.0

Registro histórico da auditoria de 17/10. Para a ampliação do acervo de 19/10, consulte [a verificação atual](AMPLIACAO-2026-10.md).

Verificação realizada em 17/10/2026, com Node 24 e Next.js 16.4.2.

## Acervo

O catálogo publicado contém 41 questões textuais do primeiro dia do ENEM 2022, caderno azul 1, com 205 alternativas. O vínculo entre enunciado, ordem das alternativas e gabarito foi conferido com os documentos oficiais. Os testes percorrem todas as questões aprovadas e verificam a resposta do servidor. Explicações são material de estudo elaborado, não resoluções oficiais.

Os arquivos antigos não alimentam o aplicativo. Gabaritos de espanhol de 2023 e registros de questões anuladas foram corrigidos nos arquivos históricos; todo conteúdo ainda não revisado permanece em quarentena. Isso reduz o acervo disponível, mas evita disponibilizar os registros incompletos identificados na auditoria.

## Aplicação

TypeScript, ESLint e compilação de produção aprovados. A suíte HTTP com libSQL local cobre cadastro e sessão, isolamento entre contas, validação de entrada e origem, alternativa E, correção das 41 questões, reenvio, limite de XP, perfil, ranking opcional, relatórios, desafios entre duas pessoas, versões históricas, detecção de adulteração e exclusão de conta com senha.

No navegador foram verificados painel, prática, explicação, conclusão, recuperação de falhas e apresentação em celular de 390 × 844. Métricas reais substituem os valores simulados; nenhuma cobrança é exigida pelo app.

## Turso remoto

O esquema aditivo foi aplicado no banco `simuladoup-edmilton`. Um teste HTTP com conta fictícia confirmou cadastro, sessão, quatro respostas corretas, conclusão, reenvio sem duplicar XP, histórico em nova conexão independente e recuperação por novo login. A exclusão ao final removeu somente a conta fictícia e seus dados; consultas independentes confirmaram a remoção de conta, sessões e histórico.

As credenciais ficam somente no ambiente e não devem ser versionadas. O token enviado pelo chat deve ser substituído pelo proprietário após a validação.

## Limites da entrega

- Não houve publicação em hospedagem nem teste sob carga de produção.
- Contas e históricos do Supabase antigo ainda não foram transferidos: o serviço antigo retornou erro de tenant/usuário não encontrado. Nenhum dado antigo foi apagado.
- Recuperação de senha por e-mail depende de configurar um provedor de envio.
- Questões com imagens ou texto incompleto e os demais anos só devem ser liberados após revisão das alternativas, recursos visuais e gabaritos.
- Antes de disponibilizar publicamente, configurar domínio/HTTPS e as quatro variáveis de ambiente da documentação na hospedagem; verificar o fluxo nesse domínio. O endereço local de desenvolvimento não substitui essa etapa.
- No desenvolvimento direto em `E:\simuladoup`, o monitor interno do Next no Windows registrou `Watchpack EINVAL` ao acessar `System Volume Information`. O aplicativo respondeu normalmente; testes e build passaram. O aviso permanece pendente no ambiente local.

Os testes demonstram os fluxos cobertos e não garantem ausência de qualquer falha futura.
