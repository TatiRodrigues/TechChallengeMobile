---
title: Configuração Expo
description: Configuração efetiva do aplicativo Alecrim Wallet no Expo SDK 57
---

# Configuração Expo

O aplicativo usa **Expo SDK 57**. A configuração declarativa está em `app.json`; o ponto de entrada do bundle é `index.ts`, que registra o `App.tsx`.

## Identidade e comportamento

| Propriedade | Valor atual | Efeito |
|---|---|---|
| Nome | `Alecrim Wallet` | Nome exibido pelo aplicativo |
| Slug | `alecrim-wallet` | Identificador do projeto Expo |
| Versão | `1.0.0` | Versão do aplicativo declarada |
| Scheme | `alecrimwallet` | Esquema de deep link configurado |
| Orientação | `portrait` | Interface limitada ao modo retrato |
| Tema | `light` | Interface configurada para modo claro |

## Plataformas

### Android

- Ícone adaptativo com imagens de primeiro plano, fundo e monocromática.
- Cor de fundo do ícone: `#E6F4FE`.
- `predictiveBackGestureEnabled: false`.

### iOS

- Suporte a tablets: `true`.
- A descrição para Face ID informa que o recurso é usado para entrada rápida no Alecrim Wallet.

### Web

- Favicon definido em `assets/favicon.png`.
- A interface é renderizada por React Native Web.
- Autenticação biométrica via `expo-local-authentication` não é oferecida na Web pelo serviço atual.

## Recursos nativos utilizados

| Recurso | Pacote | Uso no projeto |
|---|---|---|
| Área segura | `react-native-safe-area-context` | Provider raiz, cabeçalho e barra de abas |
| Galeria | `expo-image-picker` | Seleção de imagens de recibo |
| Arquivos | `expo-document-picker` | Seleção de documentos PDF para anexos |
| Sistema de arquivos | `expo-file-system/legacy` | Upload binário e cache temporário de PDFs em Android/iOS |
| Conteúdo Web nativo | `react-native-webview` | Renderização interna de PDFs com PDF.js em Android/iOS |
| Autenticação local | `expo-local-authentication` | Biometria ou credencial do aparelho |
| Armazenamento seguro | `expo-secure-store` | E-mail e senha do atalho biométrico |
| Armazenamento simples | `@react-native-async-storage/async-storage` | Sessão Firebase e rascunho do formulário |

## Deep links

O custom scheme `alecrimwallet` está definido em `app.json`. Isso registra o aplicativo para receber URLs com o formato:

```text
alecrimwallet://
```

O scheme é uma configuração de build. Depois de criar ou alterar esse valor, gere e instale um novo development build ou uma nova build distribuível para que Android/iOS registrem o esquema. Essa configuração não altera o esquema usado pelo Expo Go, que utiliza `exp://` durante o desenvolvimento.

### Testar a abertura do aplicativo

Com uma build instalada no emulador ou dispositivo, use o utilitário oficial:

```powershell
npx uri-scheme open alecrimwallet:// --android
npx uri-scheme open alecrimwallet:// --ios
```

O comando acima valida que o sistema operacional encaminha a URL para o Alecrim Wallet.

### Rotas suportadas

O `NavigationContainer` usa a configuração tipada em `src/navigation/linking.ts` para interpretar os caminhos abaixo:

| URL | Destino |
|---|---|
| `alecrimwallet://login` | Tela de login |
| `alecrimwallet://cadastro` | Tela de cadastro |
| `alecrimwallet://perfil` | Tela de alteração de cadastro |
| `alecrimwallet://resumo` | Aba Resumo |
| `alecrimwallet://historico` | Aba Histórico |
| `alecrimwallet://transacoes` | Nova movimentação |
| `alecrimwallet://transacoes/:transactionId` | Edição da movimentação identificada |

As rotas internas exigem sessão autenticada. Se o aplicativo estiver bloqueado, `AppLockScreen` é apresentado antes da área principal. Android App Links e iOS Universal Links exigem configuração adicional de domínio e não estão declarados neste repositório.

## Variáveis de ambiente

O Expo disponibiliza as variáveis `EXPO_PUBLIC_*` como `process.env.EXPO_PUBLIC_*` no bundle. A configuração Firebase está em `src/services/firebase.ts` e depende destas seis chaves:

```dotenv
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Depois de alterar `.env`, reinicie o servidor Expo. Essas variáveis são configurações públicas de cliente; credenciais administrativas não pertencem a elas.

## EAS Build

O projeto está vinculado ao EAS (conta `tatianersouza88`, projeto `alecrim-wallet`), com `extra.eas.projectId` gravado em `app.json`. O identificador Android é `br.com.alecrimwallet`, e o perfil `preview` em [eas.json](../../eas.json) gera um APK assinado para distribuição interna. Detalhes do fluxo de build e publicação estão em [Build e deploy](./build-e-deploy.md).

## Limites atuais

- Não há `app.config.js` versionado; a configuração é estática em `app.json`.
- O projeto não declara permissões extras em `app.json`; a biblioteca de seleção solicita acesso à galeria em tempo de execução.
- O modo claro é uma decisão de configuração: alternar o tema do sistema não adiciona suporte automático a tema escuro à interface.

Consulte o [guia versionado do Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) antes de modificar dependências Expo, configuração nativa ou comportamento de plataforma.
