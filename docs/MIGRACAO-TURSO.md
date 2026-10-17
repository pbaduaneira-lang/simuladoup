# Migração de Supabase para Turso

O código novo não depende de Supabase ou Prisma. Autenticação, sessões, tentativas, respostas, relatórios e desafios usam Turso/libSQL; Better Auth administra as credenciais e cookies. O schema PostgreSQL antigo foi preservado em `docs/legacy-postgres-schema.prisma` apenas como referência.

## Estado e limites

O banco Supabase configurado no projeto antigo retornou erro de tenant/usuário não encontrado. Nenhum dado dele foi excluído ou alterado. A troca de código **não significa que as contas e os históricos antigos já foram transferidos**. As credenciais e sessões do Supabase também não são automaticamente válidas no Better Auth.

Sem URL/token de um Turso real, o que pode ser verificado é a aplicação com o driver libSQL e um arquivo local. Não anuncie a versão como migrada em produção antes de testar o banco remoto e a persistência entre reinicializações.

## Procedimento

1. Criar um banco Turso dedicado; manter o projeto antigo e os backups.
2. Configurar as quatro variáveis do README no servidor. Não reutilizar o segredo de desenvolvimento.
3. Executar a migração aditiva e os testes em um ambiente de validação.
4. Testar criação de conta, login, resposta, reenvio, conclusão, perfil, exclusão com senha e desafio com dois navegadores; reiniciar o servidor e conferir o histórico.
5. Recuperar acesso de leitura ao Supabase antigo antes de migrar históricos. Caso o REST esteja habilitado e haja uma chave administrativa local, `scripts/export-supabase.mjs` exporta as tabelas sem escrever no serviço. Pausar gravações durante a exportação para obter um backup consistente. Conferir contagens antes e depois.
6. Importar o backup com `node --env-file-if-exists=.env.local scripts/import-legacy.mjs .data/supabase-export.json`. O importador é transacional e idempotente por tabela e ID. Ele preserva os registros em `legacy_imports`, sem sobrescrever contas ativas ou introduzir questões não revisadas.
7. Associar dados antigos a contas novas somente após um fluxo verificado de titularidade. Não associar histórico privado usando apenas um e-mail digitado no cadastro. A importação de arquivo sozinha não ativa os históricos no painel.
8. Publicar somente depois da validação remota. Guardar um caminho de retorno para a versão anterior e nunca remover o Supabase apenas porque o build passou.

Exemplo de exportação local (requer acesso válido ao projeto antigo):

```powershell
node --env-file=.env scripts/export-supabase.mjs .data/supabase-export.json
```

O arquivo exportado contém dados pessoais e não deve ir para o Git, anexos públicos ou relatórios compartilhados. O app novo não envia e-mails de recuperação por enquanto; configurar esse provedor será necessário para recuperação de senha e para uma migração de titularidade por e-mail.

O modo sem conta pode ser usado enquanto os serviços de conta são preparados. Ele não sincroniza dados entre aparelhos e não promete persistência fora do navegador.
