---
sidebar_position: 2
title: Primeiros passos
description: Prepare o ambiente e execute o Alecrim Wallet
---

# Primeiros passos

## Pré-requisitos

- Node.js 22.13 ou superior na linha 22 (ambiente validado: 22.23.2).
- npm.
- Expo Go compatível com SDK 57 ou development build em um dispositivo/emulador.
- Um projeto Firebase para utilizar os fluxos autenticados.
- Para testar a versão distribuída: Android 7 ou superior e convite no Firebase App Distribution.

## Instalação

```bash
git clone https://github.com/TatiRodrigues/TechChallengeMobile.git
cd TechChallengeMobile
npm ci
```

## Configuração do Firebase

Copie o arquivo de exemplo e preencha os valores obtidos em **Firebase Console → Configurações do projeto → Seus aplicativos**:

```powershell
Copy-Item .env.example .env
```

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

No Firebase Console, habilite:

1. **Authentication → Sign-in method → Email/Password**.
2. **Cloud Firestore**.
3. **Storage**.

:::warning Ambiente obrigatório
O Firebase é necessário: não há usuário demo nem repositório local de transações. A inicialização dos serviços pode falhar com configuração inválida; login e cadastro também verificam as seis variáveis. Reinicie o Expo após alterar o ambiente.
:::

## Executando o aplicativo

| Comando | Ação |
|---|---|
| `npm start` | Abre o servidor de desenvolvimento do Expo |
| `npm run android` | Abre no Android |
| `npm run ios` | Abre no simulador iOS em macOS com Xcode |
| `npm run web` | Abre a versão Web |
| `npm run type-check` | Valida os tipos TypeScript |

```bash
npm start
```

No Windows, use Android ou Web. Um iPhone pode acessar o servidor pelo Expo Go compatível, mas o simulador iOS exige macOS. No aparelho físico, mantenha computador e celular na mesma rede e use o QR Code exibido pelo Expo.

## Testar o APK privado

Para gerar uma versão instalável sem Expo Go, consulte [Build e deploy](./build-e-deploy.md). O APK de preview é distribuído pelo Firebase App Distribution, que envia um convite para o e-mail cadastrado. Depois de aceitar o convite, instale o aplicativo pelo link recebido. O acesso fica limitado aos testadores adicionados à release.

## Executando esta documentação

```bash
cd docs
npm ci
npm start
```

A documentação fica disponível em `http://localhost:3002/TechChallengeMobile/`.

## Primeiro acesso

1. Selecione **Criar conta**.
2. Informe nome completo, e-mail e uma senha com pelo menos seis caracteres.
3. Após o cadastro, o Firebase mantém a sessão autenticada.
4. No próximo login por senha em dispositivo compatível, mantenha **Lembrar de mim** ativo para habilitar o atalho biométrico. O cadastro não salva essas credenciais.

## Solução de problemas

| Sintoma | O que verificar |
|---|---|
| Firebase não configurado | Preencher as seis variáveis, sem copiar valores da documentação de outro projeto, e reiniciar o Expo |
| `permission-denied` no Firestore | Regras do projeto Firebase e identificação pelo UID em `userId` |
| Erro de upload | Bucket, regras do Storage, conexão e permissões da galeria |
| Biometria indisponível | Plataforma nativa, hardware/credencial cadastrada e login anterior com a opção de lembrar ativa |
| Porta 3002 ocupada | `npm start -- --port 3003` dentro da pasta da documentação |
