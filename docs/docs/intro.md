---
id: intro
slug: /
sidebar_position: 1
title: Bem-vindo
description: Documentação oficial do Alecrim Wallet Mobile
---

# Alecrim Wallet Mobile

O **Alecrim Wallet** é um aplicativo multiplataforma de controle financeiro pessoal desenvolvido com React Native, Expo e TypeScript. O projeto reúne autenticação Firebase, movimentações em tempo real, indicadores financeiros e suporte a recibos em uma experiência adaptável para Android, iOS e Web.

## O que o aplicativo oferece

- Dashboard com saldo, entradas, saídas, evolução mensal e gastos por categoria.
- Histórico com busca e filtros por tipo, categoria e período.
- Cadastro, edição e exclusão de movimentações.
- Upload de recibos para o Firebase Storage.
- Rascunho automático do formulário no dispositivo.
- Login, cadastro e recuperação de senha pelo Firebase Authentication.
- Entrada e desbloqueio por biometria ou credencial do dispositivo.
- Interface responsiva baseada em um design system próprio.

## Mapa da documentação

| Seção | Conteúdo |
|---|---|
| [Primeiros passos](./primeiros-passos.md) | Instalação, Firebase e execução local |
| [Funcionalidades](./funcionalidades.md) | Recursos disponíveis para o usuário |
| [Arquitetura](./arquitetura.md) | Camadas, dependências e fluxo de dados |
| [Firebase e dados](./firebase-e-dados.md) | Autenticação, Firestore, Storage e modelo |
| [Configuração Expo](./configuracao-expo.md) | Plataformas, recursos nativos e ambiente |
| [Design system](./design-system.md) | Tokens visuais e padrões de interface |
| [Build e deploy](./build-e-deploy.md) | Validação e publicação multiplataforma |

## Stack principal

| Tecnologia | Versão do projeto | Responsabilidade |
|---|---:|---|
| Expo | 57 | Toolchain e APIs nativas |
| React Native | 0.86 | Interface multiplataforma |
| React | 19 | Componentização e estado |
| TypeScript | 6 | Tipagem estática |
| React Navigation | 7 | Stack e navegação por abas |
| Firebase | 12 | Auth, Firestore e Storage |

:::tip Próximo passo
Siga o guia de [primeiros passos](./primeiros-passos.md) para configurar o Firebase e iniciar o aplicativo.
:::

## Escopo

A organização editorial segue a documentação do projeto `tech_challenge_fiaap`: primeiros passos, arquitetura, serviços, design system e contribuição. Aqui o conteúdo descreve o aplicativo mobile, não o frontend Next.js da referência. Redux, BFF, Docker, SSR e Module Federation não estão implementados neste app.
