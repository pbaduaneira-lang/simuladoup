# Estado real do SimuladoUp

Atualizado em 17 de outubro de 2026.

Esta versão remove as cobranças e migra a implementação para Turso/libSQL com Better Auth. O acervo servido começa com 41 questões textuais de 2022, conferidas e versionadas. O restante do acervo antigo permanece em quarentena até revisão de conteúdo.

O Turso remoto foi configurado e validado com cadastro fictício, respostas, conclusão, reenvio, persistência em nova conexão, login e exclusão da conta de teste. Os 16 testes automatizados também passaram na pasta original do projeto. A versão ainda não foi publicada na hospedagem e os dados antigos do Supabase não foram transferidos. Consulte `docs/VERIFICACAO.md` para as evidências e `docs/MIGRACAO-TURSO.md` para as etapas restantes.

Nenhum banco antigo deve ser excluído. A publicação na loja e a preparação de PWA/TWA não fazem parte desta verificação.
