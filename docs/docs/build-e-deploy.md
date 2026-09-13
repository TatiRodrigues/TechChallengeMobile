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

O projeto está configurado para Expo SDK 57, com o pacote Android `br.com.alecrimwallet` e o perfil `preview` versionado em [eas.json](../../eas.json). Esse perfil gera um APK para instalação direta e distribuição interna.

```powershell
npx eas-cli@24.3.0 login
npx eas-cli@24.3.0 build --platform android --profile preview
```

O build é executado remotamente pelo EAS. Ao terminar, copie a URL do APK e publique o arquivo no **Firebase App Distribution** do projeto `alecrim-wallet`. Convide cada avaliador por e-mail; apenas os convidados terão acesso ao download e à instalação.

Para atualizar uma versão, gere um novo build com o mesmo perfil e crie uma nova release no App Distribution. Não versionar `.env`, tokens de acesso ou credenciais administrativas.

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
