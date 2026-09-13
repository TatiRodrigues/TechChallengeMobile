---
title: Build e deploy
description: Validação e publicação do aplicativo e da documentação
---

# Build e deploy

## Validação local

```bash
npm run type-check
npm run web
```

Teste também em dispositivo ou emulador, pois biometria, SecureStore e permissões de galeria possuem comportamento específico de plataforma.

## Aplicativo

O projeto está configurado para Expo SDK 57, com o pacote Android `br.com.alecrimwallet` e o perfil `preview` versionado em [eas.json](../../eas.json). Esse perfil gera um APK para instalação direta e distribuição interna. O projeto já está vinculado ao EAS (conta `tatianersouza88`, projeto `alecrim-wallet`); o `projectId` fica em `app.json` (`extra.eas.projectId`).

### 1. Login e variáveis de ambiente

```powershell
npm install --global eas-cli@24.3.0
eas login
eas env:push --environment preview --path .env
```

O comando `env:push` cadastra as seis variáveis `EXPO_PUBLIC_FIREBASE_*` no ambiente `preview` do EAS, para que o build remoto tenha a mesma configuração do `.env` local. Repita esse passo sempre que o `.env` mudar.

### 2. Gerar o APK

```powershell
eas build --platform android --profile preview
```

O build roda em servidores do EAS: compacta o projeto, gera (ou reaproveita) uma keystore Android gerenciada pelo EAS e produz um APK assinado. Ao final, o comando mostra a URL do artefato (`https://expo.dev/artifacts/eas/...apk`) e o build fica visível em `https://expo.dev/accounts/tatianersouza88/projects/alecrim-wallet/builds`.

### 3. Publicar no Firebase App Distribution

Baixe o APK gerado e publique-o para os testadores cadastrados no App Distribution do Firebase (App Android `br.com.alecrimwallet`, App ID `1:645482817461:android:72198b3ad47fe6a1fc9bfc`):

```powershell
curl.exe --location --output app.apk "<URL do artefato do build>"

npx firebase-tools appdistribution:distribute app.apk `
  --app "1:645482817461:android:72198b3ad47fe6a1fc9bfc" `
  --testers "tati.rodrigues88@hotmail.com,tati.rodrigues632@gmail.com" `
  --release-notes "Build de teste privado - Alecrim Wallet" `
  --project alecrim-wallet
```

Somente os e-mails passados em `--testers` (ou já cadastrados no console) recebem o convite e o link de instalação. Para adicionar um novo avaliador (por exemplo, quando o professor responsável for confirmado), inclua o e-mail dele em `--testers` e rode o comando de distribuição novamente — não é necessário gerar um novo build só para adicionar testadores.

Não versione o arquivo `.apk` baixado nem o remova do local temporário sem necessidade; ele não deve ser commitado no repositório.

Para atualizar uma versão, gere um novo build com o mesmo perfil (`eas build`) e distribua novamente (`appdistribution:distribute`), incrementando a versão se necessário. Não versionar `.env`, tokens de acesso ou credenciais administrativas.

Consulte sempre a [documentação versionada do Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) antes de alterar configurações, APIs nativas ou dependências do Expo.

## Web

```bash
npm run web
```

Para uma exportação estática, utilize o comando recomendado pela versão atual do Expo e valide autenticação, URLs do Storage e regras de CORS no ambiente publicado.

## Documentação

```bash
cd docs
npm install
npm run build
npm run serve
```

O site usa `baseUrl: '/TechChallengeMobile/'`, adequado para publicação no GitHub Pages do repositório.

O comando de build gera `docs/build`. Fazer o build ou versionar os fontes não publica automaticamente o site. Para GitHub Pages, configure **Settings → Pages → GitHub Actions** e um workflow que instale com `npm ci` em `docs`, execute `npm run build` e publique `docs/build` usando as ações de Pages. Nenhum workflow de publicação é criado por esta documentação.

Para outro domínio servido na raiz, ajuste `url` para a origem da hospedagem e `baseUrl` para `/` antes de compilar. Para servir o build localmente, use `npm run serve` e abra `http://localhost:3002/TechChallengeMobile/`.

## Variáveis de ambiente

Cadastre as seis variáveis `EXPO_PUBLIC_FIREBASE_*` no ambiente de build do **aplicativo**. Elas são públicas no bundle; não use essas variáveis para segredos administrativos. O site Docusaurus é independente e não precisa de Firebase, `.env` ou credenciais para compilar.
