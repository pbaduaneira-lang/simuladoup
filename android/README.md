# Android do SimuladoUp

Aplicativo Android baseado em Trusted Web Activity, gerado com Bubblewrap 1.27.0 e mantido como projeto Gradle.

- Pacote: `br.com.simuladoup.app`
- Versão inicial: `1.0.0`, código `1`
- Entrada: `https://www.simuladoup.com.br/app`
- Android mínimo: 7.0 (API 24), exigido por Android Browser Helper 2.7.4.
- Compile/target SDK: 36; Gradle 8.13; Android Gradle Plugin 8.10.1; Java 21 local.
- Sem anúncios, ID de publicidade, compras, notificações, câmera, microfone ou localização delegada.
- Fallback: Custom Tabs, sem WebView próprio. Sem tráfego HTTP em texto claro.

## Compilar

No PowerShell, execute `./android/build-android.ps1` a partir da raiz do repositório. O script aceita `-JavaHome` e `-AndroidSdk` para outros locais de instalação. Ele executa `bundleRelease`, `assembleRelease` e `lintRelease`.

Resultados:

- `app/build/outputs/bundle/release/app-release.aab`
- `app/build/outputs/apk/release/app-release.apk`

`signing/simuladoup-upload.jks` é a chave privada de upload; `signing/password.dpapi` contém a senha protegida pelo Windows para o usuário local. Esses arquivos não entram no Git nem no AAB. Guarde a chave e sua senha em backup privado antes de trocar ou reinstalar o Windows. O arquivo DPAPI sozinho não é uma cópia portátil da senha. Não publique a pasta `signing` nem envie seus arquivos por chat.

Em outra máquina, restaure a chave a partir do backup privado e configure novamente a senha local protegida. O AAB precisa continuar sendo assinado com a chave de upload registrada no Google Play.

## Google Play App Signing e domínio

O `public/.well-known/assetlinks.json` contém o certificado da chave local de upload, que permite validar o APK gerado localmente. Google Play App Signing usa seu próprio certificado para os APKs distribuídos pela loja.

Depois do primeiro upload, abra **Integridade do app → Assinatura de apps** no Play Console e copie a impressão **SHA-256 do certificado da chave de assinatura do app** (não a chave de upload). Acrescente essa impressão à lista `sha256_cert_fingerprints` do mesmo pacote no arquivo público, publique e confira o endpoint HTTPS. Impressões digitais de certificados são públicas; senhas e arquivos de chave não são.

O teste interno instalado pelo Google Play só deve ser considerado validado após essa configuração. Falha de verificação pode mostrar a barra de endereço do navegador.

## Verificar antes de produção

1. Conferir assinatura e estrutura do AAB e permissões finais.
2. Fazer upload na faixa de teste interno do app correto.
3. Atualizar Digital Asset Links com o certificado de assinatura do Google Play.
4. Instalar pelo link do teste interno e conferir abertura sem barra, navegação/voltar, cadastro/login, prática/correção, histórico, desafios, exclusão de conta e comportamento sem conexão.
5. Comparar capturas da loja com a interface instalada. As imagens atuais foram capturadas da versão web responsiva.
6. Confirmar que a conta de revisão fornecida no Play Console existe no SimuladoUp e consegue acessar os recursos.

Não foi configurada publicação automática nem armazenamento de credenciais do Google Play neste projeto.

## Atualizar

Para nova versão Android, aumente `versionCode` e `versionName` em `app/build.gradle` e mantenha `twa-manifest.json` consistente. Os arquivos Gradle incluem adaptações de assinatura, SDK mínimo, repositórios e segurança. Não execute `bubblewrap update` sem revisar as diferenças, pois ele pode sobrescrever essas adaptações. A parte web é publicada separadamente pela integração já existente com a Vercel.

O service worker guarda somente `offline.html`; páginas privadas, sessões, respostas e APIs não são colocadas em cache por ele.
